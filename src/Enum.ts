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
  White
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
