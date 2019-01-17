import React, { Component } from 'react';
import io from 'socket.io-client'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    mouseX: 0,
    mouseY: 0,
    windowW: 0,
    windowH: 0,
    windowSize: 0,
    numberOfClicks: 0,
    isTracking: false
  }

  componentDidMount() {
    this.socket = io('http://192.168.0.15:5000/web')

    this.socket.on('connect', () => {
      console.log('Connected to server')
    });

    this.socket.on('coordinates', (data) => {
      this.setState({
        mouseX: data.data.x,
        mouseY: data.data.y,
        windowW: data.screen.width,
        windowH: data.screen.height,
        windowSize: data.screen.inches
      })
    })

    this.socket.on('new_click', (data) => {
      this.setState((state) => ({
        numberOfClicks: state.numberOfClicks + 1
      }))
    })
  }

  render() {
    return (
      <div>
        <span>{ this.state.mouseX } X { this.state.mouseY }</span>
      </div>
    );
  }
}

export default App;
