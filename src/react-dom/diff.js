import {setAttribute} from './dom.js';
import {_render} from './render.js'
import Component from '../react/component.js';

const diff = (dom, vnode, container)=>{
  const ret = diffNode(dom, vnode);
  if (container && ret.parentNode !== container) {
      container.appendChild(ret);
  }
  return ret;
}

const diffNode = (dom, vnode)=>{
  let out = dom;
  if (vnode===undefined || vnode===null || vnode==='boolean'){
      vnode='';
  }
  if (typeof vnode==='number'){
      vnode = String(vnode);
  }

  //对比文本节点
  if (typeof vnode === 'string') {
      if (dom && dom.nodeType===3){
          if(dom.textContent!==vnode){
              dom.textContent = vnode;
          }
      } else {
          out = document.createTextNode(vnode);
          if (dom && dom.parentNode) {
              dom.parentNode.replaceChild(out, dom);
          }
      }
      return out;
  }

  //对比组件
  if (typeof vnode.tag === 'function') {
      return diffComponent(dom, vnode);
  }

  //对比非文本节点
  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag);
    if(dom){//类型不一样的话，直接将原来的子节点移动到新的DOM节点下
      [...dom.childNodes].map(out.appendChild);
      if(dom.parentNode){
        dom.parentNode.replaceChild(out,dom)
      }
    }
  }

  //对比子节点
  if (vnode.children && vnode.children.length>0 ||
      (out.childNodes&&out.childNodes.length>0)) {
    diffChildren(out, vnode.children);
  }

  //对比属性
  diffAttributes(out, vnode);

  return out;
}

const diffComponent = (dom, vnode)=>{
  let c = dom&&dom._component;
  let oldDom = dom;

  if (c&&c.constructor===vnode.tag) {//如果组件没有变化，则重新set props
    setComponentProps(c, vnode.attrs);
    dom = c.base;
  } else {//如果组件变化了，则移除旧的组件，并渲染新的组件
    if (c) {
      unmountComponent(c);
      oldDom = null;
    }

    c = createComponent(vnode.tag, vnode.attrs);
    setComponentProps(c, vnode.attrs);
    dom = c.base;

    if (oldDom && dom!==oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }

  return dom;
}

const diffChildren = (dom, vchildren)=>{
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {}

  if ( domChildren.length > 0 ) {
    for ( let i = 0; i < domChildren.length; i++ ) {
        const child = domChildren[ i ];
        const key = child.key;
        if ( key ) {
            keyed[ key ] = child;
        } else {
            children.push( child );
        }
    }
}

if ( vchildren && vchildren.length > 0 ) {

    let min = 0;
    let childrenLen = children.length;

    for ( let i = 0; i < vchildren.length; i++ ) {

        const vchild = vchildren[ i ];
        const key = vchild.key;
        let child;

        if ( key ) {

            if ( keyed[ key ] ) {
                child = keyed[ key ];
                keyed[ key ] = undefined;
            }

        } else if ( min < childrenLen ) {

            for ( let j = min; j < childrenLen; j++ ) {

                let c = children[ j ];

                if ( c && isSameNodeType( c, vchild ) ) {

                    child = c;
                    children[ j ] = undefined;

                    if ( j === childrenLen - 1 ) childrenLen--;
                    if ( j === min ) min++;
                    break;

                }

            }

        }

       // 对比
       child = diffNode( child, vchild );

       // 更新DOM
       const f = domChildren[ i ];
       if ( child && child !== dom && child !== f ) {
           // 如果更新前的对应位置为空，说明此节点是新增的
           if ( !f ) {
               dom.appendChild(child);
           // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
           } else if ( child === f.nextSibling ) {
               removeNode( f );
          // 将更新后的节点移动到正确的位置
           } else {
               // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
               dom.insertBefore( child, f );
           }
       }
    }
  }
}

const diffAttributes = (dom, vnode)=>{
  const old={};
  const attrs = vnode.attrs;
  for (let i=0; i<dom.attributes.length; i++) {
    let attr = dom.attributes[i];
    old[attr.name]=attr.value;
  }

  for (let name in old) {// 将不在新属性中的属性删除
    if (!(name in attrs)) {
      setAttribute(dom, name, undefined);
    }
  }

  for (let name in attrs){// 更新新的属性
    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name]);
    }
  }
}

const isSameNodeType = (dom, vnode)=>{
  if (typeof vnode==='string' || typeof vnode==='number'){
    return dom.nodeType === 3;
  }
  if (typeof vnode.tag==='string'){
    return dom.nodeName.toLowerCase()===vnode.tag.toLowerCase();
  }
  return dom&&dom._component&&dom._component.constructor === vnode.tag;
}

const renderComponent = (component)=>{
  let base;
  const renderer = component.render();
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }
  // base = _render(renderer);
  base = diff(component.base, renderer)
  if (component.base) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate();
    }
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  // if (component.base && component.base.parentNode) {
  //   component.base.parentNode.replaceChild(base, component.base);
  // }

  component.base = base;
  base._component = component;
}

const createComponent = (component, props)=> {
  let inst;
  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function(){
      return this.constructor(props);
    }
  }
  return inst;
}

const unmountComponent = (component)=>{
  if (component.componentWillUnmount) {
    component.componentWillUnmount();
  }
  removeNode(component.base);
}

const removeNode = (dom)=>{
  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }
}

const setComponentProps = (component, props)=> {
  if (!component.base) {
    if (component.componentWillMount) {
      component.componentWillMount();
    }
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }
  component.props = props;
  renderComponent(component)
}


export {
  renderComponent,
  createComponent,
  setComponentProps,
  diff
}