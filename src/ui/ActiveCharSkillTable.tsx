import {CharacterSkillType} from "../Enum";
import {getSkillCostDisplay} from "../Util";
import React from "react";
import {Card} from "../Cards";

export type ActiveCharSkillTableProps = {
  id: string
  char: Card
  player: number
  doActiveCharSkill: (player: number, type: CharacterSkillType) => void
}

function ActiveCharSkillTable(props: ActiveCharSkillTableProps) {
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
            {getSkillCostDisplay(props.char.skills.normal.cost)}
          </td>
          <td onClick={() => props.doActiveCharSkill(props.player, CharacterSkillType.Skill)}>
            {getSkillCostDisplay(props.char.skills.skill.cost)}
          </td>
          <td onClick={() => props.doActiveCharSkill(props.player, CharacterSkillType.Burst)}>
            {getSkillCostDisplay(props.char.skills.burst.cost)} + ({props.char.skills.burst.energy}E)
          </td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ActiveCharSkillTable;
