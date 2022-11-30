import React, {useCallback, useState} from 'react';
import './App.css';
import {CharacterSkillType, ImageMap} from "./Enum";
import {Card, Cards} from "./Cards";
import CardUI from "./ui/CardUI";
import CardDetailPopup from "./ui/CardDetailPopup";
import {getSkillCostDisplay, rawDicesToTotalDices} from "./Util";
import RollDiceDialog from "./ui/RollDiceDialog";
import SelectDiceCostDialog from "./ui/SelectDiceCostDialog";
import AvailableDiceUI from "./ui/AvailableDiceUI";
import ActiveCharSkillTable from "./ui/ActiveCharSkillTable";
import ActionBoxUI from "./ui/ActionBoxUI";

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
        rawDices: [result.sort()]
      }
    })
  }

  function confirmSelectDiceCostDialog(selectedDices: boolean[]) {
    setSelectDiceCostDialogOpened(false);

    let rawDices = state.rawDices[0];

    // state.rawDices and selectedDices should have same length
    if (rawDices.length !== selectedDices.length) {
      alert("not same length!")
    }

    let newRawDices: number[] = [];

    for (let i = 0; i < rawDices.length; i++) {
      if (!selectedDices[i]) {
        newRawDices.push(rawDices[i]);
      }
    }

    let newCountArr = rawDicesToTotalDices(newRawDices);
    setState(prevState => {
      return {
        ...prevState,
        totalDices: [newCountArr],
        rawDices: [newRawDices]
      }
    })
  }

  function cancelSelectDiceCostDialog() {
    setSelectDiceCostDialogOpened(false);
  }

  let rollDiceCallback = useCallback((_e: React.MouseEvent) => {
    openRollDiceDialog();
  }, []);

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

  function doActiveCharSkill(type: CharacterSkillType) {
    let cost = '';
    if (type === CharacterSkillType.Normal) {
      cost = state.activeChar.base.skills.normal.cost;
    }
    else if (type === CharacterSkillType.Skill) {
      cost = state.activeChar.base.skills.skill.cost;
    }
    else if (type === CharacterSkillType.Burst) {
      cost = state.activeChar.base.skills.burst.cost;
    }

    setSelectedSkillCostString(cost);
    openSelectDiceCostDialog();
  }

  return (
    <div id="main-container">
      <RollDiceDialog isOpen={isRollDiceDialogOpened} closeModal={closeRollDiceDialog}/>
      <SelectDiceCostDialog isOpen={isSelectDiceCostDialogOpened}
                            confirmFn={confirmSelectDiceCostDialog}
                            cancelFn={cancelSelectDiceCostDialog}
                            dices={state.rawDices[0]}
                            costString={selectedSkillCostString}/>
      {(state.isHovering || state.isClicked) && <CardDetailPopup card={getCardByUiId(state.idForCardDetail)}/>}
      <div id="left-panel">Event log</div>

      <div id="right-panel">
        <div id="top-field">
          <div id="player2-info"><h3>Player 2</h3></div>
          <CardUI card={state.activeChar} charPosition={0} id="active-char-2"
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI card={state.bench1Char} charPosition={1} id="bench1-char-2" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI card={state.bench2Char} charPosition={2} id="bench2-char-2" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>

          <AvailableDiceUI id="available-dice-2" rawDices={state.rawDices[0]}/>
          <ActiveCharSkillTable id="active-char-2-skills" char={state.activeChar.base} doActiveCharSkill={doActiveCharSkill}/>
          <ActionBoxUI id="action-box-2" onRollDiceClicked={rollDiceCallback}/>
        </div>

        <div id="bottom-field">
          <div id="player1-info"><h3>Player 1</h3></div>
          <CardUI card={state.activeChar} charPosition={0} id="active-char-1"
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI card={state.bench1Char} charPosition={1} id="bench1-char-1" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI card={state.bench2Char} charPosition={2} id="bench2-char-1" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>

          <AvailableDiceUI id="available-dice-1" rawDices={state.rawDices[0]}/>
          <ActiveCharSkillTable id="active-char-2-skills" char={state.activeChar.base} doActiveCharSkill={doActiveCharSkill}/>
          <ActionBoxUI id="action-box-1" onRollDiceClicked={rollDiceCallback}/>
        </div>
      </div>
    </div>
  );
}

export default App;
