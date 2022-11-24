import {CardType, ElementType, WeaponType} from "./Enum";

export type Card = {
  id: number
  name: string
  img: string
  element: ElementType
  weapon: WeaponType
  cardType: CardType
  skills: {
    normal: {
      name: string
      cost: string
      desc: string
      dmg: number
      dmgElement: ElementType
    }
    skill: {
      name: string
      cost: string
      desc: string
      dmgElement: ElementType
    }
    burst: {
      name: string
      cost: string
      energy: number
      desc: string
      dmgElement: ElementType
    }
    special?: {
      name: string
      cost: string
      desc: string
      dmgElement: ElementType
    }
  }
}

export interface CardMap {
  [key: string]: Card;
}

export const Cards: CardMap = {
  "Diluc": {
    id: 1,
    name: "Diluc",
    element: ElementType.Pyro,
    weapon: WeaponType.Claymore,
    cardType: CardType.Character,
    img: "i_n330006",
    skills: {
      normal: {
        name: "Tempered Sword",
        cost: "BBP",
        desc: "Deals 2 Physical DMG.",
        dmg: 2,
        dmgElement: ElementType.Physical
      },
      skill: {
        name: "Searing Onslaught",
        cost: "PPP",
        desc: "Deals 3 Pyro DMG. For the third use of this Skill each Round, deals +2 DMG.",
        dmgElement: ElementType.Pyro,
      },
      burst: {
        name: "Dawn",
        cost: "PPPP",
        energy: 3,
        desc: "Deals 8 Pyro DMG. This character gains Pyro Infusion.",
        dmgElement: ElementType.Pyro,
      }
    }
  },
  "Xingqiu": {
    id: 2,
    name: "Xingqiu",
    element: ElementType.Hydro,
    weapon: WeaponType.Sword,
    cardType: CardType.Character,
    img: "i_n330004",
    skills: {
      normal: {
        name: "Guhua Style",
        cost: "BBH",
        desc: "Deals 2 Physical DMG.",
        dmg: 2,
        dmgElement: ElementType.Physical
      },
      skill: {
        name: "Fatal Rainscreen",
        cost: "HHH",
        desc: "Deals 2 Hydro DMG, grants this character Wet, creates 1 Rain Swords.",
        dmgElement: ElementType.Hydro,
      },
      burst: {
        name: "Raincutter",
        cost: "HHH",
        energy: 2,
        desc: "Deals 1 Hydro DMG, grants this character Wet, creates 1 Rain Swords and Rainbow Bladework.",
        dmgElement: ElementType.Hydro,
      }
    }
  },
  "Ganyu": {
    id: 3,
    name: "Ganyu",
    element: ElementType.Cryo,
    weapon: WeaponType.Bow,
    cardType: CardType.Character,
    img: "i_n330000",
    skills: {
      normal: {
        name: "Liutian Archery",
        cost: "BBC",
        desc: "Deals 2 Physical DMG.",
        dmg: 2,
        dmgElement: ElementType.Physical
      },
      skill: {
        name: "Trail of the Qilin",
        cost: "CCC",
        desc: "Deals 1 Cryo DMG, creates 1 Ice Lotus.",
        dmgElement: ElementType.Cryo,
      },
      burst: {
        name: "Celestial Shower",
        cost: "CCC",
        energy: 2,
        desc: "Deals 1 Cryo DMG, deals 1 Piercing DMG to all opposing characters on standby, summons 1 Sacred Cryo Pearl.",
        dmgElement: ElementType.Cryo,
      },
      special: {
        name: "Frostflake Arrow",
        cost: "CCCCC",
        desc: "Deals 2 Cryo DMG, deals 2 Piercing DMG to all opposing characters on standby.",
        dmgElement: ElementType.Cryo,
      }
    }
  }
}
