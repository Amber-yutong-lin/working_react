import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom'
import Page1 from './components/Page1.js'
import Page2 from './components/Page2.js'
import Page3 from './components/Page3.js'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" exact component={Page1} />
        <Route path="/page2" component={Page2} />
        <Route path="/page3/:id" component={Page3} />
      </div>
    );
  }
}

export default App;