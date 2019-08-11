import React from './react';

class Welcome extends React.Component{
  render(){
    return (
      <h1>hello, {this.props.name}</h1>
    );
  }
}

class Counter extends React.Component{
  constructor(props){
    super(props);
    this.state = {num: 0}
  }
  componentWillUpdate(){
    console.log('update');
  }
  componentWillMount(){
    console.log('mount');
  }
  onClick(){
    this.setState({num: this.state.num+1});
  }
  render(){
    return (
      <div onClick={()=>this.onClick()}>
        <h1>number: {this.state.num}</h1>
        <button>add</button>
      </div>
    );
  }
}

class App extends React.Component{
    render(){
        return (
          <div>
            <h1 className="title">hello world.</h1>
            <Welcome name="Sara"/>
            <Welcome name="Cahal"/>
            <Welcome name="Edite"/>
            <Counter />
          </div>
        );
    }
}

// let App = (<h1 className="title">hello world.</h1>)

export default App;