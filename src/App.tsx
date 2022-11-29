import React, {useCallback, useState} from 'react';
import './App.css';
import {ElementType} from "./Enum";
import {Card, Cards} from "./Cards";
import CardUI from "./CardUI";
import CardDetailPopup from "./CardDetailPopup";
import {getSkillCostDisplay, rawDicesToTotalDices} from "./Util";
import RollDiceDialog from "./RollDiceDialog";
import SelectDiceCostDialog from "./SelectDiceCostDialog";

export type CardInGame = {
  base: Card
  currentHp: number
}

type AppState = {
  totalDices: number[][]
  rawDices: number[][]
  activeChar: {
    base: Card,
    currentHp: number
  }
  bench1Char: {
    base: Card,
    currentHp: number
  }
  bench2Char: {
    base: Card,
    currentHp: number
  }
  isClicked: boolean
  isHovering: boolean
  idForCardDetail: string
}

function App() {
  let [state, setState] = useState<AppState>({
    totalDices: [[0, 0, 0, 0, 0, 0, 0, 0]],
    rawDices: [[]],
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

    // For displaying the card detail popup
    // TODO isClicked not used right now, may want to add handle for that later
    //  (click on card to make the card detail popup sticky)
    isClicked: false,
    isHovering: false,
    idForCardDetail: ''
  });
  const [isRollDiceDialogOpened, setRollDiceDialogOpened] = React.useState(false);
  const [isSelectDiceCostDialogOpened, setSelectDiceCostDialogOpened] = React.useState(false);
  const [selectedSkillCostString, setSelectedSkillCostString] = React.useState("PP");

  function openRollDiceDialog() {
    setRollDiceDialogOpened(true);
  }

  function openSelectDiceCostDialog() {
    setSelectDiceCostDialogOpened(true);
  }

  function closeRollDiceDialog(result: number[]) {
    setRollDiceDialogOpened(false);
    let newCountArr = rawDicesToTotalDices(result);
    setState(prevState => {
      return {
        ...prevState,
        totalDices: [newCountArr],
        rawDices: [result]
      }
    })
  }

  function confirmSelectDiceCostDialog() {
    // TODO set state
    setSelectDiceCostDialogOpened(false);
  }

  function cancelSelectDiceCostDialog() {
    setSelectDiceCostDialogOpened(false);
  }

  let rollDiceCallback = useCallback((_e: React.MouseEvent) => {
    openRollDiceDialog();
  }, []);

  let playerDices = state.totalDices[0];

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

  function onMouseEnter(event: any) {
    if (state.isClicked) {
      return;
    }

    setState(prevState => ({
      ...prevState,
      isHovering: true,
      idForCardDetail: event.target.id
    }));
  }

  function onMouseLeave(_event: any) {
    if (state.isClicked) {
      return;
    }

    setState(prevState => ({
      ...prevState,
      isHovering: false,
    }));
  }

  function getCardByUiId(id: string) {
    if (id === 'active-char-1-img') {
      return state.activeChar;
    }
    else if (id === 'bench1-char-1-img') {
      return state.bench1Char;
    }
    else /*if (pos === 2)*/ {
      return state.bench2Char;
    }
  }

  return (
    <div id="main-container">
      <RollDiceDialog isOpen={isRollDiceDialogOpened} closeModal={closeRollDiceDialog}></RollDiceDialog>
      <SelectDiceCostDialog isOpen={isSelectDiceCostDialogOpened}
                            confirmFn={confirmSelectDiceCostDialog}
                            cancelFn={cancelSelectDiceCostDialog}
                            dices={state.rawDices[0]}
                            costString={selectedSkillCostString}/>
      {(state.isHovering || state.isClicked) && <CardDetailPopup card={getCardByUiId(state.idForCardDetail)}></CardDetailPopup>}
      <div id="left-panel">Event log</div>
      <div id="right-panel">
        <div id="top-field">
          <div id="player2-info"><h3>Player 2</h3></div>
        </div>
        <div id="bottom-field">
          <div id="player1-info"><h3>Player 1</h3></div>
          <CardUI card={state.activeChar} charPosition={0} id="active-char-1"
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}></CardUI>
          <CardUI card={state.bench1Char} charPosition={1} id="bench1-char-1" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}></CardUI>
          <CardUI card={state.bench2Char} charPosition={2} id="bench2-char-1" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}></CardUI>

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
                  <td onClick={openSelectDiceCostDialog}>{getSkillCostDisplay(state.activeChar.base.skills.normal.cost)}</td>
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

export default App;
