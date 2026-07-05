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

const COLORES_SUGERIDOS = [
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
  "#A2845E",
  "#8E8E93",
];

const ConfigColorPopover = ({
  configs,
  getConfigId,
  getConfigLabel,
  getColorConfig,
  onColorChange,
  titulo,
  labelVacia,
  labelConfigVacia,
  labelColor,
  alturaMinima = "220px",
  children,
}) => {
  const [configSeleccionadaId, setConfigSeleccionadaId] = React.useState(
    getConfigId(configs[0]),
  );

  React.useEffect(() => {
    if (!configs.length) {
      setConfigSeleccionadaId(undefined);
      return;
    }

    const existeConfigSeleccionada = configs.some(
      (config) => getConfigId(config) === configSeleccionadaId,
    );

    if (!configSeleccionadaId || !existeConfigSeleccionada) {
      setConfigSeleccionadaId(getConfigId(configs[0]));
    }
  }, [getConfigId, configs, configSeleccionadaId]);

  const configSeleccionada = React.useMemo(
    () =>
      configs.find((config) => getConfigId(config) === configSeleccionadaId),
    [getConfigId, configs, configSeleccionadaId],
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
            minH={alturaMinima}
          >
            <Box>
              <Text mb={2}>{titulo}</Text>
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
                  isDisabled={!configs.length}
                  rightIcon={
                    <>
                      <Text alignSelf="center" fontSize="x-small">
                        ({configs.length})
                      </Text>
                      <ChevronDownIcon />
                    </>
                  }
                >
                  <Text
                    fontSize="xs"
                    isTruncated
                    color={
                      configSeleccionada
                        ? getColorConfig(configSeleccionada)
                        : "primary.500"
                    }
                  >
                    {configSeleccionada
                      ? getConfigLabel(configSeleccionada)
                      : labelVacia}
                  </Text>
                </MenuButton>
                <MenuList maxH="220px" overflowY="auto">
                  {configs.map((config) => (
                    <MenuItem
                      key={getConfigId(config)}
                      fontSize="xs"
                      color={getColorConfig(config)}
                      onClick={() =>
                        setConfigSeleccionadaId(getConfigId(config))
                      }
                    >
                      {getConfigLabel(config)}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>

            <Box mt={4} flex="1" display="flex" flexDirection="column">
              {!configSeleccionada ? (
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
                    {labelConfigVacia}
                  </Text>
                </Box>
              ) : (
                  <>
                    <Box>
                      <Text mb={2}>{labelColor}</Text>

                      <ColorPicker
                        color={getColorConfig(configSeleccionada)}
                        onColorChange={(color) =>
                          onColorChange(configSeleccionada, color)
                        }
                      />
                    </Box>

                    {children?.(configSeleccionada)}
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
  return (
    <>
      <BlockPicker
        width="100%"
        triangle="hide"
        colors={COLORES_SUGERIDOS}
        styles={{
          default: {
            body: {
              padding: "10px",
            },
            label: {
              textTransform: "uppercase",
            },
            input: {
              height: "40px",
              fontSize: "16px",
              color: color,
              borderRadius: "6px",
              padding: "0 10px",
              boxShadow: "none",
            },
          },
        }}
        color={color}
        onChange={(colorSiguiente) => {
          const colorHex = colorSiguiente.hex.toUpperCase();
          onColorChange(colorHex);
        }}
      />
    </>
  );
};

export default ConfigColorPopover;
