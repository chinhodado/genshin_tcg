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
  let [selectedDices, setSelectedDices] = useState([]);

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

  function rollDice() {
    let arr = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < arr.length; i++) {
      arr[i] = randomIntFromInterval(0, 7);
    }

    setDiceValues(arr);
  }

  function onOpen() {
    rollDice();
    setRerollDone(false);
  }

  function rerollDice() {
    rollDice();
    setRerollDone(true);
  }

  function getDiceRows(idx: number) {
    return <td><img className="dice-roll-box" src={"img/" + imgMap[diceValues[idx]]} alt="dice"/></td>;
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
      <button onClick={props.closeModal}>Done</button>
    </div>
  </Modal>
}

export default RollDiceDialog;
