import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Button,
  Collapse,
  Link,
  Tag,
  TagIcon,
  TagLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/core";
import { data } from "../data/horarios";

const AddMateria = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hideButton, setHideButton] = React.useState(false);
  const btnRef = React.useRef();
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  return (
    <>
      {!hideButton && (
        <IconButton
          m={5}
          ref={btnRef}
          onClick={() => {
            onOpen();
            setHideButton(true);
          }}
          variantColor="primary"
          aria-label="Agregar Materia"
          icon="add"
        />
      )}

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose();
          setHideButton(false);
        }}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent textAlign={["right"]}>
          <DrawerBody>
            <Button
              rightIcon="chevron-down"
              variantColor="primary"
              variant="outline"
              onClick={handleToggle}
            >
              Carreras
            </Button>
            <Collapse my={2} isOpen={show}>
              {data.carreras.map((c) => (
                <Tag m={1}>
                  <TagLabel>{c.nombre}</TagLabel>
                  <TagIcon icon="view" />
                </Tag>
              ))}
            </Collapse>
            <InputGroup my={2} size="md">
              <Input
                borderColor="primary.400"
                focusBorderColor="primary.400"
                placeholder="Buscar Materia..."
              />
              <InputRightElement
                children={<Icon name="search" color="primary.400" />}
              />
            </InputGroup>
          </DrawerBody>
          <DrawerFooter>
            <Link
              isExternal
              color="primary.600"
              href="https://github.com/fdelmazo/FIUBA-Plan"
            >
              <Icon color="primary" name="github" />
            </Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddMateria;
