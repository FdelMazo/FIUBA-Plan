import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Alert,
  AlertIcon,
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
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();

  const AddButton = () => (
    <IconButton
      m={10}
      onClick={onToggle}
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
    toast({
      position: "bottom",
      duration: 2000,
      render: () => (
        <Alert borderRadius={5} mx={10} mb={8} status="success">
          <AlertIcon />
          Actualizado al {data.cuatrimestre}
        </Alert>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="background" zIndex={5501}>
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
