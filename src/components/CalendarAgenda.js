import PropTypes from 'prop-types'
import React, { useRef, } from 'react'
import * as dates from 'react-big-calendar/lib/utils/dates'
import { navigate } from 'react-big-calendar/lib/utils/constants'
import { inRange } from 'react-big-calendar/lib/utils/eventLevels'
import { isSelected } from 'react-big-calendar/lib/utils/selection'

function Agenda({
  selected,
  getters,
  accessors,
  localizer,
  components,
  length,
  date,
  events,
}) {
  const contentRef = useRef(null)
  const tbodyRef = useRef(null)

  const coveredDays = events.map((e) => e.start.getDay());
  const notCoveredDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (d) => !coveredDays.includes(d)
  );
  const dummyEvents = notCoveredDays.map((i) => ({
    start: new Date(2018, 0, i, 7),
    end: new Date(2018, 0, i, 23, 30),
    title: "",
  }));
  events = [...events, ...dummyEvents];

  const renderDay = (day, events, dayKey) => {
    const { event: Event, date: AgendaDate } = components

    events = events.filter(e =>
      inRange(e, dates.startOf(day, 'day'), dates.endOf(day, 'day'), accessors)
    )

    return events.map((event, idx) => {
      let title = accessors.title(event)
      let end = accessors.end(event)
      let start = accessors.start(event)

      const userProps = getters.eventProp(
        event,
        start,
        end,
        isSelected(event, selected)
      )

      let dateLabel = idx === 0 && localizer.format(day, 'agendaDateFormat')
      let first =
        idx === 0 ? (
          <tr key={dayKey + "+" + idx}>
            <td
              key={dayKey + "++" + idx}
              colSpan="2"
              className="rbc-agenda-date-cell"
            >
              {AgendaDate ? (
                <AgendaDate day={day} label={dateLabel} />
              ) : (
                  dateLabel
                )}
            </td>
          </tr>
        ) : (
            false
          );

      return [
        first,
        <tr key={dayKey + "_" + idx} className={userProps.className}>
          <td key={dayKey + "__" + idx} className="rbc-agenda-time-cell">
            {timeRangeLabel(day, event)}
          </td>
          <td
            key={dayKey + "___" + idx}
            className="rbc-agenda-event-cell"
            style={userProps.style}
          >
            {Event ? <Event event={event} title={title} /> : title}
          </td>
        </tr>,
      ]
    }, [])
  }

  const timeRangeLabel = (day, event) => {
    let labelClass = '',
      TimeComponent = components.time,
      label = localizer.messages.allDay

    let end = accessors.end(event)
    let start = accessors.start(event)

    if (!accessors.allDay(event)) {
      if (dates.eq(start, end)) {
        label = localizer.format(start, 'agendaTimeFormat')
      } else if (dates.eq(start, end, 'day')) {
        label = localizer.format({ start, end }, 'agendaTimeRangeFormat')
      } else if (dates.eq(day, start, 'day')) {
        label = localizer.format(start, 'agendaTimeFormat')
      } else if (dates.eq(day, end, 'day')) {
        label = localizer.format(end, 'agendaTimeFormat')
      }
    }

    if (dates.gt(day, start, 'day')) labelClass = 'rbc-continues-prior'
    if (dates.lt(day, end, 'day')) labelClass += ' rbc-continues-after'

    return (
      <span className={labelClass.trim()}>
        {TimeComponent ? (
          <TimeComponent event={event} day={day} label={label} />
        ) : (
          label
        )}
      </span>
    )
  }

  let { messages } = localizer
  let end = dates.add(date, length, 'day')

  let range = dates.range(date, end, 'day')

  events = events.filter(event => inRange(event, date, end, accessors))

  events.sort((a, b) => +accessors.start(a) - +accessors.start(b))

  return (
    <div className="rbc-agenda-view">
      {events.length !== 0 ? (
        <React.Fragment>
          <div className="rbc-agenda-content" ref={contentRef}>
            <table className="rbc-agenda-table">
              <tbody ref={tbodyRef}>
                {range.map((day, idx) => renderDay(day, events, idx))}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      ) : (
        <span className="rbc-agenda-empty">{messages.noEventsInRange}</span>
      )}
    </div>
  )
}

Agenda.propTypes = {
  events: PropTypes.array,
  date: PropTypes.instanceOf(Date),
  length: PropTypes.number.isRequired,

  selected: PropTypes.object,

  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,
}

Agenda.defaultProps = {
  length: 30,
}

Agenda.range = (start, { length = Agenda.defaultProps.length }) => {
  let end = dates.add(start, length, 'day')
  return { start, end }
}

Agenda.navigate = (date, action, { length = Agenda.defaultProps.length }) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -length, 'day')

    case navigate.NEXT:
      return dates.add(date, length, 'day')

    default:
      return date
  }
}

Agenda.title = (start, { length = Agenda.defaultProps.length, localizer }) => {
  let end = dates.add(start, length, 'day')
  return localizer.format({ start, end }, 'agendaHeaderFormat')
}

export default Agenda
