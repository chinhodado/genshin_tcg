import React from "react";
import {CardInGame} from "../App";
import {ImageMap} from "../Enum";

type CardUIProps = {
  card: CardInGame
  charPosition: number
  id: string
  player: number
  onCharSwitch?: (player: number, charPos: number) => void
  onMouseEnter: any
  onMouseLeave: any
}

function CardUI(props: CardUIProps) {
  let imgPath = "img/cards/" + props.card.base.img + ".webp";

  function switchChar() {
    props.onCharSwitch && props.onCharSwitch(props.player, props.charPosition);
  }

  function getEnergyIndicators() {
    let arr = [];
    for (let i = 0; i < props.card.base.skills.burst.energy; i++) {
      let className = "energy-dot";
      if (i < props.card.currentEnergy) {
        className += " filled"
      }
      arr.push(<div key={i} className={className}></div>)
    }

    return arr;
  }

  function getAffectedElementsIndicator() {
    let arr = [];
    for (let i = 0; i < props.card.affectedElements.length; i++) {
      let element = props.card.affectedElements[i];
      let img = <img className="dice-aura"
                     src={"img/" + ImageMap[element]}
                     alt="aura" key={i}/>
      arr.push(img);
    }
    return arr;
  }

  let hpTooltip = "Current HP: " + props.card.currentHp;
  let energyTooltip = "Energy: " + props.card.currentEnergy + "/" + props.card.base.skills.burst.energy;

  return (
    <div className="card-ui" id={props.id}>
      <div className="card-hp" title={hpTooltip}>{props.card.currentHp}</div>
      <div className="card-energy" title={energyTooltip}>{getEnergyIndicators()}</div>
      <div className="card-affected-element">{getAffectedElementsIndicator()}</div>
      {props.charPosition === 0 || <input type="button" value="Switch" className="char-switch-button" onClick={switchChar}/>}
      <img src={imgPath} alt="card" className="card" id={props.id + "-img"} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}/>
    </div>
  )
}

export default CardUI;
