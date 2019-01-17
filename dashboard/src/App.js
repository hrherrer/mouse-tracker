import React, { Component } from 'react';
import io from 'socket.io-client'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.socket = io('http://192.168.0.15:5000/web')

    this.socket.on('connect', () => {
      console.log('Connected to server')
    });

    this.socket.on('coordinates', (data) => {
      console.log(data)
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
