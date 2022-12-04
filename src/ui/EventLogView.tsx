import {GameEvent} from "../App";
import {GameEventType, ImageMap} from "../Enum";
import React from "react";

export type EventLogViewProps = {
  events: GameEvent[]
}

function EventLogView(props: EventLogViewProps) {
  function getEventLogs() {
    let arr = [];
    for (let i = 0; i < props.events.length; i++) {
      let li = <li key={i}>{eventToText(props.events[i])}</li>
      arr.push(li);
    }
    return <ul>{arr}</ul>
  }

  function eventToText(event: GameEvent) {
    if (event.type === GameEventType.ROLL_DICE) {
      return (<span>Player {event.player + 1} rolls dice. Result: <br/>{dicesToLog(event.diceResult as number[])}</span>)
    }

    return `Unknown event`;
  }

  function dicesToLog(dices: number[]) {
    let i = 0;
    return (
      dices.map(d => <img className="dice-aura"
                          src={"img/" + ImageMap[d]}
                          alt="dice" key={i++}/>)
    )
  }

  return getEventLogs();
}

export default EventLogView;
