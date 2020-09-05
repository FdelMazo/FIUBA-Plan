import React from "react";
import Week from 'react-big-calendar/lib/Week';
import WorkWeek from 'react-big-calendar/lib/WorkWeek';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';

class CalendarWeek extends WorkWeek {

  range(date, options) {
    return Week.range(date, options).filter(
      d => [0].indexOf(d.getDay()) === -1
    )
  }

  title(date, { localizer }) {
    let [start, ...rest] = this.range(date, { localizer })
  
    return localizer.format({ start, end: rest.pop() }, 'dayRangeHeaderFormat')
  }

  render() {
    let { date, ...props } = this.props
    let range = this.range(date, this.props)

    return <TimeGrid {...props} range={range} eventOffset={15} />
  }

}

export default CalendarWeek;