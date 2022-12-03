import React, {useCallback, useState} from 'react';
import './App.css';
import {CharacterSkillType} from "./Enum";
import {Card, Cards} from "./Cards";
import CardUI from "./ui/CardUI";
import CardDetailPopup from "./ui/CardDetailPopup";
import {rawDicesToTotalDices} from "./Util";
import RollDiceDialog from "./ui/RollDiceDialog";
import SelectDiceCostDialog from "./ui/SelectDiceCostDialog";
import AvailableDiceUI from "./ui/AvailableDiceUI";
import ActiveCharSkillTable from "./ui/ActiveCharSkillTable";
import ActionBoxUI from "./ui/ActionBoxUI";
import {useImmer} from "use-immer";

export type CardInGame = {
  base: Card
  currentHp: number
  currentEnergy: number
}

type AppState = {
  totalDices: number[][]
  rawDices: number[][]
  activeChar: CardInGame[]
  bench1Char: CardInGame[]
  bench2Char: CardInGame[]
  isClicked: boolean
  isHovering: boolean
  idForCardDetail: string
}

function App() {
  let [state, setState] = useImmer<AppState>({
    totalDices: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
    rawDices: [[], []],
    activeChar: [{
      base: Cards.Diluc,
      currentHp: 10,
      currentEnergy: 0
    }, {
      base: Cards.Diluc,
      currentHp: 10,
      currentEnergy: 0
    }],
    bench1Char: [{
      base: Cards.Ganyu,
      currentHp: 10,
      currentEnergy: 0
    }, {
      base: Cards.Ganyu,
      currentHp: 10,
      currentEnergy: 0
    }],
    bench2Char: [{
      base: Cards.Xingqiu,
      currentHp: 10,
      currentEnergy: 0
    }, {
      base: Cards.Xingqiu,
      currentHp: 10,
      currentEnergy: 0
    }],

    // For displaying the card detail popup
    // TODO isClicked not used right now, may want to add handle for that later
    //  (click on card to make the card detail popup sticky)
    isClicked: false,
    isHovering: false,
    idForCardDetail: ''
  });
  const [isRollDiceDialogOpened, setRollDiceDialogOpened] = useState<boolean>(false);
  const [isSelectDiceCostDialogOpened, setSelectDiceCostDialogOpened] = useState<boolean>(false);
  const [selectedSkillCostString, setSelectedSkillCostString] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [currentActiveCard, setCurrentActiveCard] = useState<CardInGame>(state.activeChar[0]);
  const [currentSkillType, setCurrentSkillType] = useState<CharacterSkillType>(CharacterSkillType.Normal);

  function openRollDiceDialog() {
    setRollDiceDialogOpened(true);
  }

  function openSelectDiceCostDialog() {
    setSelectDiceCostDialogOpened(true);
  }

  function closeRollDiceDialog(player: number, result: number[]) {
    setRollDiceDialogOpened(false);
    let newCountArr = rawDicesToTotalDices(result);
    let sortedRawDices = result.sort();

    setState(draft => {
      draft.totalDices[player] = newCountArr;
      draft.rawDices[player] = sortedRawDices;
    })
  }

  function confirmSelectDiceCostDialog(player: number, card: CardInGame, skillType: CharacterSkillType, selectedDices: boolean[]) {
    setSelectDiceCostDialogOpened(false);

    let rawDices = state.rawDices[player];

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
    setState(draft => {
        draft.totalDices[player] = newCountArr;
        draft.rawDices[player] = newRawDices;
    })

    performSkill(player, card, skillType);
  }

  function performSkill(player: number, card: CardInGame, skillType: CharacterSkillType) {
    let targetPlayer = player === 0? 1 : 0;
    let target = state.activeChar[targetPlayer];

    let dmg = 0;
    let energyToGain = 0;
    if (skillType === CharacterSkillType.Normal) {
      dmg = card.base.skills.normal.dmg;
      energyToGain += 1;
    }

    let newTargetHp = target.currentHp - dmg;
    let newSourceEnergy = card.currentEnergy + energyToGain;

    setState(draft => {
      draft.activeChar[targetPlayer].currentHp = newTargetHp;
      draft.activeChar[player].currentEnergy = newSourceEnergy;
    })
  }

  function cancelSelectDiceCostDialog() {
    setSelectDiceCostDialogOpened(false);
  }

  let rollDiceCallback = useCallback((player: number) => {
    setCurrentPlayer(player);
    openRollDiceDialog();
  }, []);

  function switchActiveChar(player: number, charPos: number) {
    setState(draft => {
      let oldActiveChar = draft.activeChar[player];
      let oldBenchChar = charPos === 1? draft.bench1Char[player] : draft.bench2Char[player];

      draft.activeChar[player] = oldBenchChar;

      if (charPos === 1) {
        draft.bench1Char[player] = oldActiveChar;
      }
      else {
        draft.bench2Char[player] = oldActiveChar;
      }
    })
  }

  function onMouseEnter(event: any) {
    if (state.isClicked) {
      return;
    }

    setState(draft => {
      draft.isHovering = true;
      draft.idForCardDetail = event.target.id;
    });
  }

  function onMouseLeave(_event: any) {
    if (state.isClicked) {
      return;
    }

    setState(draft => {
      draft.isHovering = false;
    });
  }

  function getCardByUiId(id: string) {
    switch (id) {
      case 'active-char-1-img':
        return state.activeChar[0];
      case 'bench1-char-1-img':
        return state.bench1Char[0];
      case 'bench2-char-1-img':
        return state.bench2Char[0];
      case 'active-char-2-img':
        return state.activeChar[1];
      case 'bench1-char-2-img':
        return state.bench1Char[1];
      default: // bench2-char-2-img
        return state.bench2Char[1];
    }
  }

  function doActiveCharSkill(player: number, type: CharacterSkillType) {
    let cost = '';
    if (type === CharacterSkillType.Normal) {
      cost = state.activeChar[player].base.skills.normal.cost;
    }
    else if (type === CharacterSkillType.Skill) {
      cost = state.activeChar[player].base.skills.skill.cost;
    }
    else if (type === CharacterSkillType.Burst) {
      cost = state.activeChar[player].base.skills.burst.cost;
    }

    setSelectedSkillCostString(cost);
    setCurrentPlayer(player);
    setCurrentActiveCard(state.activeChar[player]);
    setCurrentSkillType(type);
    openSelectDiceCostDialog();
  }

  return (
    <div id="main-container">
      <RollDiceDialog player={currentPlayer} isOpen={isRollDiceDialogOpened} closeModal={closeRollDiceDialog}/>
      <SelectDiceCostDialog player={currentPlayer}
                            isOpen={isSelectDiceCostDialogOpened}
                            card={currentActiveCard}
                            skillType={currentSkillType}
                            confirmFn={confirmSelectDiceCostDialog}
                            cancelFn={cancelSelectDiceCostDialog}
                            dices={state.rawDices[currentPlayer]}
                            costString={selectedSkillCostString}/>
      {(state.isHovering || state.isClicked) && <CardDetailPopup card={getCardByUiId(state.idForCardDetail)}/>}
      <div id="left-panel">Event log</div>

      <div id="right-panel">
        <div id="top-field">
          <div id="player2-info"><h3>Player 2</h3></div>
          <CardUI player={1} card={state.activeChar[1]} charPosition={0} id="active-char-2"
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI player={1} card={state.bench1Char[1]} charPosition={1} id="bench1-char-2" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI player={1} card={state.bench2Char[1]} charPosition={2} id="bench2-char-2" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>

          <AvailableDiceUI id="available-dice-2" rawDices={state.rawDices[1]}/>
          <ActiveCharSkillTable player={1} id="active-char-2-skills" char={state.activeChar[1].base} doActiveCharSkill={doActiveCharSkill}/>
          <ActionBoxUI id="action-box-2" player={1} onRollDiceClicked={rollDiceCallback}/>
        </div>

        <div id="bottom-field">
          <div id="player1-info"><h3>Player 1</h3></div>
          <CardUI player={0} card={state.activeChar[0]} charPosition={0} id="active-char-1"
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI player={0} card={state.bench1Char[0]} charPosition={1} id="bench1-char-1" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
          <CardUI player={0} card={state.bench2Char[0]} charPosition={2} id="bench2-char-1" onCharSwitch={switchActiveChar}
                  onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>

          <AvailableDiceUI id="available-dice-1" rawDices={state.rawDices[0]}/>
          <ActiveCharSkillTable player={0} id="active-char-1-skills" char={state.activeChar[0].base} doActiveCharSkill={doActiveCharSkill}/>
          <ActionBoxUI id="action-box-1" player={0} onRollDiceClicked={rollDiceCallback}/>
        </div>
      </div>
    </div>
  );
}

export default App;
