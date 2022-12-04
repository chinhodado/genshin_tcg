import React, {useCallback, useState} from 'react';
import './App.css';
import {CharacterSkillType, ElementType, GameEventType} from "./Enum";
import {Card, Cards} from "./Cards";
import CardUI from "./ui/CardUI";
import CardDetailPopup from "./ui/CardDetailPopup";
import RollDiceDialog from "./ui/RollDiceDialog";
import SelectDiceCostDialog from "./ui/SelectDiceCostDialog";
import AvailableDiceUI from "./ui/AvailableDiceUI";
import ActiveCharSkillTable from "./ui/ActiveCharSkillTable";
import ActionBoxUI from "./ui/ActionBoxUI";
import {useImmer} from "use-immer";
import {DilucBurstLogic, DilucElementalSkillLogic} from "./data/Diluc";
import {BaseElementalSkillLogic} from "./data/BaseElementalSkillLogic";
import {BaseBurstLogic} from "./data/BaseBurstLogic";
import EventLogView from "./ui/EventLogView";

export type CardInGame = {
  base: Card
  currentHp: number
  currentEnergy: number
  eleSkillLogic?: BaseElementalSkillLogic
  burstLogic?: BaseBurstLogic
  infusion: ElementType
  affectedElements: ElementType[]
}

type AppState = {
  rawDices: number[][]
  activeChar: CardInGame[]
  bench1Char: CardInGame[]
  bench2Char: CardInGame[]
  round: number
}

export type GameEvent = {
  type: GameEventType
  player: number
  diceResult?: number[]
  charSwitch?: {
    oldActiveChar: string
    newActiveChar: string
  }
}

