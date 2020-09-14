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
  Tooltip,
} from "@chakra-ui/core";
import SelectCarreras from "./SelectCarreras";
import SelectMateria from "./SelectMateria";
import SelectCurso from "./SelectCurso";
import { DataContext } from "../Context";

const MateriasDrawer = (props) => {
  const {useAgenda, setUseAgenda} = props;
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
              .map((m) => (
                <SelectCurso materia={m} />
              ))}
            <SelectMateria />
          </Box>
        </DrawerBody>
        <DrawerFooter>
          <Link
            isExternal
            color="primary.500"
            href="https://github.com/fdelmazo/FIUBA-Plan"
          >
            <Icon size="2em" color="primary" name="github" />
          </Link>
          <Tooltip 
            zIndex={5502}
            label="Cambiar vista"
            fontFamily="general"
            backgroundColor="tooltipBackground"
          >
            <IconButton
              pos="absolute"
              left="10%"
              bottom="2%"
              variant="outline"
              variantColor="primary"
              icon="calendar"
              onClick={() => setUseAgenda(!useAgenda)}
            />
          </Tooltip>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MateriasDrawer;
