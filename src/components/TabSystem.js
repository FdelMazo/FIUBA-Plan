import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  LightMode,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Tab,
  Tabs,
  Text,
  useTab,
  useToast
} from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import { DataContext } from "../DataContext";

const TabSystem = (props) => {
  const {
    activeTabId,
    tabs,
    selectTab,
    addTab,
    readOnly,
    setReadOnly,
    horariosSIU,
  } = React.useContext(DataContext);
  const toastPermalink = useToast();
  const toastError = useToast();  
  const inputref = React.useRef(null);
  const [readOnlyToastClosed, setReadOnlyToastClosed] = React.useState(false);

  if (readOnly && !toastPermalink.isActive("readonly") && !readOnlyToastClosed) {
    toastPermalink({
      id: "readonly",
      duration: null,
      isClosable: false,
      position: "bottom-start",
      onCloseComplete: () => {
        setReadOnlyToastClosed(true);
      },
      render: () => (
        <LightMode>
          <Alert
            flexDir="column"
            borderRadius="md"
            p={4}
            colorScheme="purple"
            borderWidth={1}
            borderColor="purple.400"
          >
            <CloseButton
              color="gray.800"
              size="sm"
              onClick={() => {
                toastPermalink.closeAll();
              }}
              position="absolute"
              insetEnd={1}
              top={1}
            />
            <Box color="gray.800">
              <AlertTitle>Estás navegando desde un permalink</AlertTitle>
              <AlertDescription fontSize={"sm"}>
                Para volver a tu plan anterior, recarga la página.
                <br />
                Para utilizar este plan como tuyo, guardalo.
              </AlertDescription>
            </Box>
            <Button
              mt={1}
              alignSelf="flex-start"
              size="sm"
              colorScheme="purple"
              variant="outline"
              onClick={() => {
                setReadOnly(false);
                toastPermalink.closeAll();
              }}
            >
              Guardar este plan
            </Button>
          </Alert>
        </LightMode>
      ),
    });
  }

  if (window.location.hash.length && !toastError.isActive("errorToast")) {
    // eslint-disable-next-line no-restricted-globals
    history.pushState("", "", window.location.origin);

    toastError({
      id: "errorToast",
      duration: null,
      render: () => (
        <Alert status="error" variant="solid">
          <AlertIcon />
          <Box >
            <AlertTitle>El plan no se pudo cargar correctamente</AlertTitle>
            <AlertDescription>Si estás desde un celular, probalo en la compu!</AlertDescription>
          </Box>
          <CloseButton alignSelf="flex-start" onClick={() => toastError.closeAll("errorToast")} />
        </Alert>
      ),
    });
  }

  return (
    <Flex
      borderBottom="2px solid"
      borderColor="inherit"
      justifyContent="space-between"
    >
      <Tabs
        onKeyDown={(e) => {
          if (e.keyCode === 32) {
            e.preventDefault();
            const ch = e.target.selectionStart;
            inputref.current.value =
              e.target.value.slice(0, ch) + " " + e.target.value.slice(ch);
            e.target.selectionStart = ch + 1;
            e.target.selectionEnd = ch + 1;
          }
        }}
        index={tabs.map((t) => t.id).indexOf(activeTabId)}
        key={tabs.length}
        colorScheme="purple"
        onChange={(index) => {
          selectTab(tabs[index]?.id || 0);
        }}
      >
        <Flex flexWrap="wrap">
          {tabs.map((tab, index) => (
            <CustomTab
              key={tab.id}
              tab={tab}
              index={index}
              ref={tabs[index]?.id === activeTabId ? inputref : undefined}
            />
          ))}

          {tabs.length < 5 && (
            <IconButton
              alignSelf="center"
              variant="ghost"
              colorScheme="purple"
              onClick={() => {
                addTab();
              }}
              icon={<AddIcon />}
            />
          )}
        </Flex>
      </Tabs>
      {horariosSIU && (
        <Box alignSelf="center" px={4}>
          <Popover placement="bottom" trigger="hover">
            <PopoverTrigger>
              <Text textAlign="right">
                <strong>Usando horarios del SIU</strong>
                <br />
                {horariosSIU.periodo}
              </Text>
            </PopoverTrigger>
            <PopoverContent borderColor="primary.500" mr={2}>
              <PopoverArrow bg="primary.500" />
              <PopoverBody>
                Acordate que el SIU también puede actualizar sus horarios sin
                aviso previo. Si estás por inscribirte a materias, es
                recomendable que re-cargues los horarios.
              </PopoverBody>
              <PopoverFooter fontSize="sm">
                Horarios cargados el{" "}
                <strong>
                  {new Date(horariosSIU.timestamp).toLocaleString()}
                </strong>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </Box>
      )}
    </Flex>
  );
};

const CustomTab = React.forwardRef((props, ref) => {
  const { renameTab, removeTab } = React.useContext(DataContext);
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps["aria-selected"];

  return (
    <Tab {...tabProps} pr={isSelected ? 2 : 4}>
      <Editable
        isPreviewFocusable={isSelected}
        defaultValue={
          props.tab.title?.trim() ? props.tab.title : `Plan #${props.index + 1}`
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
            ref={ref}
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
    </Tab>
  );
});

export default TabSystem;
