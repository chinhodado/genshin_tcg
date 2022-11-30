import {Card} from "./Cards";

export enum ElementType {
  Pyro,
  Cryo,
  Hydro,
  Electro,
  Geo,
  Anemo,
  Dendro,
  Omni,
  Physical,
  Black,
  White,
  Empty
}

export const LetterElementMap: any = {
  P: ElementType.Pyro,
  C: ElementType.Cryo,
  H: ElementType.Hydro,
  E: ElementType.Electro,
  G: ElementType.Geo,
  A: ElementType.Anemo,
  D: ElementType.Dendro,
  B: ElementType.Black
}

export enum WeaponType {
  Claymore,
  Sword,
  Bow,
  Catalyst,
  Polearm
}

export enum CardType {
  Character
}

export type CardInDeck = {
  base: Card,
  currentHp: number
}

export enum CharacterSkillType {
  Normal,
  Skill,
  Burst,
  Special
}

export const ImageMap: any = {
  [ElementType.Anemo]: "Element_Anemo.svg",
  [ElementType.Cryo]: "Element_Cryo.svg",
  [ElementType.Electro]: "Element_Electro.svg",
  [ElementType.Geo]: "Element_Geo.svg",
  [ElementType.Dendro]: "Element_Dendro.svg",
  [ElementType.Hydro]: "Element_Hydro.svg",
  [ElementType.Pyro]: "Element_Pyro.svg",
  [ElementType.Omni]: "Omni.svg"
}
