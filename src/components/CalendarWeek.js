import React from "react";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import Week from "react-big-calendar/lib/Week";
import WorkWeek from "react-big-calendar/lib/WorkWeek";

class CalendarWeek extends WorkWeek {
  range(date, events, options) {
    let showSabado = false;
    for (const e of events) {
      if (e.end.getDay() === 6) {
        showSabado = true;
        break;
      }
    }

    const DAYS = showSabado ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];
    return Week.range(date, options).filter((d) => DAYS.includes(d.getDay()));
  }

  title(date, { localizer }) {
    let [start, ...rest] = this.range(date, { localizer });

    return localizer.format({ start, end: rest.pop() }, "dayRangeHeaderFormat");
  }

  render() {
    let { date, ...props } = this.props;
    let events = this.props.events || [];
    let range = this.range(date, events, this.props);

    return <TimeGrid {...props} range={range} eventOffset={15} />;
  }
}

export default CalendarWeek;
