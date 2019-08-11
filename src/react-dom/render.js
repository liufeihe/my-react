import {setAttribute} from './dom.js';
import {createComponent, setComponentProps} from './diff.js';

const _render = (vnode)=> {
    if (vnode===undefined || vnode===null || typeof vnode==='boolean'){
        vnode = '';
    }
    if (typeof vnode === 'number'){
        vnode=String(vnode)
    }
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode);
    }

    if (typeof vnode.tag === 'function') {
        const component = createComponent(vnode.tag, vnode.attrs);
        setComponentProps(component, vnode.attrs);
        return component.base;
    }

    const dom = document.createElement(vnode.tag);
    if (vnode.attrs) {
        Object.keys(vnode.attrs).forEach(key=>{
            const value = vnode.attrs[key];
            setAttribute(dom, key, value);
        })
    }

    vnode.children.forEach(child=>{
        render(child, dom);
    })

    return dom;
}

const render = (vnode, container)=>{
    return container.appendChild(_render(vnode));
}

export {
    render,
    _render
};