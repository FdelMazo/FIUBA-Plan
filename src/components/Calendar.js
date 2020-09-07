import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarWeek from "./CalendarWeek";
import useWindowSize from "../utils/useWindowSize";

const MyCalendar = (props) => {
  const { events } = props;
  const { width } = useWindowSize();

  const localizer = momentLocalizer(moment);

  const formats = {
    dayFormat: (d) => {
      const f = d
        .toLocaleString("es-AR", {
          weekday: "long",
        })
        .toUpperCase();
      return width > 1180 ? f : f[0];
    },
    timeGutterFormat: "HH:mm",
  };

  const min = new Date();
  min.setHours(7, 0, 0);
  const max = new Date();
  max.setHours(23, 0, 0);

  return (
    <Calendar
      formats={formats}
      toolbar={false}
      view={"calendarWeek"}
      views={{ calendarWeek: CalendarWeek }}
      localizer={localizer}
      min={min}
      max={max}
      defaultDate={new Date(2018, 0, 1)} // Monday
      events={events}
      eventPropGetter={eventPropsGetter}
    />
  );
};

function eventPropsGetter(event, start, end, isSelected) {
  var style = {
    backgroundColor: event.color,
  };
  return {
    style: style,
  };
}

export default MyCalendar;
