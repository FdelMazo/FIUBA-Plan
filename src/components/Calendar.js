import {
  Box,
  Text,
  CloseButton,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/es";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DataContext } from "../Context";
import useWindowSize from "../useWindowSize";
import CalendarAgenda from "./CalendarAgenda";
import CalendarWeek from "./CalendarWeek";
import TabSystem from "./TabSystem";
import { getColor } from "../utils";

const localizer = momentLocalizer(moment);
const min = (new Date()).setHours(7, 0, 0);
const max = (new Date()).setHours(23, 30, 0);

const MateriaEvent = (props) => {
  const { toggleExtra } = React.useContext(DataContext);
  return (<>
    {!props.event.curso &&
      <CloseButton float="right" mt="-20px" size="sm"
        onClick={(ev) => {
        ev.stopPropagation();
        toggleExtra(props.event.id);
      }}
    />
    }

    <Box>
      <Text noOfLines={[1, 2, 3]} className="rbc-agenda-event-cell" mb={2}>
        {props.event.title}
      </Text>
      <Text noOfLines={[1, 3, 5]} className="rbc-agenda-event-cell-sub">
        {props.event.subtitle}
      </Text>
    </Box>
  </>)
};

const MateriaEventAgenda = (props) => {
  return (<Box>
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Text noOfLines={[1, 2, 3]} className="rbc-agenda-event-cell" mb={2}>
        {props.event.title}
      </Text>
    </Box>
    <Text noOfLines={[1, 3, 5]} className="rbc-agenda-event-cell-sub">
      {props.event.subtitle}
    </Text>
  </Box>)
};


const MyCalendar = (props) => {
  const { events, useAgenda } = props;
  const { width } = useWindowSize();
  const { addExtra } = React.useContext(DataContext);

  const eventPropsGetter = React.useCallback((event) => {
    let color = (event.id ? getColor(event) : "inherit");
    const style = {
      borderWidth: "thin thin thin thick",
      borderRightColor: "#d2adf4", //primary.300
      borderBottomColor: "#d2adf4", //primary.300
      borderTopColor: "#d2adf4", //primary.300
      borderLeftColor: color,
      color: "#1f1f1f",
      cursor: "default",
    };
    const calendarWeekStyle = {
      textAlign: "right",
      backgroundColor: "#FFF",
      borderRightColor: "#0000",
      borderBottomColor: "#0000",
      borderTopColor: "#0000",
      boxShadow: "inset 0 0 0 1000px " + color + "44",
    };
    return {
      style: useAgenda ? style : { ...style, ...calendarWeekStyle },
    };
  }, [useAgenda]);

  const coveredDays = events.map((e) => e.start.getDay());
  const notCoveredDays = [1, 2, 3, 4, 5].filter(
    (d) => !coveredDays.includes(d)
  );
  const dummyEvents = notCoveredDays.map((i) => ({
    start: new Date(2018, 0, i, 7),
    end: new Date(2018, 0, i, 23, 30),
    title: "",
  }));

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

  return (
    <Calendar
      selectable
      formats={formats}
      onView={() => {}}
      view={useAgenda ? "calendarAgenda" : "calendarWeek"}
      views={{ calendarAgenda: CalendarAgenda, calendarWeek: CalendarWeek }}
      localizer={localizer}
      min={min}
      max={max}
      defaultDate={new Date(2018, 0, 1)} // Monday
      events={useAgenda ? [...events, ...dummyEvents] : events}
      eventPropGetter={eventPropsGetter}
      components={{
        event: useAgenda ? MateriaEventAgenda : MateriaEvent,
        toolbar: TabSystem,
      }}
      onSelectSlot={addExtra}
      dayLayoutAlgorithm="no-overlap"
      tooltipAccessor="tooltip"
    />
  );
};



export default MyCalendar;
