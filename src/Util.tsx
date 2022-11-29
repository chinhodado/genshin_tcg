import React from "react";
import {ElementType, LetterElementMap} from "./Enum";

export function getSkillCostDisplay(cost: string) {
  let html = [];
  for (let i = 0; i < cost.length; i++) {
    switch (cost[i]) {
      case 'P':
        html.push(<span className="pyro" key={i}>P</span>)
        break;
      case 'H':
        html.push(<span className="hydro" key={i}>H</span>)
        break;
      case 'C':
        html.push(<span className="cryo" key={i}>C</span>)
        break;
      case 'E':
        html.push(<span className="electro" key={i}>E</span>)
        break;
      case 'G':
        html.push(<span className="geo" key={i}>G</span>)
        break;
      case 'A':
        html.push(<span className="anemo" key={i}>A</span>)
        break;
      case 'D':
        html.push(<span className="dendro" key={i}>D</span>)
        break;
      case 'B':
        html.push(<span className="omni" key={i}>B</span>)
        break;
    }
  }

  return html;
}

export function getElementDisplay(element: ElementType, s: string) {
  switch (element) {
    case ElementType.Pyro:
      return <span className="pyro">{s}</span>
    case ElementType.Hydro:
      return <span className="hydro">{s}</span>
    case ElementType.Cryo:
      return <span className="cryo">{s}</span>
    case ElementType.Electro:
      return <span className="electro">{s}</span>
    case ElementType.Geo:
      return <span className="geo">{s}</span>
    case ElementType.Anemo:
      return <span className="anemo">{s}</span>
    case ElementType.Dendro:
      return <span className="dendro">{s}</span>
    case ElementType.Physical:
      return <span className="bold">{s}</span>
  }
}


export function randomIntFromInterval(min: number, max: number) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function isBasicElement(type: ElementType) {
  return type === ElementType.Electro
    || type === ElementType.Pyro
    || type === ElementType.Hydro
    || type === ElementType.Cryo
    || type === ElementType.Anemo
    || type === ElementType.Geo
    || type === ElementType.Dendro
}

export function rawDicesToTotalDices(rawDices: number[]) {
  let result = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < rawDices.length; i++) {
    result[rawDices[i]] += 1;
  }
  return result;
}

export function canSatisfyCostRequirement(cost: string, rawDices: number[]) {
  let totalDices = rawDicesToTotalDices(rawDices);
  let blackCount = 0;
  for (let i = 0; i < cost.length; i++) {
    let c = cost[i];
    let element = LetterElementMap[c];

    // TODO handle white cost
    if (isBasicElement(element)) {
      if (totalDices[element] > 0) {
        totalDices[element]--;
      }
      else {
        totalDices[ElementType.Omni]--;
      }
    }
    else if (c === 'B') {
      blackCount++;
    }
  }

  if (totalDices[ElementType.Omni] < 0) {
    return false;
  }

  let leftoverSum = totalDices.reduce((a, b) => a + b, 0);
  return leftoverSum >= blackCount;
}

// @ts-ignore
window.printDuplicateIds = function() {
  return Object.entries(
    [...document.querySelectorAll("[id]")]
      .map((x) => x.id) /* get all ids */
      .reduce(
        // @ts-ignore
        (acc, id) => ({ ...acc, [id]: (acc[id] || 0) + 1 }),
        {}
      ) /*count them*/
    // @ts-ignore
  ).filter(([_key, val]) => val > 1); /* find the ones repeating more than once */
}
