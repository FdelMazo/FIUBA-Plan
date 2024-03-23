import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuItemOption,
  MenuList,
  Text,
} from "@chakra-ui/react";

const SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const SelectMateriaDay = ({ selectedDays, setSelectedDays }) => {
  return (
    <Menu isLazy closeOnSelect={false}>
      <MenuButton
        colorScheme="primary"
        fontWeight="300"
        _hover={{ bg:"primary.100", color: "gray.800" }}
        variant="outline"
        borderRadius="md"
        px={2}
        as={Button}
      >
        Filtros
      </MenuButton>
      <MenuList>
        <MenuOptionGroup 
          type="checkbox"
          title="Filtrar materias por dia"
          defaultValue="true"
        >
          {SEMANA.map((day, dayIndex) => {
            return (
              <MenuItemOption
                key={dayIndex + 1}
                value={selectedDays.includes(dayIndex + 1)}
                onClick={() => {
                  if (selectedDays.includes(dayIndex + 1))
                    setSelectedDays(selectedDays.filter((d) => {
                      return d !== dayIndex + 1;
                    }));
                  else
                    setSelectedDays([...selectedDays, dayIndex + 1]);
                }}
              >
                {day}
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default SelectMateriaDay;
