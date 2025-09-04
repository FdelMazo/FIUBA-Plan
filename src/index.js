import { ChakraProvider, Flex } from "@chakra-ui/react";
import "@fontsource/source-sans-pro/400.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import Body from "./components/Body";
import { DataProvider } from "./DataContext";
import customTheme from "./theme";

import { useToast } from '@chakra-ui/react'

const App = () => {
  const toast = useToast();

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        console.warn(
          "Hubo un error inesperado. Se limpian los datos guardados",
          error
        );

        toast({
          title: "Ocurrió un error",
          description: "Se limpiaron los datos guardados.",
          status: "error",
          duration: 9000,
          isClosable: true,
        })

        // Llamamos resetErrorBoundary() para resetear el error boundary y volver
        // a intentar el render
        resetErrorBoundary();
      }}
      onReset={() => {
        localStorage.setItem("fiubaplan", JSON.stringify({}));
      }}
    >
      <DataProvider>
        <Flex direction="columns" h="100dvh">
          <Body />
        </Flex>
      </DataProvider>
    </ErrorBoundary>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <ChakraProvider theme={customTheme}>
    <App />
  </ChakraProvider>
);
