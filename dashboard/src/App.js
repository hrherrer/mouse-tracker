import React, { Component } from 'react';
import io from 'socket.io-client'

import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    mousePosition: {},
    screenDimensions: {},
    numberOfClicks: 0,
    distance: 0,
    seconds: 0,
    description: '',
    isAnyInputFocused: false,
    isTracking: false,
    history: []
  }

  componentDidMount() {
    this.interval = null

    this.socket = io('http://192.168.0.15:5000/web')

    this.socket.on('connect', () => {
      console.log('Connected to server')
    });

    this.socket.on('coordinates', (data) => {
      const pixelDistance = this.calculatePixelDistance(this.state.mousePosition, data.data)
      const DPI = this.calculateDPI(data.screen.width, data.screen.height, data.screen.inches)
      const centimeterDistance = pixelDistance * 2.54 / DPI

      this.setState((state) => ({
        mousePosition: data.data,
        screenDimensions: data.screen,
        distance: state.isTracking ? state.distance + centimeterDistance : 0
      }))
    })

    this.socket.on('new_click', (data) => {
      this.setState((state) => ({
        numberOfClicks: state.isTracking ? state.numberOfClicks + 1 : 0
      }))
    })

    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleInputFocus = (isFocused) => {
    this.setState({
      isAnyInputFocused: isFocused
    })
  }

  handleInputChange = (e) => {
    this.setState({
      description: e.target.value
    })
  }

  handleKeyDown = (e) => {
    if(e.keyCode === 32 && !this.state.isAnyInputFocused){
      this.setState((state) => ({
        isTracking: !state.isTracking
      }), () => {
        if (!this.state.isTracking) {
          this.resetValues()
        } else {
          this.startCounter()
        }
      })
    }
  }

  startCounter = () => {
    this.interval = setInterval(() => {
      this.setState((state) => ({
        seconds: state.seconds + 1
      }))
    }, 1000)
  }

  resetValues = () => {
    clearInterval(this.interval)

    const history = [ ...this.state.history ]

    history.unshift({
      name: this.state.description || '---',
      seconds: this.state.seconds,
      distance: this.state.distance,
      numberOfClicks: this.state.numberOfClicks
    })

    this.setState({
      distance: 0,
      seconds: 0,
      numberOfClicks: 0,
      history: history
    })
  }

  calculateDPI(w, h, inches) {
    return (Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))) / inches
  }

  calculatePixelDistance(coord1, coord2) {
        return Math.sqrt(Math.pow((coord2.y-coord1.y), 2) + Math.pow((coord2.x-coord1.x), 2)) || 0
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <h1>{ this.state.isTracking ? 'Capturando' : 'En espera' }</h1>
        <p>
          Descripción:
          <input
          type="text"
          value={ this.state.description }
          onChange={ this.handleInputChange }
          onBlur={() => this.handleInputFocus(false)}
          onFocus={() => this.handleInputFocus(true)}/>
        </p>
        <p>Coordenadas: { this.state.mousePosition.x || 0 } X { this.state.mousePosition.y ||  0 }</p>
        <p>Duración: { this.state.seconds } segundos</p>
        <p>Distancia: { this.state.distance } cm</p>
        <p>Cantidad de clics: { this.state.numberOfClicks }</p>
        <br/>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Segundos de Duración</th>
              <th>Distancia (cm)</th>
              <th>Cantidad de clics</th>
            </tr>
          </thead>
          <tbody>
          {this.state.history.map((item, index) => (
           <tr key={ index }>
             <td style={{ textAlign: 'center' }}>{item.name}</td>
             <td style={{ textAlign: 'center' }}>{item.seconds}</td>
             <td style={{ textAlign: 'center' }}>{item.distance}</td>
             <td style={{ textAlign: 'center' }}>{item.numberOfClicks}</td>

           </tr>
          ))}
          </tbody>

        </table>
      </div>
    );
  }
}

export default App;
