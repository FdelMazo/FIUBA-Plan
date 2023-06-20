import { data as jsonData } from "../data/horarios";
import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Box,
    Button,
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
    PopoverContent,
    PopoverTrigger,
    Tab,
    Tabs,
    Text,
    useTab,
    useToast,
} from "@chakra-ui/react";
import "moment/locale/es";
import React from "react";
import { DataContext } from "../Context";

const actualizacion = {
    cuatrimestre: jsonData.cuatrimestre,
    timestamp: jsonData.timestamp,
}

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

    if (readOnly && !toast.isActive('readonly')) {
        toast({
            id: 'readonly',
            duration: null,
            isClosable: false,
            position: 'top',
            render: () => (
                <LightMode>
                    <Alert borderRadius="md" p={5} colorScheme="purple">
                        <Box color="gray.800">
                            <AlertTitle>Estás navegando desde un permalink.</AlertTitle>
                            <AlertDescription fontSize={"sm"}>
                                Nada de lo que hagas se guarda en esta sesión.
                                <br />
                                No se pierden tus datos anteriores.
                            </AlertDescription>
                        </Box>
                        <Button mx={2} size="sm" colorScheme="purple" variant="outline" onClick={() => {
                            setReadOnly(false)
                            toast.closeAll()
                        }}>Guardar estos datos</Button>
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
            <Link
                alignSelf="center"
                px={4}
                isExternal
                _hover={{ border: "none" }}
                href="https://ofertahoraria.fi.uba.ar/"
            >
                <Popover placement="bottom" trigger="hover">
                    <PopoverTrigger>
                        <Text>Actualizado al: <strong>{actualizacion.cuatrimestre}</strong></Text>
                    </PopoverTrigger>
                    <PopoverContent borderColor="primary.500" mr={2}>
                        <PopoverArrow bg="primary.500" />
                        <PopoverBody>
                            <Text>El <strong>FIUBA-Plan</strong> actualiza sus horarios desde <strong>ofertahoraria</strong>, un servicio hecho por FIUBA que puede no estar siempre actualizado frente a los horarios canónicos, que se ven en el SIU.</Text>
                            <br />
                            <Text>Última Actualización: <strong>{actualizacion.timestamp}</strong></Text>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Link>
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
