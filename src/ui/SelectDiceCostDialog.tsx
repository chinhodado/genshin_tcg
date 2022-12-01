import Modal from "react-modal";
import React, {useState} from "react";
import {ImageMap, LetterElementMap} from "../Enum";
import {canSatisfyCostRequirement, getSkillCostDisplay, isBasicElement} from "../Util";

export type SelectDiceCostDialogProps = {
  isOpen: boolean
  player: number
  confirmFn: (player: number, selectedDices: boolean[]) => void
  cancelFn: any
  dices: number[]
  costString: string
}

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

function SelectDiceCostDialog(props: SelectDiceCostDialogProps) {
  let [selectedDices, setSelectedDices] = useState<boolean[]>([]);
  let [lockedDices, setLockedDices] = useState<boolean[]>([]);

  function onOpen() {
    let initialSelectedDices = getInitialSelectedDices(props.costString, props.dices);
    setSelectedDices([...initialSelectedDices]);
    setLockedDices([...initialSelectedDices]);
  }

  function getInitialSelectedDices(cost: string, rawDices: number[]) {
    let selected = rawDices.map(_x => false);
    for (let i = 0; i < cost.length; i++) {
      let c = cost[i];
      let element = LetterElementMap[c];

      if (isBasicElement(element)) {
        for (let j = 0; j < rawDices.length; j++) {
          if (rawDices[j] === element && !selected[j]) {
            selected[j] = true;
            break;
          }
        }
      }
    }

    return selected;
  }

  function onDiceClicked(idx: number) {
    if (lockedDices[idx]) {
      return;
    }

    setSelectedDices(prev => {
      let copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    })
  }

  function getDiceCell(idx: number) {
    let className = "dice-roll-box";
    if (selectedDices[idx]) {
      className += " clicked";
    }
    return (
      <td key={idx}>
        <img className={className}
             src={"img/" + ImageMap[props.dices[idx]]}
             alt="dice"
             onClick={() => onDiceClicked(idx)}/>
      </td>
    );
  }

  function getDiceRows() {
    let rowArr = [];
    let cellArr = [];
    for (let i = 0; i < props.dices.length; i++) {
      if (i % 4 === 0) {
        cellArr = [];
      }

      cellArr.push(getDiceCell(i));

      if (i % 4 === 3 || i === props.dices.length - 1) {
        rowArr.push(<tr key={rowArr.length}>{cellArr}</tr>);
      }
    }

    return rowArr;
  }

  function getRawSelectedDices() {
    let arr = [];
    for (let i = 0; i < props.dices.length; i++) {
      if (selectedDices[i]) {
        arr.push(props.dices[i]);
      }
    }
    return arr;
  }

  let canSatisfyCost = canSatisfyCostRequirement(props.costString, getRawSelectedDices());
  let equalCostAndSelected = selectedDices.filter(x => x).length === props.costString.length;

  return <Modal
    isOpen={props.isOpen}
    onAfterOpen={onOpen}
    style={customStyles}
    contentLabel="Roll Dice Dialog"
  >
    <div id="select-cost-dialog">
      <table>
        <tbody>
        {getDiceRows()}
        </tbody>
      </table>
      <div>Select dices to satisfy cost: {getSkillCostDisplay(props.costString)}</div>

      <div className="dialog-bottom-buttons">
        <button onClick={() => props.confirmFn(props.player, selectedDices)} disabled={!canSatisfyCost || !equalCostAndSelected}>Confirm</button>
        <button onClick={props.cancelFn}>Cancel</button>
      </div>
    </div>
  </Modal>
}

export default SelectDiceCostDialog;
