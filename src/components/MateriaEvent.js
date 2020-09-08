import React from "react";

const MateriaEvent = (props) => {
  return <div >
      <span class="rbc-agenda-event-cell">{props.event.materia}</span>
      <br/>
      <span class="rbc-agenda-event-cell-sub">{props.event.title}</span>
    </div>
}

export default MateriaEvent;