import {CardSkill} from "../Cards";

export class BaseElementalSkillLogic {
  onRoundStart() {
  }

  onAfterSkillUsed(skillUsed: CardSkill) {
  }

  getDamage() {
    return 0;
  }
}
