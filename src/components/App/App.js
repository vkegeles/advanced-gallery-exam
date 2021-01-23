import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import { debounce } from 'lodash';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      inputTag: 'art',
      load: true
    };
  }

  callback = () => console.log("succeed", this.state);
  getInputTag = () => { return this.state.inputTag };

  setLoad = debounce(() => {
    console.log("debounce")
    this.setState({ tag: this.getInputTag(), load: true }, this.callback)
  }, 1000);

  handleChange = (event) => {
    console.log("handleChange ")
    this.setState({ inputTag: event.target.value.toLowerCase(), load: false })
    this.setLoad();
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={this.handleChange} value={this.state.inputTag} />
        </div>
        <Gallery tag={this.state.tag} load={this.state.load} />
      </div>
    );
  }
}

export default App;
