import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";

const SelectMateriaDay = () => {
  const days = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
  ];
  const [selectedDays, setSelectedDays] = React.useState([1, 2, 3, 4, 5, 6]);

  React.useEffect(() => {
    console.log(selectedDays);
  }, [selectedDays]);

  return (
    <Menu isLazy closeOnSelect={false}>
      <MenuButton
        colorScheme="primary"
        color="primary.600"
        variant="outline"
        borderRadius="md"
        as={Button}
      >
        Seleccionar dias
      </MenuButton>
      <MenuList>
        {days.map((day) => {
          return (
            <MenuItem
              // color="primary.500"
              // colorScheme="primary"
              key={days.indexOf(day)}
              value={days.indexOf(day) + 1}
              onClick={() => {
                const dayIndex = days.indexOf(day) + 1;

                if (selectedDays.includes(dayIndex))
                  setSelectedDays(selectedDays.filter((d) => {
                    return d != dayIndex;
                  }));
                else
                  setSelectedDays([...selectedDays, dayIndex]);
              }}
            >
              {day}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default SelectMateriaDay;
