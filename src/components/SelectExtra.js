import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  MinusIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  List,
  Tooltip,
  Text,
  useEditableControls,
} from "@chakra-ui/react";
import { useSelect } from "downshift";
import React from "react";
import { DataContext } from "../DataContext";
import { getColor, stateReducer } from "../utils";

const SelectExtra = () => {
  const {
    events,
    extraEvents,
    renameExtra,
    toggleExtra,
    removeExtra,
    removeAllExtra,
  } = React.useContext(DataContext);

  const { isOpen, getItemProps, getToggleButtonProps, getMenuProps } =
    useSelect({
      stateReducer,
      items: extraEvents,
    });

  return (
    <>
      <Flex direction="row" justify="flex-end">
        <Box {...getToggleButtonProps()}>
          <Button
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
          const color = getColor(event);

          return (
            <Box
              py={1}
              _hover={{ bg: "hovercolor" }}
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
