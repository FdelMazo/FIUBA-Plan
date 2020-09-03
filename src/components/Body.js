import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../CalendarStyle.css";

const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Some title",
    start: moment().toDate(),
    end: moment().add(1, "days").toDate(),
  },
];

const formats = {
  dayFormat: "dddd",
};

const min = new Date();
min.setHours(7, 0, 0);
const max = new Date();
max.setHours(22, 0, 0);

const Body = () => {
  return (
    <Calendar
      formats={formats}
      toolbar={false}
      view={"week"}
      localizer={localizer}
      min={min}
      max={max}
      defaultDate={new Date(2018, 0, 1)} // Monday
      defaultView="month"
      events={events}
    />
  );
};

export default Body;
