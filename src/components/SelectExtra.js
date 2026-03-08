import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  MinusIcon,
  SmallCloseIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  DarkMode,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  List,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useEditableControls,
} from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { HexColorPicker } from "react-colorful";
import { useHotkeys } from "react-hotkeys-hook";
import { DataContext } from "../DataContext";
import { getColor, stateReducer } from "../utils";

const PopoverConfigExtra = ({ extraEvents, setColorExtra }) => {
  const [selectedExtraId, setSelectedExtraId] = React.useState(
    extraEvents[0]?.id,
  );

  React.useEffect(() => {
    if (!extraEvents.length) {
      setSelectedExtraId(undefined);
      return;
    }

    const stillExists = extraEvents.some(
      (extra) => extra.id === selectedExtraId,
    );
    if (!stillExists) {
      setSelectedExtraId(extraEvents[0].id);
    }
  }, [extraEvents, selectedExtraId]);

  const selectedExtra = extraEvents.find(
    (extra) => extra.id === selectedExtraId,
  );

  return (
    <Popover
      placement="auto"
      gutter={8}
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
            padding: 8,
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top", "bottom"],
          },
        },
      ]}
    >
      <PopoverTrigger>
        <IconButton
          my={2}
          ml={2}
          colorScheme="primary"
          variant="outline"
          borderColor="primary"
          color="primary.500"
          icon={<SettingsIcon />}
        />
      </PopoverTrigger>

      <DarkMode>
        <PopoverContent color="white" maxH="calc(100dvh - 16px)">
          <PopoverArrow />
          <PopoverCloseButton top={3} right={3} />
          <PopoverBody px={4} py={4} overflowY="auto">
            {!extraEvents.length ? (
              <Text fontSize="sm" color="gray.400">
                No hay actividades extracurriculares para configurar.
              </Text>
            ) : (
              <>
                <Text mb={2}>Actividad a configurar</Text>
                <List maxH="120px" overflowY="auto" mb={4}>
                  {extraEvents.map((extra) => {
                    const isSelected = extra.id === selectedExtraId;
                    return (
                      <Box
                        key={extra.id}
                        py={1}
                        px={2}
                        borderRadius="md"
                        cursor="pointer"
                        bg={isSelected ? "whiteAlpha.300" : "transparent"}
                        _hover={{ bg: "whiteAlpha.200" }}
                        onClick={() => setSelectedExtraId(extra.id)}
                      >
                        <Text fontSize="xs" noOfLines={1}>
                          {extra.title}
                        </Text>
                      </Box>
                    );
                  })}
                </List>

                <Box>
                  <Text mb={2}>Color para actividades extracurriculares</Text>
                  <HexColorPicker
                    style={{
                      width: "100%",
                      padding: "4px",
                    }}
                    color={
                      selectedExtra?.color ??
                      (selectedExtra ? getColor(selectedExtra) : "#ffffff")
                    }
                    onChange={(color) => {
                      if (!selectedExtra) return;
                      setColorExtra(selectedExtra.id, color);
                    }}
                  />
                </Box>
              </>
            )}
          </PopoverBody>
        </PopoverContent>
      </DarkMode>
    </Popover>
  );
};

