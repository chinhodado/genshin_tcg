import Modal from "react-modal";
import React, {useState} from "react";
import {randomIntFromInterval} from "./Util";
import {ElementType} from "./Enum";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export type RollDiceDialogProps = {
  isOpen: boolean
  closeModal: any
}

function RollDiceDialog(props: RollDiceDialogProps) {
  let [rerollDone, setRerollDone] = useState(false);
  let [diceValues, setDiceValues] = useState([0,0,0,0,0,0,0,0]);
  let [selectedDices, setSelectedDices] = useState([false, false, false, false, false, false, false, false]);

  let imgMap: any = {
    [ElementType.Anemo]: "Element_Anemo.svg",
    [ElementType.Cryo]: "Element_Cryo.svg",
    [ElementType.Electro]: "Element_Electro.svg",
    [ElementType.Geo]: "Element_Geo.svg",
    [ElementType.Dendro]: "Element_Dendro.svg",
    [ElementType.Hydro]: "Element_Hydro.svg",
    [ElementType.Pyro]: "Element_Pyro.svg",
    [ElementType.Omni]: "Icon_CD_Carefree_Coin.webp"
  }

  function rollDice(isReroll: boolean) {
    let arr = [...diceValues];
    for (let i = 0; i < arr.length; i++) {
      if (isReroll && !selectedDices[i]) {
        continue;
      }
      arr[i] = randomIntFromInterval(0, 7);
    }

    setDiceValues(arr);
  }

  function onOpen() {
    rollDice(false);
    setRerollDone(false);
  }

  function rerollDice() {
    rollDice(true);
    setRerollDone(true);
    setSelectedDices([false, false, false, false, false, false, false, false]);
  }

  function onDiceClicked(idx: number) {
    if (rerollDone) {
      return;
    }
    setSelectedDices(prev => {
      let copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    })
  }

  function getDiceRows(idx: number) {
    let className = "dice-roll-box";
    if (selectedDices[idx]) {
      className += " clicked";
    }
    return (
      <td key={idx}>
        <img className={className}
             src={"img/" + imgMap[diceValues[idx]]}
             alt="dice"
             onClick={() => onDiceClicked(idx)}/>
      </td>
    );
  }

  return <Modal
    isOpen={props.isOpen}
    onAfterOpen={onOpen}
    style={customStyles}
    contentLabel="Roll Dice Dialog"
  >
    <div>
      <table>
        <tbody>
        <tr>
          {[0, 1, 2, 3].map(idx => getDiceRows(idx))}
        </tr>
        <tr>
          {[4, 5, 6, 7].map(idx => getDiceRows(idx))}
        </tr>
        </tbody>
      </table>
      <div>Select one or more dices to re-roll them (once)</div>
      <button onClick={rerollDice} disabled={rerollDone}>Reroll</button>
      <button onClick={() => props.closeModal(diceValues)}>Done</button>
    </div>
  </Modal>
}

export default RollDiceDialog;
