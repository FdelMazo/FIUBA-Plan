import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  DarkMode,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { BlockPicker } from "react-color";

const HEX_COLOR_REGEX = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const SUGGESTED_COLORS = [
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#00C7BE",
  "#32ADE6",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#FF6B6B",
  "#00E5FF",
  "#76FF03",
  "#FFD600",
];

const ConfigColorPopover = ({
  items,
  getItemId,
  getItemLabel,
  getItemColor,
  onColorChange,
  title,
  emptyLabel,
  emptyConfigLabel,
  colorLabel,
  minHeight = "220px",
  children,
}) => {
  const [selectedItemId, setSelectedItemId] = React.useState(
    getItemId(items[0]),
  );

  React.useEffect(() => {
    if (!items.length) {
      setSelectedItemId(undefined);
      return;
    }

    const selectedItemExists = items.some(
      (item) => getItemId(item) === selectedItemId,
    );

    if (!selectedItemId || !selectedItemExists) {
      setSelectedItemId(getItemId(items[0]));
    }
  }, [getItemId, items, selectedItemId]);

  const selectedItem = React.useMemo(
    () => items.find((item) => getItemId(item) === selectedItemId),
    [getItemId, items, selectedItemId],
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
          <PopoverBody
            px={4}
            py={4}
            display="flex"
            flexDirection="column"
            minH={minHeight}
          >
            <Box>
              <Text mb={2}>{title}</Text>
              <Menu matchWidth>
                <MenuButton
                  as={Button}
                  width="100%"
                  justifyContent="space-between"
                  px={2}
                  colorScheme="primary"
                  variant="outline"
                  borderColor="primary"
                  color="primary.500"
                  isDisabled={!items.length}
                  rightIcon={
                    <>
                      <Text alignSelf="center" fontSize="x-small">
                        ({items.length})
                      </Text>
                      <ChevronDownIcon />
                    </>
                  }
                >
                  <Text
                    fontSize="xs"
                    isTruncated
                    color={selectedItem ? getItemColor(selectedItem) : "primary.500"}
                  >
                    {selectedItem ? getItemLabel(selectedItem) : emptyLabel}
                  </Text>
                </MenuButton>
                <MenuList maxH="220px" overflowY="auto">
                  {items.map((item) => (
                    <MenuItem
                      key={getItemId(item)}
                      fontSize="xs"
                      color={getItemColor(item)}
                      onClick={() => setSelectedItemId(getItemId(item))}
                    >
                      {getItemLabel(item)}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>

            <Box mt={4} flex="1" display="flex" flexDirection="column">
              {!selectedItem ? (
                <Box
                  flex="1"
                  width="100%"
                  border="1px dashed"
                  borderColor="whiteAlpha.400"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="sm" color="whiteAlpha.500" textAlign="center">
                    {emptyConfigLabel}
                  </Text>
                </Box>
              ) : (
                <>
                  <Box>
                    <Text mb={2}>{colorLabel}</Text>

                    <ColorPicker
                      color={getItemColor(selectedItem)}
                      onColorChange={(color) => onColorChange(selectedItem, color)}
                    />
                  </Box>

                  {children?.(selectedItem)}
                </>
              )}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </DarkMode>
    </Popover>
  );
};

const ColorPicker = ({ color, onColorChange }) => {
  const [inputColor, setInputColor] = React.useState(color);

  React.useEffect(() => {
    setInputColor((color || "").toUpperCase());
  }, [color]);

  const isColorInvalid =
    inputColor?.length > 0 && !HEX_COLOR_REGEX.test(inputColor);

  return (
    <>
      <BlockPicker
        width="100%"
        triangle="hide"
        colors={SUGGESTED_COLORS}
        styles={{
          default: {
            body: {
              padding: "10px 10px 0",
            },
            label: {
              textTransform: "uppercase",
            },
            input: {
              display: "none",
            },
          },
        }}
        color={HEX_COLOR_REGEX.test(color) ? color : "#FFFFFF"}
        onChange={(nextColor) => {
          const hexColor = nextColor.hex.toUpperCase();
          setInputColor(hexColor);
          onColorChange(hexColor);
        }}
      />

      <FormControl mt={3} isInvalid={isColorInvalid}>
        <Flex align="center" gap={2}>
          <Text fontSize="sm" fontWeight="semibold">
            HEX:
          </Text>
          <Input
            value={inputColor}
            placeholder="#AABBCC o #ABC"
            textTransform="uppercase"
            onChange={(event) => {
              const nextColor = event.target.value.toUpperCase();
              setInputColor(nextColor);

              if (HEX_COLOR_REGEX.test(nextColor)) {
                onColorChange(nextColor);
              }
            }}
          />
        </Flex>
        <FormErrorMessage>Código de color inválido</FormErrorMessage>
      </FormControl>
    </>
  );
};

export default ConfigColorPopover;
