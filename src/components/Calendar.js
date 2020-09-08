import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Alert, AlertIcon } from "@chakra-ui/core";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarWeek from "./CalendarWeek";
import CalendarAgenda from "./CalendarAgenda";
import useWindowSize from "../utils/useWindowSize";

const MyCalendar = (props) => {
  const { events } = props;
  const { width } = useWindowSize();
  const [ useAgenda, setUseAgenda ] = React.useState(false);
  const localizer = momentLocalizer(moment);

  React.useEffect(() => {
    setUseAgenda(width < 1000)
  }, [width])

  const formats = {
    dayFormat: (d) => {
      const f = d
        .toLocaleString("es-AR", {
          weekday: "long",
        })
        .toUpperCase();
      return width > 1180 ? f : f[0];
    },
    agendaDateFormat: (d) => {
      return d
        .toLocaleString("es-AR", {
          weekday: "long",
        })
        .toUpperCase();
    },
    timeGutterFormat: "HH:mm",
  };

  const min = new Date();
  min.setHours(7, 0, 0);
  const max = new Date();
  max.setHours(23, 0, 0);

  function eventPropsGetter(event, start, end, isSelected) {
    var style = {
      backgroundColor: event.color + "55", // Transparency
      borderLeftColor: event.color,
      borderRightColor: '#0000',
      borderBottomColor: '#0000',
      borderTopColor: '#0000',
      borderWidth: 'thick',
      color: '#1f1f1f'
    };
    if (useAgenda) {
      delete style['backgroundColor']
      delete style['borderRightColor']
      delete style['borderBottomColor']
      delete style['borderTopColor']
    }
    return {
      style: style
    };
  }

  return (
    <Calendar
      formats={formats}
      toolbar={false}
      view={useAgenda ? 'calendarAgenda' : 'calendarWeek'}
      views={{ calendarAgenda: CalendarAgenda, calendarWeek: CalendarWeek }}
      localizer={localizer}
      min={min}
      max={max}
      defaultDate={new Date(2018, 0, 1)} // Monday
      events={events}
      eventPropGetter={eventPropsGetter}
      messages={{
        noEventsInRange:
          <Alert status="info" variant="left-accent">
            <AlertIcon />
              No hay materias seleccionadas
          </Alert>
      }}
    />
  );
};


export default MyCalendar;
