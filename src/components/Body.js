import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useToast } from "@chakra-ui/core";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../CalendarStyle.css";
import AddMateria from "./AddMateria";
import { data } from "../data/horarios";

const Body = () => {
  const toast = useToast();
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    toast({
      description: `Actualizado al ${data.anio}C${data.cuatrimestre}`,
      status: "success",
      position: "bottom-right",
      duration: 1000,
    });
    toast({
      position: "bottom-right",
      render: () => <AddMateria setEvents={setEvents} />,
      duration: null,
    });
  }, [toast]);

  const localizer = momentLocalizer(moment);

  const formats = {
    dayFormat: "dddd",
  };

  const min = new Date();
  min.setHours(7, 0, 0);
  const max = new Date();
  max.setHours(22, 0, 0);

  return (
    <Calendar
      formats={formats}
      toolbar={false}
      view={"week"}
      localizer={localizer}
      min={min}
      max={max}
      defaultDate={new Date(2018, 0, 1)} // Monday
      events={events}
    />
  );
};

export default Body;
