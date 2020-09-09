import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarWeek from "./CalendarWeek";
import CalendarAgenda from "./CalendarAgenda";
import MateriaEvent from "./MateriaEvent";
import useWindowSize from "../utils/useWindowSize";

const MyCalendar = (props) => {
  const { events, useAgenda } = props;
  const localizer = momentLocalizer(moment);
  const { width } = useWindowSize();
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
    const style = {
      borderWidth: "thick",
      color: "#1f1f1f",
      borderLeftColor: event.color,
    };
    const calendarWeekStyle = {
      textAlign: "right",
      backgroundColor: "#9993",
      borderRightColor: "#0000",
      borderBottomColor: "#0000",
      borderTopColor: "#0000",
    };
    return {
      style: useAgenda ? style : { ...style, ...calendarWeekStyle },
    };
  }

  return (
    <Calendar
      formats={formats}
      toolbar={false}
      view={useAgenda ? "calendarAgenda" : "calendarWeek"}
      onView={() => {}}
      views={{ calendarAgenda: CalendarAgenda, calendarWeek: CalendarWeek }}
      localizer={localizer}
      min={min}
      max={max}
      defaultDate={new Date(2018, 0, 1)} // Monday
      events={events}
      eventPropGetter={eventPropsGetter}
      components={{
        event: MateriaEvent,
      }}
      dayLayoutAlgorithm="no-overlap"
    />
  );
};

export default MyCalendar;
