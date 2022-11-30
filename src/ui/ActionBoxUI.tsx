import React from "react";

export type ActionBoxUIProps = {
  id: string
  player: number
  onRollDiceClicked: (player: number) => void
}

function ActionBoxUI(props: ActionBoxUIProps) {
  return (
    <div id={props.id}>
      <input type="button" value="Roll dice" onClick={() => props.onRollDiceClicked(props.player)}/>
    </div>
  )
}

export default ActionBoxUI;
