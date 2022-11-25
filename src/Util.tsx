import React from "react";
import {ElementType} from "./Enum";

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
