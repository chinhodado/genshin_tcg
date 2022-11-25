import React, {useCallback, useState} from 'react';
import './App.css';
import {ElementType} from "./Enum";
import {Card, Cards} from "./Cards";
import CardUI from "./CardUI";
import CardDetailPopup from "./CardDetailPopup";
import {getSkillCostDisplay} from "./Util";

export type CardInGame = {
  base: Card
  currentHp: number
}

function App() {
  let [state, setState] = useState({
    dices: [[0, 0, 0, 0, 0, 0, 0, 0]],
    activeChar: {
      base: Cards.Diluc,
      currentHp: 10
    },
    bench1Char: {
      base: Cards.Ganyu,
      currentHp: 10
    },
    bench2Char: {
      base: Cards.Xingqiu,
      currentHp: 10
    },
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

  function switchActiveChar(charPos: number) {
    setState(prevState => {
      let oldActiveChar = prevState.activeChar;
      let oldBenchChar = charPos === 1? prevState.bench1Char : prevState.bench2Char;

      let newState = {
        ...prevState,
        activeChar: oldBenchChar,
      }

      if (charPos === 1) {
        newState.bench1Char = oldActiveChar;
      }
      else {
        newState.bench2Char = oldActiveChar;
      }

      return newState;
    })
  }

  return (
    <div id="main-container">
      <CardDetailPopup card={state.activeChar}></CardDetailPopup>
      <div id="left-panel">Event log</div>
      <div id="right-panel">
        <div id="top-field"></div>
        <div id="bottom-field">
          <CardUI card={state.activeChar} charPosition={0} id="active-char-1"></CardUI>
          <CardUI card={state.bench1Char} charPosition={1} id="bench1-char-1" onCharSwitch={switchActiveChar}></CardUI>
          <CardUI card={state.bench2Char} charPosition={2} id="bench2-char-1" onCharSwitch={switchActiveChar}></CardUI>

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
              <thead>
                <tr>
                  <td>Normal</td>
                  <td>Skill</td>
                  <td>Burst</td>
                  <td>Special</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{getSkillCostDisplay(state.activeChar.base.skills.normal.cost)}</td>
                  <td>{getSkillCostDisplay(state.activeChar.base.skills.skill.cost)}</td>
                  <td>{getSkillCostDisplay(state.activeChar.base.skills.burst.cost)} + ({state.activeChar.base.skills.burst.energy}E)</td>
                  <td></td>
                </tr>
              </tbody>
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
