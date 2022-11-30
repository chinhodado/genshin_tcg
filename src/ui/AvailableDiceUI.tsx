import React from "react";
import {ImageMap} from "../Enum";

export type AvailableDiceUIProps = {
  id: string
  rawDices: number[]
}

function AvailableDiceUI(props: AvailableDiceUIProps) {
  let i = 0;
  return (
    <div id="available-dice-2">
      Available dices:
      <br/><br/>
      {
        props.rawDices.map(d => <img className="dice-small"
                            src={"img/" + ImageMap[d]}
                            alt="dice" key={i++}/>)
      }
    </div>
  )
}

export default AvailableDiceUI;
