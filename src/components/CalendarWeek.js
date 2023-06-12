import React from "react";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import Week from "react-big-calendar/lib/Week";
import WorkWeek from "react-big-calendar/lib/WorkWeek";

class CalendarWeek extends WorkWeek {
  range(date, events, options) {
    const showSabado = !!events.find((e) => e.end.getDay() === 6);
    const DAYS = showSabado ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];
    return Week.range(date, options).filter((d) => DAYS.includes(d.getDay()));
  }

  render() {
    let { date, ...props } = this.props;
    let events = this.props.events || [];
    let range = this.range(date, events, this.props);

    return <TimeGrid {...props} range={range} eventOffset={15} />;
  }
}

export default CalendarWeek;
