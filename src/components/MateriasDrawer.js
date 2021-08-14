import {
  Alert,
  AlertIcon,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Icon,
  IconButton,
  Link,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../Context";
import SelectCarreras from "./SelectCarreras";
import SelectCurso from "./SelectCurso";
import SelectMateria from "./SelectMateria";

const MateriasDrawer = (props) => {
  const { useAgenda, setUseAgenda, isOpen, onClose } = props;
  const { data } = React.useContext(DataContext);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg="background">
        <DrawerBody
          style={{
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <Box textAlign={["right"]}>
            <SelectCarreras />
            {data.materias
              .filter((m) => m.visible)
              .map((m) => (
                <SelectCurso materia={m} />
              ))}
            {data.materias.filter((m) => m.show).length !== 0 && (
              <SelectMateria />
            )}
          </Box>
        </DrawerBody>
        <DrawerFooter
          flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Tooltip
            label="Cambiar vista"
            fontFamily="general"
            backgroundColor="tooltipBackground"
            placement="top"
          >
            <IconButton
              variant="outline"
              colorScheme="primary"
              icon="calendar"
              onClick={() => setUseAgenda(!useAgenda)}
            />
          </Tooltip>
          <Box>
            <Tooltip
              label="FIUBA-Map"
              fontFamily="general"
              backgroundColor="tooltipBackground"
              placement="top"
            >
              <Link
                isExternal
                color="primary.500"
                href="https://fdelmazo.github.io/FIUBA-Map/"
              >
                <Icon mx={2} size="1.5em" name="graph" />
              </Link>
            </Tooltip>
            <Tooltip
              label="FdelMazo/FIUBA-Plan"
              fontFamily="general"
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
            <Tooltip
              label="Invitame un Cafecíto"
              fontFamily="general"
              backgroundColor="tooltipBackground"
              placement="top"
            >
              <Link
                isExternal
                color="primary.500"
                href="https://cafecito.app/fdelmazo"
              >
                <Icon mx={2} size="1.5em" name="cafecito" />
              </Link>
            </Tooltip>
          </Box>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MateriasDrawer;
