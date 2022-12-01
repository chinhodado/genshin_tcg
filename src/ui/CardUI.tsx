import React from "react";
import {CardInGame} from "../App";

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

  return (
    <div className="card-ui" id={props.id}>
      {props.charPosition === 0 || <input type="button" value="Switch" className="char-switch-button" onClick={switchChar}/>}
      <img src={imgPath} alt="card" className="card" id={props.id + "-img"} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}/>
    </div>
  )
}

export default CardUI;
