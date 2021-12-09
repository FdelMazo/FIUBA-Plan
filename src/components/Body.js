import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  Box,
  chakra,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
  useStyles,
  useTab,
  useToast,
} from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DataContext } from "../Context";
import useWindowSize from "../utils/useWindowSize";
import Calendar from "./Calendar";
import MateriasDrawer from "./MateriasDrawer";

const CustomTab = React.forwardRef((props, ref) => {
  const { renameTab, removeTab } = React.useContext(DataContext);
  const StyledTab = chakra("button", { themeKey: "Tabs.Tab" });
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps["aria-selected"];
  const styles = useStyles();

  return (
    <StyledTab __css={styles.tab} {...tabProps} onClick={undefined}>
      <Editable
        defaultValue={
          props.tab.title.trim() ? props.tab.title : `Plan #${props.index + 1}`
        }
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
    </StyledTab>
  );
});

const Body = () => {
  const { actualizacion, activeTabId, events, tabs, selectTab, addTab } =
    React.useContext(DataContext);
  const [useAgenda, setUseAgenda] = React.useState(false);
  const { width } = useWindowSize();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();
  const toastIdRef = React.useRef();

  const escKey = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        onToggle();
      }
    },
    [onToggle]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escKey, false);

    return () => {
      document.removeEventListener("keydown", escKey, false);
    };
  }, [escKey]);

  React.useEffect(() => {
    toastIdRef.current = toast({
      position: "top-right",
      duration: 3000,
      render: () => (
        <Alert
          borderColor="drawerbg"
          borderWidth={2}
          borderRadius={5}
          right={2}
          status="success"
          color="drawerbg"
          flexDirection="column"
        >
          <SmallCloseIcon
            alignSelf="flex-end"
            cursor="pointer"
            onClick={() => {
              if (toastIdRef.current) {
                toast.close(toastIdRef.current);
              }
            }}
            m="-8px"
          />

          <Box>
            <Text>Actualizado al {actualizacion.cuatrimestre}</Text>
          </Box>
          <Box>
            <Text fontSize="sm">({actualizacion.timestamp})</Text>
          </Box>
        </Alert>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setUseAgenda(width < 1000);
  }, [width]);

  return (
    <Box id={useColorModeValue(undefined, "dark")} flexGrow={1}>
      <MateriasDrawer
        isOpen={isOpen}
        onClose={onClose}
        useAgenda={useAgenda}
        setUseAgenda={setUseAgenda}
      />
      <Tabs
        index={tabs.map((t) => t.id).indexOf(activeTabId)}
        key={tabs.length}
        colorScheme="purple"
        onChange={(index) => {
          selectTab(tabs[index]?.id || 0);
        }}
      >
        <Box borderBottom="2px solid" borderColor="inherit">
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
        </Box>
      </Tabs>
      <Calendar
        events={events.filter(
          (e) => e.tabId === activeTabId || (!e.tabId && e.tabId !== 0)
        )}
        useAgenda={useAgenda}
      />
      <IconButton
        position="absolute"
        right={10}
        bottom={10}
        borderColor="drawerbg"
        borderWidth={2}
        icon={<AddIcon fontWeight="bold" color="drawerbg" />}
        onClick={onToggle}
        colorScheme="primary"
        aria-label="Agregar Materia"
      />
    </Box>
  );
};

export default Body;
