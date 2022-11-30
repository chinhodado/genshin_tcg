import React from "react";

export type ActionBoxUIProps = {
  id: string
  onRollDiceClicked: (_e: React.MouseEvent) => void
}

function ActionBoxUI(props: ActionBoxUIProps) {
  return (
    <div id={props.id}>
      <input type="button" value="Roll dice" onClick={props.onRollDiceClicked}/>
    </div>
  )
}

export default ActionBoxUI;
