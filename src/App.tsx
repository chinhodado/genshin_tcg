import React, {useCallback, useState} from 'react';
import './App.css';
import {ElementType} from "./Enum";
import {Cards} from "./Cards";

function App() {
  let [state, setState] = useState({
    dices: [[0, 0, 0, 0, 0, 0, 0, 0]],
    characters: [{
      base: Cards.Diluc,
      currentHp: 10
    }, {
      base: Cards.Ganyu,
      currentHp: 10
    }, {
      base: Cards.Xingqiu,
      currentHp: 10
    }]
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
  let imgPath = "img/cards/" + state.characters[0].base.img + ".webp";
  let imgPath2 = "img/cards/" + state.characters[1].base.img + ".webp";
  let imgPath3 = "img/cards/" + state.characters[2].base.img + ".webp";
  let activeChar = state.characters[0];
  return (
    <div id="main-container">
      <div id="left-panel">Event log</div>
      <div id="right-panel">
        <div id="top-field"></div>
        <div id="bottom-field">
          <div id="active-char-1">
            <img src={imgPath} alt="active-char-1" className="card"/>
          </div>
          <div id="bench1-char-1">
            <img src={imgPath2} alt="bench1-char-1" className="card"/>
          </div>
          <div id="bench2-char-1">
            <img src={imgPath3} alt="bench2-char-1" className="card"/>
          </div>
          <div id="dice-1">
            <table id="dice-table-1">
              <tbody>
                <tr>
                  <td><div id="dice-pyro-1" className="dice pyro">Pyro: {playerDices[ElementType.Pyro]}</div></td>
                  <td><div id="dice-cryo-1" className="dice cryo">Cryo: {playerDices[ElementType.Cryo]}</div></td>
                  <td><div id="dice-hydro-1" className="dice hydro">Hydro: {playerDices[ElementType.Hydro]}</div></td>
                  <td><div id="dice-electro-1" className="dice electro">Electro: {playerDices[ElementType.Electro]}</div></td>
                </tr>
                <tr>
                  <td><div id="dice-geo-1" className="dice geo">Geo: {playerDices[ElementType.Geo]}</div></td>
                  <td><div id="dice-anemo-1" className="dice anemo">Anemo: {playerDices[ElementType.Anemo]}</div></td>
                  <td><div id="dice-dendro-1" className="dice dendro">Dendro: {playerDices[ElementType.Dendro]}</div></td>
                  <td><div id="dice-omni-1" className="dice omni">Omni: {playerDices[ElementType.Omni]}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="active-char-1-skills">
            <div id="active-char-1-skills-label">
              Skills
            </div>
            <table id="active-char-1-skills-table">
              <tr>
                <td>Normal</td>
                <td>Skill</td>
                <td>Burst</td>
                <td>Special</td>
              </tr>
              <tr>
                <td>{activeChar.base.skills.normal.cost}</td>
                <td>{activeChar.base.skills.skill.cost}</td>
                <td>{activeChar.base.skills.burst.cost} + ({activeChar.base.skills.burst.energy}E)</td>
                <td></td>
              </tr>
            </table>
          </div>
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