function App() {
  let [state, setState] = useImmer<AppState>({
    rawDices: [[], []],
    activeChar: [{
      base: Cards.Diluc,
      currentHp: 10,
      currentEnergy: 0,
      eleSkillLogic: new DilucElementalSkillLogic(),
      burstLogic: new DilucBurstLogic(),
      infusion: ElementType.Empty,
      affectedElements: []
    }, {
      base: Cards.Diluc,
      currentHp: 10,
      currentEnergy: 0,
      eleSkillLogic: new DilucElementalSkillLogic(),
      burstLogic: new DilucBurstLogic(),
      infusion: ElementType.Empty,
      affectedElements: []
    }],
    bench1Char: [{
      base: Cards.Ganyu,
      currentHp: 10,
      currentEnergy: 0,
      infusion: ElementType.Empty,
      affectedElements: []
    }, {
      base: Cards.Ganyu,
      currentHp: 10,
      currentEnergy: 0,
      infusion: ElementType.Empty,
      affectedElements: []
    }],
    bench2Char: [{
      base: Cards.Xingqiu,
      currentHp: 10,
      currentEnergy: 0,
      infusion: ElementType.Empty,
      affectedElements: []
    }, {
      base: Cards.Xingqiu,
      currentHp: 10,
      currentEnergy: 0,
      infusion: ElementType.Empty,
      affectedElements: []
    }],
    round: 0
  });
  const [isRollDiceDialogOpened, setRollDiceDialogOpened] = useState<boolean>(false);
  const [isSelectDiceCostDialogOpened, setSelectDiceCostDialogOpened] = useState<boolean>(false);
  const [selectedSkillCostString, setSelectedSkillCostString] = useState<string>("");

  // For displaying the card detail popup
  // TODO isClicked not used right now, may want to add handle for that later
  //  (click on card to make the card detail popup sticky)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCardClicked, setCardClicked] = useState<boolean>(false);
  const [isHovering, setHovering] = useState<boolean>(false);
  const [idForCardDetail, setIdForCardDetail] = useState<string>('');

  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [currentActiveCard, setCurrentActiveCard] = useState<CardInGame>(state.activeChar[0]);
  const [currentSkillType, setCurrentSkillType] = useState<CharacterSkillType>(CharacterSkillType.Normal);
  const [events, setEvents] = useImmer<GameEvent[]>([])

  function openRollDiceDialog() {
    setRollDiceDialogOpened(true);
  }

  function openSelectDiceCostDialog() {
    setSelectDiceCostDialogOpened(true);
  }

  function closeRollDiceDialog(player: number, result: number[]) {
    setRollDiceDialogOpened(false);
    let sortedRawDices = result.sort();

    setState(draft => {
      draft.rawDices[player] = sortedRawDices;
    })

    setEvents(draft => {
      draft.push({
        type: GameEventType.ROLL_DICE,
        player: player,
        diceResult: sortedRawDices
      })
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

    setState(draft => {
        draft.rawDices[player] = newRawDices;
    })

    performSkill(player, card, skillType);
  }

  function performSkill(player: number, card: CardInGame, skillType: CharacterSkillType) {
    let targetPlayer = player === 0? 1 : 0;
    let target = state.activeChar[targetPlayer];

    let dmg = 0;
    let energyToGain = 0;
    // TODO when does infusion last? forever/end of round?
    let infusion = ElementType.Empty;

    let targetAffectedElements = [...target.affectedElements];
    if (skillType === CharacterSkillType.Normal) {
      dmg = card.base.skills.normal.dmg;
      energyToGain += 1;
    }
    else if (skillType === CharacterSkillType.Skill) {
      dmg = card.eleSkillLogic?.getDamage() || 0; // TODO remove || 0
      energyToGain += 1;

      // TODO
      let elementToApply = card.base.skills.skill.dmgElement;
      if (!targetAffectedElements.includes(elementToApply)) {
        targetAffectedElements.push(elementToApply);
      }
    }
    else if (skillType === CharacterSkillType.Burst) {
      dmg = card.burstLogic?.getDamage() || 0; // TODO remove || 0
      infusion = card.burstLogic?.infusionAfterUse() || ElementType.Empty; // TODO remove ||

      // TODO
      let elementToApply = card.base.skills.burst.dmgElement;
      if (!targetAffectedElements.includes(elementToApply)) {
        targetAffectedElements.push(elementToApply);
      }
    }

    let newTargetHp = target.currentHp - dmg;

    let newSourceEnergy: number;
    if (skillType === CharacterSkillType.Burst) {
      newSourceEnergy = 0;
    }
    else {
      newSourceEnergy = Math.min(card.currentEnergy + energyToGain, card.base.skills.burst.energy);
    }

    if (card.eleSkillLogic) {
      card.eleSkillLogic.onAfterSkillUsed();
    }

    setState(draft => {
      draft.activeChar[targetPlayer].currentHp = newTargetHp;
      draft.activeChar[player].currentEnergy = newSourceEnergy;
      draft.activeChar[targetPlayer].affectedElements = targetAffectedElements;
    })

    if (infusion !== ElementType.Empty) {
      setState(draft => {
        draft.activeChar[player].infusion = infusion;
      })
    }
  }

  function cancelSelectDiceCostDialog() {
    setSelectDiceCostDialogOpened(false);
  }

  let rollDiceCallback = useCallback((player: number) => {
    setCurrentPlayer(player);
    openRollDiceDialog();
  }, []);

  function switchActiveChar(player: number, charPos: number) {
    let oldActiveChar = state.activeChar[player];
    let oldBenchChar = charPos === 1? state.bench1Char[player] : state.bench2Char[player];

    setState(draft => {
      draft.activeChar[player] = oldBenchChar;

      if (charPos === 1) {
        draft.bench1Char[player] = oldActiveChar;
      }
      else {
        draft.bench2Char[player] = oldActiveChar;
      }
    })

    setEvents(draft => {
      draft.push({
        type: GameEventType.SWITCH_CHARACTER,
        player: player,
        charSwitch: {
          oldActiveChar: oldActiveChar.base.name,
          newActiveChar: oldBenchChar.base.name
        }
      })
    })
  }

  function onMouseEnter(event: any) {
    if (isCardClicked) {
      return;
    }

    setHovering(true);
    setIdForCardDetail(event.target.id);
  }

  function onMouseLeave(_event: any) {
    if (isCardClicked) {
      return;
    }

    setHovering(false);
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
      {(isHovering || isCardClicked) && <CardDetailPopup card={getCardByUiId(idForCardDetail)}/>}
      <div id="left-panel">
        <h3>Event log</h3>
        <EventLogView events={events}/>
      </div>

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
