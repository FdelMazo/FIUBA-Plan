import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuItemOption,
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
        Filtrar dias
      </MenuButton>
      <MenuList>
        <MenuOptionGroup 
          type="checkbox"
          title="Filtrar materias por dia"
          defaultValue="true"
        >
          {days.map((day, dayIdx) => {
            return (
              <MenuItemOption
                key={dayIdx}
                value={selectedDays.includes(dayIdx + 1)}
                onClick={() => {
                  if (selectedDays.includes(dayIdx + 1))
                    setSelectedDays(selectedDays.filter((d) => {
                      return d !== dayIdx + 1;
                    }));
                  else
                    setSelectedDays([...selectedDays, dayIdx + 1]);
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
