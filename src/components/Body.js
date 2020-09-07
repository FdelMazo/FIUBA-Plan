import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useToast } from "@chakra-ui/core";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarWeek from "./CalendarWeek";
import AddMateria from "./AddMateria";
import { data } from "../data/horarios";

const Body = () => {
  const toast = useToast();
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    toast({
      description: `Actualizado al ${data.cuatrimestre}`,
      status: "success",
      position: "bottom-right",
      duration: 2000,
    });
    toast({
      position: "bottom-right",
      render: () => <AddMateria setEvents={setEvents} />,
      duration: null,
    });
  }, [toast]);

  const localizer = momentLocalizer(moment);

  const formats = {
    dayFormat: (d) => {
      const options = {
        weekday: "short",
      };
      return d.toLocaleString("es-AR", options)[0].toUpperCase();
    },
  };

  const min = new Date();
  min.setHours(7, 0, 0);
  const max = new Date();
  max.setHours(23, 0, 0);

  return (
    <Calendar
      fontFamily="general"
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
      style: style
  };
}

export default Body;
