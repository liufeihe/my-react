import {setAttribute} from './dom.js';
import {_render} from './render.js'
import Component from '../react/component.js';

const renderComponent = (component)=>{
  let base;
  const renderer = component.render();
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }
  base = _render(renderer);
  if (component.base) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate();
    }
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base);
  }

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
  setComponentProps
}