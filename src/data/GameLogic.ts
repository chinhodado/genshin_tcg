import {CharacterSkillType, ElementType, GameEventType} from "../Enum";
import {CardSkill} from "../Cards";
import {isBasicElement} from "../Util";
import {CardInGame, GameState} from "../App";

export function performSkill(player: number, card: CardInGame, skillType: CharacterSkillType, costPaid: number[], state: GameState) {
  let targetPlayer = player === 0? 1 : 0;
  let target = state.activeChar[targetPlayer];

  let dmg = 0;
  let energyToGain = 0;
  // TODO when does infusion last? forever/end of round?
  let infusion = ElementType.Empty;

  let targetAffectedElements = [...target.affectedElements];
  let skill: CardSkill;

  if (skillType === CharacterSkillType.Normal) {
    skill = card.base.skills.normal;
    dmg = card.base.skills.normal.dmg as number;
    energyToGain += 1;
  }
  else if (skillType === CharacterSkillType.Skill) {
    skill = card.base.skills.skill;
    dmg = card.eleSkillLogic?.getDamage() || 0; // TODO remove || 0
    energyToGain += 1;
  }
  else if (skillType === CharacterSkillType.Burst) {
    skill = card.base.skills.burst;
    dmg = card.burstLogic?.getDamage() || 0; // TODO remove || 0
    infusion = card.burstLogic?.infusionAfterUse() || ElementType.Empty; // TODO remove ||
  }
  else {
    alert("unknown skill type");
    skill = card.base.skills.skill;
  }

  let elementToApply = skill.dmgElement;
  if (!targetAffectedElements.includes(elementToApply) && isBasicElement(elementToApply)) {
    targetAffectedElements.push(elementToApply);
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
    card.eleSkillLogic.onAfterSkillUsed(skill);
  }

  state = JSON.parse(JSON.stringify(state));
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

  setEvents(draft => {
    draft.push({
      type: GameEventType.USE_SKILL,
      player: player,
      diceUsed: costPaid,
      skillResult: {
        skill: skill,
        dmg: dmg
      }
    })
  })
}
