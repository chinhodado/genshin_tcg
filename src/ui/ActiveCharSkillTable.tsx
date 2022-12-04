import {CharacterSkillType} from "../Enum";
import {getSkillCostDisplay} from "../Util";
import React from "react";
import {CardInGame} from "../App";

export type ActiveCharSkillTableProps = {
  id: string
  char: CardInGame
  player: number
  doActiveCharSkill: (player: number, type: CharacterSkillType) => void
  openMessageDialog: (message: string) => void
}

function ActiveCharSkillTable(props: ActiveCharSkillTableProps) {
  function haveEnoughEnergy() {
    return props.char.currentEnergy >= props.char.base.skills.burst.energy;
  }

  function onBurstSkillChosen() {
    if (!haveEnoughEnergy()) {
      props.openMessageDialog("Not enough energy for burst!")
    }
    else {
      props.doActiveCharSkill(props.player, CharacterSkillType.Burst);
    }
  }

  let skills = props.char.base.skills;

  return (
    <div id={props.id}>
      <div className="active-char-skills-label">
        Skills
      </div>
      <table className="active-char-skills-table">
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
          <td onClick={() => props.doActiveCharSkill(props.player, CharacterSkillType.Normal)}>
            {getSkillCostDisplay(skills.normal.cost)}
          </td>
          <td onClick={() => props.doActiveCharSkill(props.player, CharacterSkillType.Skill)}>
            {getSkillCostDisplay(skills.skill.cost)}
          </td>
          <td onClick={onBurstSkillChosen}>
            {getSkillCostDisplay(skills.burst.cost)} + ({skills.burst.energy}E)
          </td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ActiveCharSkillTable;
