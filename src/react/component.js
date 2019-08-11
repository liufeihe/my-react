import {renderComponent} from '../react-dom/diff.js'

class Component {
    constructor(props={}){
        this.isReactComponent = true;
        this.state = {};
        this.props = props;
    }
    setState(stateChange){
        // Object.assign(this.state, stateChange);
        // renderComponent(this);

        enqueueSetState( stateChange, this );
    }
}

export default Component;