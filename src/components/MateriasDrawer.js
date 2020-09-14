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
            {data.materias.filter((m) => m.show).length !== 0 &&
              <SelectMateria />
            }
          </Box>
        </DrawerBody>
        <DrawerFooter flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Tooltip 
            label="Cambiar vista"
            fontFamily="general"
            zIndex={5501}
            backgroundColor="tooltipBackground"
            placement="top"
          >
            <IconButton
              variant="outline"
              variantColor="primary"
              icon="calendar"
              onClick={() => setUseAgenda(!useAgenda)}
            />
          </Tooltip>
          <Box>
            <Tooltip
              label="FdelMazo at fi.uba.ar"
              fontFamily="general"
              zIndex={5501}
              backgroundColor="tooltipBackground"
              placement="top"
            >
              <Icon mx={2} size="1.5em" color="primary.500" name="email" />
            </Tooltip>
            <Tooltip
              label="FdelMazo/FIUBA-Plan"
              fontFamily="general"
              zIndex={5501}
              backgroundColor="tooltipBackground"
              placement="top"
            >
              <Link
                isExternal
                color="primary.500"
                href="https://github.com/fdelmazo/FIUBA-Plan"
              >
                <Icon mx={2} size="1.5em" name="github" />
              </Link>
            </Tooltip>
          </Box>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MateriasDrawer;
