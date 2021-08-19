import React from "react";
import TimeGrid from "react-big-calendar/lib/TimeGrid";
import Week from "react-big-calendar/lib/Week";
import WorkWeek from "react-big-calendar/lib/WorkWeek";

class CalendarWeek extends WorkWeek {
  range(date, options) {
    const { showSabado } = options;
    const DAYS = showSabado ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];
    return Week.range(date, options).filter((d) => DAYS.includes(d.getDay()));
  }

  title(date, { localizer }) {
    let [start, ...rest] = this.range(date, { localizer });

    return localizer.format({ start, end: rest.pop() }, "dayRangeHeaderFormat");
  }

  render() {
    let { date, ...props } = this.props;
    let range = this.range(date, this.props);

    return <TimeGrid {...props} range={range} eventOffset={15} />;
  }
}

export default CalendarWeek;
