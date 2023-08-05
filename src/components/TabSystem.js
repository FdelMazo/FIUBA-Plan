import { data as jsonData } from "../data/horarios";
import { AddIcon, ExternalLinkIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Box,
    Button,
    CloseButton,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton,
    LightMode,
    Link,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Tab,
    Tabs,
    Text,
    useTab,
    useToast,
} from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import { DataContext } from "../DataContext";

const actualizacion = {
    cuatrimestre: jsonData.cuatrimestre,
    timestamp: jsonData.timestamp,
}

// Prender cuando FIUBA no actualiza ofertahoraria
const malaonda = false

const TabSystem = (props) => {
    const {
        activeTabId,
        tabs,
        selectTab,
        addTab,
        readOnly,
        setReadOnly
    } = React.useContext(DataContext);
    const toast = useToast();
    const inputref = React.useRef(null)

    const [readonlytoastclosed, setReadonlytoastclosed] = React.useState(false)
    if (readOnly && !toast.isActive('readonly') && !readonlytoastclosed) {
        toast({
            id: 'readonly',
            duration: null,
            isClosable: false,
            position: 'bottom-start',
            onCloseComplete: () => {
                setReadonlytoastclosed(true)
            },
            render: () => (
                <LightMode>
                    <Alert flexDir="column" borderRadius="md" p={4} colorScheme="purple" borderWidth={1} borderColor="purple.400">
                        <CloseButton
                            color="gray.800"
                            size="sm"
                            onClick={() => { toast.closeAll() }}
                            position="absolute"
                            insetEnd={1}
                            top={1}
                        />
                        <Box color="gray.800">
                            <AlertTitle>Estás navegando desde un permalink</AlertTitle>
                            <AlertDescription fontSize={"sm"}>
                                Para volver a tu plan anterior, recarga la página.
                                <br />
                                Para utilizar este plan como tuyo, guardalo.
                            </AlertDescription>
                        </Box>
                        <Button
                            mt={1}
                            alignSelf="flex-start"
                            size="sm"
                            colorScheme="purple"
                            variant="outline"
                            onClick={() => {
                                setReadOnly(false)
                                toast.closeAll()
                            }}
                        >Guardar este plan</Button>
                    </Alert>
                </LightMode>
            ),
        })
    }

    return (
        <Flex borderBottom="2px solid" borderColor="inherit" justifyContent="space-between">
            <Tabs
                onKeyDown={(e) => {
                    if (e.keyCode === 32) {
                        e.preventDefault()
                        const ch = e.target.selectionStart;
                        inputref.current.value = e.target.value.slice(0, ch) + " " + e.target.value.slice(ch);
                        e.target.selectionStart = ch + 1
                        e.target.selectionEnd = ch + 1
                    }
                }}
                index={tabs.map((t) => t.id).indexOf(activeTabId)}
                key={tabs.length}
                colorScheme="purple"
                onChange={(index) => {
                    selectTab(tabs[index]?.id || 0);
                }}
            >
                <Flex flexWrap="wrap">
                    {tabs.map((tab, index) => (
                        <CustomTab key={tab.id} tab={tab} index={index} ref={tabs[index]?.id === activeTabId ? inputref : undefined} />
                    ))}

                    {tabs.length < 5 && (
                        <IconButton
                            alignSelf="center"
                            variant="ghost"
                            colorScheme="purple"
                            onClick={() => {
                                addTab()
                            }}
                            icon={<AddIcon />}
                        />
                    )}
                </Flex>
            </Tabs>
            <Box alignSelf="center" px={4}>
                <Popover placement="bottom" trigger="hover" defaultIsOpen={malaonda}>
                    <PopoverTrigger>
                        <Text>Actualizado al <strong>{actualizacion.cuatrimestre}</strong></Text>
                    </PopoverTrigger>
                    <PopoverContent borderColor="primary.500" mr={2}>
                        <PopoverHeader fontSize="sm">
                            Última Actualización: <strong>{actualizacion.timestamp}</strong>
                        </PopoverHeader>
                        <PopoverArrow bg="primary.500" />
                        <PopoverCloseButton color="primary.500" top={0} right={0} />
                        <PopoverBody>
                            El <strong>FIUBA-Plan</strong> actualiza sus horarios desde <Link
                                isExternal
                                _hover={{
                                    color: "primary.500",
                                }}
                                href="https://ofertahoraria.fi.uba.ar/"
                            >
                                oferta horaria
                                <ExternalLinkIcon
                                    color="primary.500"
                                    mx="2px"
                                />
                            </Link>, un servicio hecho por FIUBA que puede no estar siempre actualizado frente a los horarios canónicos, que se ven en el SIU.
                        </PopoverBody>
                        <PopoverFooter>
                            Si ya se publicaron los horarios de un cuatrimestre nuevo en el SIU y no están en el FIUBA-Plan, se puede mandar un mail a secretaría académica pidiendo actualizar el sitio de ofertahoraria.
                        </PopoverFooter>
                    </PopoverContent>
                </Popover>
            </Box>
        </Flex>
    );
};

const CustomTab = React.forwardRef((props, ref) => {
    const { renameTab, removeTab } = React.useContext(DataContext);
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];

    return (
        <Tab {...tabProps} pr={isSelected ? 2 : 4}>
            <Editable
                isPreviewFocusable={isSelected}
                defaultValue={
                    props.tab.title?.trim()
                        ? props.tab.title
                        : `Plan #${props.index + 1}`
                }
                onClick={(ev) => {
                    ev.stopPropagation();
                }}
                onSubmit={(str) => {
                    renameTab(props.tab.id, str)
                }}
            >
                <Flex>
                    <EditablePreview maxW="12ch" />
                    <EditableInput
                        ref={ref}
                        maxW="12ch"
                        _focus={{
                            boxShadow: "0 0 0 3px rgba(183,148,244, 0.6)",
                        }}
                    />
                    {props.tab.id !== 0 && isSelected && (
                        <SmallCloseIcon
                            _hover={{ color: "primary.900" }}
                            boxSize="20px"
                            ml="5px"
                            color="primary.600"
                            onClick={() => {
                                removeTab(props.tab.id)
                            }}
                        />
                    )}
                </Flex>
            </Editable>
        </Tab>
    );
});

export default TabSystem
