import React from "react";

const MateriaEvent = (props) => {
  return (
    <div>
      <span className="rbc-agenda-event-cell">{props.event.materia}</span>
      <br />
      <span className="rbc-agenda-event-cell-sub">{props.event.title}</span>
    </div>
  );
};

export default MateriaEvent;
