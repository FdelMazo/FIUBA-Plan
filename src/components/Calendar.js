import {
  AddIcon,
  SmallCloseIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Tab,
  Tabs,
  Text,
  Tooltip,
  useTab,
} from "@chakra-ui/react";
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

  const {
    toggleNoCursar,
    activeTabId,
    tabs,
    selectTab,
    addTab,
    noCursar,
    getColor,
  } = React.useContext(DataContext);
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

  function eventPropsGetter(event) {
    let color = event.id ? getColor(event.curso.codigo) : "inherit";
    const style = {
      borderWidth: "thin thin thin thick",
      borderRightColor: "#d2adf4", //primary.300
      borderBottomColor: "#d2adf4", //primary.300
      borderTopColor: "#d2adf4", //primary.300
      borderLeftColor: color,
      color: "#1f1f1f",
      cursor: "default",
      backgroundImage: noCursar.find(
        (nc) => nc.id === event.id && nc.tabId === activeTabId
      )
        ? `repeating-linear-gradient(135deg, #ededed, #ededed 10px, transparent 10px, transparent 30px)`
        : undefined,
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
          {props.event.id && (
            <IconButton
              variant="ghost"
              icon={
                noCursar.find(
                  (nc) => nc.id === props.event.id && nc.tabId === activeTabId
                ) ? (
                  <ViewIcon color={getColor(props.event.curso.codigo)} />
                ) : (
                  <ViewOffIcon color={getColor(props.event.curso.codigo)} />
                )
              }
              onClick={() => toggleNoCursar(props.event.id)}
            />
          )}
        </Box>
        <Text noOfLines={[1, 3, 5]} className="rbc-agenda-event-cell-sub">
          {props.event.title}
        </Text>
      </Box>
    ) : (
      <Box>
        <Text noOfLines={[1, 2, 3]} className="rbc-agenda-event-cell" mb={2}>
          {props.event.materia}
        </Text>
        <Text noOfLines={[1, 3, 5]} className="rbc-agenda-event-cell-sub">
          {props.event.title}
        </Text>
      </Box>
    );
  };

  const TabSystem = (props) => {
    return (
      <Tabs
        index={tabs.map((t) => t.id).indexOf(activeTabId)}
        key={tabs.length}
        colorScheme="purple"
        onChange={(index) => {
          selectTab(tabs[index]?.id || 0);
        }}
      >
        <Flex flexWrap="wrap" borderBottom="2px solid" borderColor="inherit">
          {tabs.map((tab, index) => (
            <CustomTab tab={tab} index={index} />
          ))}

          {tabs.length < 10 && (
            <IconButton
              alignSelf="center"
              variant="ghost"
              colorScheme="purple"
              onClick={() => addTab()}
              icon={<AddIcon />}
            />
          )}
        </Flex>
      </Tabs>
    );
  };

  return (
    <Calendar
      formats={formats}
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
        toolbar: TabSystem,
      }}
      onSelectEvent={(e) => {
        toggleNoCursar(e.id);
      }}
      dayLayoutAlgorithm="no-overlap"
      tooltipAccessor="tooltip"
    />
  );
};

const CustomTab = React.forwardRef((props, ref) => {
  const { renameTab, getNHoras, removeTab } = React.useContext(DataContext);
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps["aria-selected"];

  return (
    <Tab {...tabProps} pr={isSelected ? 2 : 4}>
      <Tooltip
        placement="bottom"
        label={`${
          Math.round(getNHoras(props.tab.id) * 100) / 100
        } horas de cursada`}
      >
        <Editable
          defaultValue={
            props.tab.title?.trim()
              ? props.tab.title
              : `Plan #${props.index + 1}`
          }
          onClick={(ev) => {
            ev.stopPropagation();
          }}
          onSubmit={(str) => {
            renameTab(props.tab.id, str);
          }}
        >
          <Flex>
            <EditablePreview maxW="12ch" />
            <EditableInput
              maxW="12ch"
              _focus={{
                boxShadow: "0 0 0 3px rgba(183,148,244, 0.6)",
              }}
            />
            {props.tab.id !== 0 && isSelected && (
              <SmallCloseIcon
                _hover={{ color: "primary.900" }}
                boxSize="20px"
                ml="5px"
                color="primary.600"
                onClick={() => {
                  removeTab(props.tab.id);
                }}
              />
            )}
          </Flex>
        </Editable>
      </Tooltip>
    </Tab>
  );
});

export default MyCalendar;
