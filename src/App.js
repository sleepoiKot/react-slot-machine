import React, { Component } from 'react';
import './App.css';

import Slot from './components/Slot/Slot'

import banana from './images/banana.png'
import strawberry from './images/strawberry.png'
import orange from './images/orange.png'
import monkey from './images/monkey.png'
import jackpot from './images/jackpot.png'

const SLOTIMAGES = [banana, strawberry, orange, monkey]

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      slot1: Math.floor(Math.random() * 4),
      slot2: Math.floor(Math.random() * 4),
      slot3: Math.floor(Math.random() * 4),

      slotMachineStarted: false,
      stopButtonPressed: false,
      timer: [],
      timeout: [],

      jackpot: false,
      score: 100,

      gameOver: false
    }

    this.startButtonRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      if(!this.state.slotMachineStarted && !this.state.stopButtonPressed){
        this.startButtonRef.current.click()
      }
    }, 5000)
  }

  startSlotMachineHandler = (slotImg, slot, option) => {
    let pos = -150;
    let timerId = setInterval(() => {
      if (pos === 150) {
        this.setState({[slot]: Math.floor(Math.random() * 4)})
        pos = -150
      } else {
        pos = pos + 10;
        slotImg.style.top = pos + 'px';
      }
    }, 1)

    let timeoutId = setTimeout(() => {
      this.setState({slotMachineStarted: false, timer: [], timeout: []})
      clearInterval(timerId)
      slotImg.style.top = '0px'
      if(option) this.countScore()
    }, 10000)

    this.setState((prevState) => {
      return {
        slotMachineStarted: true,
        timer: [...prevState.timer, timerId],
        timeout: [...prevState.timeout, timeoutId]
      }
    })
  }

  countScore = () => {
    let score = 0

    if(this.state.slot1 === this.state.slot3) score = 10
    if(this.state.slot1 === this.state.slot2 || this.state.slot2 === this.state.slot3) score = 20
    if(this.state.slot1 === this.state.slot2 && this.state.slot2 === this.state.slot3 && !this.state.jackpot) score = 100

    if(this.state.slot1 === 3 && this.state.slot2 === 3 && this.state.slot3 === 3){
      this.setState((prevState) => {
        return {
          jackpot: true,
          score: prevState.score + 1000
        }
      })
      setTimeout(() => this.setState({jackpot: false}), 5000)

      return
    }

    this.setState((prevState) => {
      return {
        score: prevState.score + score
      }
    })

  }

  render() {
    let className = !this.state.slotMachineStarted ? 'App-Slot-Button' : 'App-Slot-Button-disabled'

    return (
      <div className="App">
        {this.state.gameOver ? <div>
          <h1>GAME OVER!</h1>
          <button onClick={() => this.setState({gameOver: false, score: 100})}>RESTART</button>
        </div> : <div>
          <div className="App-Jackpot" style={{ display: this.state.jackpot ? '' : 'none'}}>
            <img id="jackpot" src={jackpot} alt="jackpot" width="300" height="200"/>
          </div>
          <div style={{ display: !this.state.jackpot ? '' : 'none'}}>
            <h4>2 non-consecutive symbols = 10$</h4>
            <h4>2 consecutive symbols = 20$</h4>
            <h4>Same symbols = 100$</h4>
            <h4>JACKPOT (3 monkeys) = 1000$</h4>
          </div>
          <div className="App-Slot">
            <h1>Score: {this.state.score}$</h1>
            <Slot
              slotClass="App-Slot-1"
              id="slot1-img"
              src={SLOTIMAGES[this.state.slot1]}
              alt="slot1"
              width="300"
              height="200"/>
            <Slot
              slotClass="App-Slot-2"
              id="slot2-img"
              src={SLOTIMAGES[this.state.slot2]}
              alt="slot2"
              width="300"
              height="200"/>
            <Slot
              slotClass="App-Slot-3"
              id="slot3-img"
              src={SLOTIMAGES[this.state.slot3]}
              alt="slot3"
              width="300"
              height="200"/>
            <div>
              {!this.state.slotMachineStarted ? <button
                className={className}
                ref={this.startButtonRef}
                onClick={() => {
                  if(this.state.score <= 0) {
                    this.setState({gameOver: true})
                    return
                  }

                  this.setState((prevState) => {
                    return {
                      score: prevState.score - 10
                    }
                  })
                  let slotImg1 = document.getElementById("slot1-img");
                  let slotImg2 = document.getElementById("slot2-img");
                  let slotImg3 = document.getElementById("slot3-img");

                  if(this.state.timer.length !== 0 || this.state.timeout.length !== 0) return

                  this.startSlotMachineHandler(slotImg1, 'slot1')
                  setTimeout(() => this.startSlotMachineHandler(slotImg2, 'slot2'), 300);
                  setTimeout(() => this.startSlotMachineHandler(slotImg3, 'slot3', true), 600);
                }}><span>START </span></button> : <button
                  className={className}
                  onClick={() => {
                    let slotImg1 = document.getElementById("slot1-img");
                    let slotImg2 = document.getElementById("slot2-img");
                    let slotImg3 = document.getElementById("slot3-img");

                    if(this.state.timer.length !== 3 || this.state.timeout.length !== 3) return

                    this.setState({slotMachineStarted: false, stopButtonPressed: true})

                    clearInterval(this.state.timer[0])
                    clearTimeout(this.state.timeout[0])
                    slotImg1.style.top = '0px'

                    setTimeout(() => {
                      clearInterval(this.state.timer[1])
                      clearTimeout(this.state.timeout[1])
                      slotImg2.style.top = '0px'
                    }, 300);
                    setTimeout(() => {
                      clearInterval(this.state.timer[2])
                      clearTimeout(this.state.timeout[2])
                      slotImg3.style.top = '0px'
                      this.setState({ timeout: [], timer: []})

                      this.countScore()
                    }, 600);
                  }}><span>STOP </span></button>}
            </div>
          </div>
        </div>}
      </div>
    );
  }
}

export default App;
