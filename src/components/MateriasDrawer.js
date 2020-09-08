import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Link,
  useToast,
  Box,
  Icon,
} from "@chakra-ui/core";
import SelectCarreras from "./SelectCarreras";
import SelectMateria from "./SelectMateria";
import SelectCurso from "./SelectCurso";
import { DataContext } from "../Context";

const MateriasDrawer = (props) => {
  const { data } = React.useContext(DataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const AddButton = () => (
    <IconButton
      m={10}
      onClick={onOpen}
      variantColor="primary"
      aria-label="Agregar Materia"
      icon="add"
      color="background"
      borderColor="background"
      fontFamily="general"
    />
  );

  React.useEffect(() => {
    toast({
      position: "bottom-right",
      render: () => <AddButton />,
      duration: null,
    });
  }, [toast]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="background">
        <DrawerBody>
          <Box textAlign={["right"]}>
            <SelectCarreras />
            {data.materias
              .filter((m) => m.visible)
              .map((m) => {
                return <SelectCurso materia={m} />;
              })}
            <SelectMateria />
          </Box>
        </DrawerBody>
        <DrawerFooter>
          <Link
            isExternal
            color="primary.500"
            href="https://github.com/fdelmazo/FIUBA-Plan"
          >
            <Icon color="primary" name="github" />
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MateriasDrawer;
