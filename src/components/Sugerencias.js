import { ChatIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton,
  DarkMode,
  Flex,
  IconButton,
  Link,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React from "react";

const submitBug = (bug) => {
  if (!bug) return;
  const formData = new FormData();
  formData.append(`entry.108884877`, "FIUBA-PLAN");
  formData.append(`entry.817568535`, bug || "");
  fetch(
    `https://docs.google.com/forms/d/1Mr4-4qWqZKaobjG3GI30aPvC5qlMsd6Eib3YGUbLd2k/formResponse`,
    {
      body: formData,
      method: "POST",
    },
  );
};

// Toast para reportar bugs
const Sugerencias = ({ onClose }) => {
  const bugToast = React.useRef();
  const toast = useToast();

  return (
    <Box>
      <Tag
        mt={2}
        variant="subtle"
        cursor="pointer"
        bg="primary.400"
        onClick={() => {
          onClose();
          if (toast.isActive(bugToast.current)) {
            toast.close(bugToast.current);
            return;
          }

          return (bugToast.current = toast({
            status: "info",
            position: "bottom",
            duration: null,
            isClosable: true,
            render: (props) => (
              <Alert
                borderRadius={6}
                p={8}
                mb="4em"
                borderWidth={2}
                _light={{
                  bg: "gray.50",
                  borderColor: "primary.500",
                  color: "black",
                }}
                _dark={{
                  bg: "drawerbg",
                  borderColor: "primary.400",
                  color: "white",
                }}
              >
                <Box flex="1">
                  <AlertTitle mb={2}>Hola!</AlertTitle>
                  <AlertDescription px={5} display="block">
                    <Text>
                      Si encontrás algo feo, incorrecto, lento, erroneo... me
                      decís?
                    </Text>
                    <Text>
                      Si ves algo que te gustó, o tenés alguna idea, también!
                    </Text>
                    <Text my={2}>
                      Actualizar los horarios *no* depende de mí. Si falta algo
                      o no están al día, el problema es que FIUBA no actualizó
                      el sitio de{" "}
                      <Link
                        isExternal
                        _hover={{
                          color: "primary.500",
                        }}
                        href="https://ofertahoraria.fi.uba.ar/"
                      >
                        oferta horaria.
                        <ExternalLinkIcon
                          _light={{
                            color: "primary.500",
                          }}
                          _dark={{
                            color: "primary.400",
                          }}
                          mx="2px"
                        />
                      </Link>
                    </Text>
                    <Text>
                      Estas sugerencias son *anónimas*. Si querés que te
                      responda, escribime tu mail o telegram!
                    </Text>
                    <form
                      onSubmit={async (t) => {
                        t.preventDefault();
                        await submitBug(t.target.elements["bug"].value).catch(
                          console.error,
                        );
                        toast.close(bugToast.current);
                      }}
                    >
                      <Flex mt={3} alignItems="flex-end">
                        <Textarea
                          resize="none"
                          _light={{
                            focusBorderColor: "red",
                            borderColor: "primary.500",
                            color: "black",
                          }}
                          _dark={{
                            focusBorderColor: "red",
                            borderColor: "primary.400",
                            color: "white",
                          }}
                          size="sm"
                          name="bug"
                        />
                        <DarkMode>
                          <IconButton
                            ml={3}
                            colorScheme="purple"
                            size="sm"
                            type="submit"
                            icon={<ChatIcon />}
                          />
                        </DarkMode>
                      </Flex>
                    </form>
                    <Text fontSize="sm" mt={2}>
                      ¿Usás Github? Me ayudás mucho más levantando un issue{" "}
                      <Link
                        isExternal
                        _hover={{
                          _light: {
                            color: "primary.500",
                          },
                          _dark: {
                            color: "primary.400",
                          },
                        }}
                        href="https://github.com/FdelMazo/FIUBA-Map/issues/new"
                      >
                        directamente{" "}
                        <ExternalLinkIcon
                          _light={{
                            color: "primary.500",
                          }}
                          _dark={{
                            color: "primary.400",
                          }}
                          mx="2px"
                        />
                      </Link>
                    </Text>
                  </AlertDescription>
                </Box>
                <CloseButton
                  _light={{
                    color: "primary.500",
                  }}
                  _dark={{
                    color: "primary.400",
                  }}
                  onClick={() => toast.close(props.id)}
                  position="absolute"
                  right="8px"
                  top="8px"
                />
              </Alert>
            ),
          }));
        }}
      >
        <TagLabel>Sugerencias</TagLabel>
        <TagRightIcon as={ChatIcon} />
      </Tag>
    </Box>
  );
};

export default Sugerencias;
