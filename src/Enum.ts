import {Card} from "./Cards";

export enum ElementType {
  Pyro,
  Cryo,
  Hydro,
  Electro,
  Geo,
  Anemo,
  Dendro,
  Omni
}

export type CardInDeck = {
  base: Card,
  currentHp: number
}
