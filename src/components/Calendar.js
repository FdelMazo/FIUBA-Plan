import { ViewOffIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text, Tooltip } from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/es";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DataContext } from "../Context";
import useWindowSize from "../utils/useWindowSize";
import CalendarAgenda from "./CalendarAgenda";
import CalendarWeek from "./CalendarWeek";

const MyCalendar = (props) => {
  const { events, useAgenda } = props;
  const { toggleNoCursar, noCursar } = React.useContext(DataContext);
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
  max.setHours(23, 30, 0);

  function eventPropsGetter(event, start, end, isSelected) {
    const style = {
      borderWidth: "thin thin thin thick",
      borderRightColor: "#d2adf4", //primary.300
      borderBottomColor: "#d2adf4", //primary.300
      borderTopColor: "#d2adf4", //primary.300
      borderLeftColor: event.color,
      color: "#1f1f1f",
      cursor: "default",
      backgroundImage: noCursar.includes(event.id)
        ? `repeating-linear-gradient(135deg, #ededed, #ededed 10px, transparent 10px, transparent 30px)`
        : undefined,
    };
    const calendarWeekStyle = {
      textAlign: "right",
      backgroundColor: "#FFF",
      borderRightColor: "#0000",
      borderBottomColor: "#0000",
      borderTopColor: "#0000",
      boxShadow: "inset 0 0 0 1000px " + event.color + "44",
    };
    return {
      style: useAgenda ? style : { ...style, ...calendarWeekStyle },
    };
  }

  const MateriaEvent = (props) => {
    return useAgenda ? (
      <Box>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Text noOfLines={[1, 2, 3]} className="rbc-agenda-event-cell" mb={2}>
            {props.event.materia}
          </Text>
          <Tooltip label="No la voy a cursar" placement="top">
            <IconButton
              variant="ghost"
              colorScheme="primary"
              icon={<ViewOffIcon color={props.event.color} />}
              onClick={() => toggleNoCursar(props.event.id)}
            />
          </Tooltip>
        </Box>
        <Text noOfLines={[1, 3, 5]} className="rbc-agenda-event-cell-sub">
          {props.event.title}
        </Text>
      </Box>
    ) : (
      <Box>
        <Box>
          <Text noOfLines={[1, 2, 3]} className="rbc-agenda-event-cell" mb={2}>
            {props.event.materia}
          </Text>
          <Text noOfLines={[1, 3, 5]} className="rbc-agenda-event-cell-sub">
            {props.event.title}
          </Text>
        </Box>
        <Tooltip label="No la voy a cursar" placement="top">
          <IconButton
            variant="ghost"
            colorScheme="primary"
            icon={<ViewOffIcon color={props.event.color} />}
            onClick={() => toggleNoCursar(props.event.id)}
          />
        </Tooltip>
      </Box>
    );
  };

  return (
    <Calendar
      formats={formats}
      toolbar={false}
      view={useAgenda ? "calendarAgenda" : "calendarWeek"}
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
