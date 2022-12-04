import {BaseElementalSkillLogic} from "./BaseElementalSkillLogic";
import {ElementType} from "../Enum";

export class DilucElementalSkillLogic extends BaseElementalSkillLogic {
  private skillUsedInRound: number;

  constructor() {
    super();
    this.skillUsedInRound = 0;
  }

  onRoundStart() {
    this.skillUsedInRound = 0;
  }

  onAfterSkillUsed() {
    this.skillUsedInRound++;
  }

  getDamage() {
    let dmg = 3;

    // TODO is additional dmg before or after reactions?
    if (this.skillUsedInRound === 2) {
      dmg += 2;
    }

    return dmg;
  }
}

export class DilucBurstLogic {
  infusionAfterUse() {
    return ElementType.Pyro;
  }

  getDamage() {
    return 8;
  }
}