const SelectExtra = () => {
  const {
    events,
    extraEvents,
    renameExtra,
    toggleExtra,
    removeExtra,
    removeAllExtra,
    setColorExtra,
  } = React.useContext(DataContext);

  const {
    isOpen,
    getItemProps,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
  } = useSelect({
    stateReducer,
    items: extraEvents,
  });

  useHotkeys("space, enter", () => {
    if (highlightedIndex === -1) return;
    const event = extraEvents[highlightedIndex];
    toggleExtra(event.id);
  });

  return (
    <>
      <Flex direction="row" justify="flex-end">
        <div
          style={{
            flexShrink: 0,
            width: "16px",
            height: "16px",
            marginRight: "8px",
          }}
        />
        <Box
          width="100%"
          {...getToggleButtonProps({
            onBlur: (event) => {
              event.preventDownshiftDefault = true;
            },
          })}
        >
          <Button
            width="100%"
            justifyContent="space-between"
            my={2}
            px={2}
            colorScheme="primary"
            variant="outline"
            borderColor="primary"
            color="primary.500"
            rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          >
            <Text fontSize="xs">EXTRACURRICULAR</Text>
          </Button>
        </Box>

        <Tooltip placement="top" label="Remover horarios extracurriculares">
          <IconButton
            my={2}
            ml={2}
            colorScheme="primary"
            variant="outline"
            borderColor="primary"
            color="primary.500"
            icon={<MinusIcon />}
            onClick={() => {
              removeAllExtra();
            }}
          />
        </Tooltip>

        <PopoverConfigExtra
          extraEvents={extraEvents}
          setColorExtra={setColorExtra}
        />
      </Flex>

      <List
        {...getMenuProps()}
        display={isOpen ? "block" : "none"}
        p={1}
        borderWidth={1}
        borderRadius={5}
        borderColor="primary.500"
        style={{
          maxHeight: "18em",
          overflowY: "scroll",
        }}
      >
        {extraEvents.map((item, index) => {
          const event = events.find((i) => i.id === item.id);
          const isActive = !!event;
          const color = item.color ?? getColor(item);

          return (
            <Box
              py={1}
              bg={highlightedIndex === index && "hovercolor"}
              color={isActive ? color : "gray.200"}
              cursor="pointer"
              fontSize="xs"
              px={2}
              onClick={() => {
                toggleExtra(item.id);
              }}
              _notLast={{
                borderBottom: "1px dashed violet",
              }}
              key={[item.id, isActive].join("-")}
            >
              <li
                {...getItemProps({
                  item,
                  index,
                })}
              >
                <Editable
                  placeholder="Actividad"
                  fontSize="small"
                  defaultValue={item.title}
                  isPreviewFocusable={false}
                  onSubmit={(str) => {
                    renameExtra(item.id, str);
                  }}
                >
                  <Flex justifyContent="space-between">
                    <Box>
                      {isActive && <CheckIcon mr={1} />}
                      <EditablePreview cursor="pointer" />
                      <EditableInput
                        px={1}
                        w="80%"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        _focus={{
                          boxShadow: "0 0 0 1px rgba(183,148,244, 0.6)",
                        }}
                      />
                    </Box>
                    <Box>
                      <EditableControls />
                      <Tooltip placement="top" label="Remover">
                        <IconButton
                          size="xs"
                          color="white"
                          _hover={{
                            bg: "initial",
                            border: "1px solid",
                          }}
                          variant="ghost"
                          onClick={(e) => {
                            removeExtra(item.id);
                            e.stopPropagation();
                          }}
                          icon={<SmallCloseIcon />}
                        />
                      </Tooltip>
                    </Box>
                  </Flex>
                </Editable>
              </li>
            </Box>
          );
        })}
      </List>
    </>
  );
};

function EditableControls({ color }) {
  const { isEditing, getSubmitButtonProps, getEditButtonProps } =
    useEditableControls();

  return isEditing ? (
    <IconButton
      size="xs"
      color="white"
      _hover={{
        bg: "initial",
        border: "1px solid",
      }}
      variant="ghost"
      icon={<CheckIcon />}
      {...getSubmitButtonProps()}
      onClick={(e) => {
        getSubmitButtonProps().onClick(e);
        e.stopPropagation();
      }}
    />
  ) : (
    <Tooltip placement="top" label="Renombrar">
      <IconButton
        size="xs"
        color="white"
        _hover={{
          bg: "initial",
          border: "1px solid",
        }}
        variant="ghost"
        icon={<EditIcon />}
        {...getEditButtonProps()}
        onClick={(e) => {
          getEditButtonProps().onClick(e);
          e.stopPropagation();
        }}
      />
    </Tooltip>
  );
}

export default SelectExtra;
