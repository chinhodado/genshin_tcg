import React, {useCallback, useState} from 'react';
import './App.css';
import {ElementType} from "./Enum";

function App() {
  let [state, setState] = useState({
    dices: [[0,0,0,0,0,0,0,0]]
  });

  let rollDiceCallback = useCallback((e: React.MouseEvent) => {
    let newDices = rollDice(state.dices[0]);
    setState(prevState => {
      return {
        ...prevState,
        dices: [newDices]
      }
    })
  }, [state.dices]);

  let playerDices = state.dices[0];
  return (
    <div id="main-container">
      <div id="left-panel">Event log</div>
      <div id="right-panel">
        <div id="top-field"></div>
        <div id="bottom-field">
          <div id="active-char-1"></div>
          <div id="bench1-char-1"></div>
          <div id="bench2-char-1"></div>
          <div id="dice-1">
            <table id="dice-table-1">
              <tr>
                <td><div id="dice-pyro-1" className="dice">Pyro: {playerDices[ElementType.Pyro]}</div></td>
                <td><div id="dice-cryo-1" className="dice">Cryo: {playerDices[ElementType.Cryo]}</div></td>
                <td><div id="dice-hydro-1" className="dice">Hydro: {playerDices[ElementType.Hydro]}</div></td>
                <td><div id="dice-electro-1" className="dice">Electro: {playerDices[ElementType.Electro]}</div></td>
              </tr>
              <tr>
                <td><div id="dice-geo-1" className="dice">Geo: {playerDices[ElementType.Geo]}</div></td>
                <td><div id="dice-anemo-1" className="dice">Anemo: {playerDices[ElementType.Anemo]}</div></td>
                <td><div id="dice-dendro-1" className="dice">Dendro: {playerDices[ElementType.Dendro]}</div></td>
                <td><div id="dice-omni-1" className="dice">Omni: {playerDices[ElementType.Omni]}</div></td>
              </tr>
            </table>
          </div>
          <div id="deck-1">Deck</div>
          <div id="action-box-1">
            <input type="button" value="Roll dice" onClick={rollDiceCallback}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function rollDice(current: number[]) {
  let arr = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < arr.length; i++) {
    let elem = randomIntFromInterval(0, 7);
    arr[elem]++
  }
  return arr;
}

function randomIntFromInterval(min: number, max: number) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export default App;
