import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { DataContext } from "../DataContext";

const escapeICS = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
};

// Formatear fecha en formato .ics
const formatICSDate = (dateArray) => {
  const [year, month, day, hour = 0, minute = 0] = dateArray;
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  const hourStr = String(hour).padStart(2, "0");
  const minuteStr = String(minute).padStart(2, "0");
  return `${year}${monthStr}${dayStr}T${hourStr}${minuteStr}00`;
};

// Generar contenido del archivo .ics
const generateICSContent = (events) => {
  const now = new Date();
  const nowStr = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const baseTimestamp = Date.now();
  
  let content = "BEGIN:VCALENDAR\r\n";
  content += "VERSION:2.0\r\n";
  content += "PRODID:-//FIUBA-Plan//ES\r\n";
  content += "CALSCALE:GREGORIAN\r\n";
  content += "METHOD:PUBLISH\r\n";
  
  events.forEach((event, index) => {
    const uid = `fiuba-plan-${baseTimestamp}-${index}@fiuba-plan.local`;
    const startStr = formatICSDate(event.start);
    const endStr = formatICSDate(event.end);
    
    content += "BEGIN:VEVENT\r\n";
    content += `UID:${uid}\r\n`;
    content += `DTSTAMP:${nowStr}\r\n`;
    content += `DTSTART:${startStr}\r\n`;
    content += `DTEND:${endStr}\r\n`;
    content += `SUMMARY:${escapeICS(event.title)}\r\n`;
    if (event.description) {
      content += `DESCRIPTION:${escapeICS(event.description)}\r\n`;
    }
    if (event.recurrenceRule) {
      content += `RRULE:${event.recurrenceRule}\r\n`;
    }
    content += "STATUS:CONFIRMED\r\n";
    content += "SEQUENCE:0\r\n";
    content += "END:VEVENT\r\n";
  });
  
  content += "END:VCALENDAR\r\n";
  
  return content;
};

const ExportCalendarModal = ({ isOpen, onClose }) => {
  const { events, activeTabId, tabs } = React.useContext(DataContext);
  const toast = useToast();
  
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  
  // Establecer fechas por defecto (próximo lunes y 16 semanas después)
  React.useEffect(() => {
    if (isOpen && !startDate) {
      const today = new Date();
      const nextMonday = new Date(today);
      const dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
      
      // Calcular días hasta el próximo lunes
      // Si hoy es lunes (1), el próximo lunes es en 7 días
      // Si hoy es domingo (0), el próximo lunes es en 1 día
      // Para otros días: (1 + 7 - dayOfWeek) % 7 da los días restantes de la semana
      const daysUntilMonday = dayOfWeek === 0 ? 1 : (1 + 7 - dayOfWeek) % 7 || 7;
      nextMonday.setDate(today.getDate() + daysUntilMonday);
      nextMonday.setHours(0, 0, 0, 0);
      
      const endDateDefault = new Date(nextMonday);
      endDateDefault.setDate(nextMonday.getDate() + 16 * 7); // 16 semanas después
      
      setStartDate(nextMonday.toISOString().split("T")[0]);
      setEndDate(endDateDefault.toISOString().split("T")[0]);
    }
  }, [isOpen, startDate]);

  // Validar si se pueden exportar los eventos
  const canExport = React.useMemo(() => {
    if (!startDate || !endDate) return false;
    if (events.length === 0) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return start < end;
  }, [startDate, endDate, events.length]);

  const generateICS = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      toast({
        title: "Error",
        description: "La fecha de inicio debe ser anterior a la fecha de fin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (events.length === 0) {
      toast({
        title: "Error",
        description: "No hay eventos para exportar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const icsEvents = [];

      events.forEach((event) => {
        // Los eventos tienen start y end como Date objects con fecha de 2018
        // Necesitamos calcular la fecha real basándonos en el día de la semana
        
        const eventDayOfWeek = event.start.getDay(); // 0 = domingo, 1 = lunes, etc.
        
        // Extraer horas y minutos del evento original
        const startHours = event.start.getHours();
        const startMinutes = event.start.getMinutes();
        const endHours = event.end.getHours();
        const endMinutes = event.end.getMinutes();
        
        // Encontrar la primera ocurrencia del día de la semana en el rango
        const currentDate = new Date(start);
        const endDateObj = new Date(end);
        endDateObj.setHours(23, 59, 59, 999); // Incluir el día completo
        
        // Avanzar hasta el primer día de la semana que coincide
        while (currentDate.getDay() !== eventDayOfWeek && currentDate <= endDateObj) {
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Si encontramos al menos una ocurrencia, crear el evento recurrente
        if (currentDate <= endDateObj) {
          // Crear fecha de inicio del evento (primera ocurrencia)
          const eventStart = new Date(currentDate);
          eventStart.setHours(startHours, startMinutes, 0, 0);
          
          // Crear fecha de fin del evento (primera ocurrencia)
          const eventEnd = new Date(currentDate);
          eventEnd.setHours(endHours, endMinutes, 0, 0);
          
          // Si la hora de fin es menor que la de inicio, el evento cruza medianoche
          if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes)) {
            eventEnd.setDate(eventEnd.getDate() + 1);
          }
          
          // Verificar que la fecha de fin no sea anterior a la de inicio (validación adicional)
          if (eventEnd < eventStart) {
            eventEnd.setDate(eventEnd.getDate() + 1);
          }

          // Formatear para ics (año, mes, día, hora, minuto)
          const icsStart = [
            eventStart.getFullYear(),
            eventStart.getMonth() + 1,
            eventStart.getDate(),
            eventStart.getHours(),
            eventStart.getMinutes(),
          ];
          
          const icsEnd = [
            eventEnd.getFullYear(),
            eventEnd.getMonth() + 1,
            eventEnd.getDate(),
            eventEnd.getHours(),
            eventEnd.getMinutes(),
          ];

          // Formatear fecha de fin para la regla de recurrencia (formato YYYYMMDDTHHMMSSZ)
          // Usar UTC para evitar problemas de zona horaria
          const untilDate = new Date(endDateObj);
          untilDate.setHours(23, 59, 59, 0);
          const untilUTC = new Date(Date.UTC(
            untilDate.getFullYear(),
            untilDate.getMonth(),
            untilDate.getDate(),
            untilDate.getHours(),
            untilDate.getMinutes(),
            untilDate.getSeconds()
          ));
          const year = untilUTC.getUTCFullYear();
          const month = String(untilUTC.getUTCMonth() + 1).padStart(2, "0");
          const day = String(untilUTC.getUTCDate()).padStart(2, "0");
          const hour = String(untilUTC.getUTCHours()).padStart(2, "0");
          const minute = String(untilUTC.getUTCMinutes()).padStart(2, "0");
          const second = String(untilUTC.getUTCSeconds()).padStart(2, "0");
          const untilStr = `${year}${month}${day}T${hour}${minute}${second}Z`;

          icsEvents.push({
            title: event.title || "Evento sin título",
            description: event.subtitle || "",
            start: icsStart,
            end: icsEnd,
            startInputType: "local",
            endInputType: "local",
            recurrenceRule: `FREQ=WEEKLY;UNTIL=${untilStr}`,
          });
        }
      });

      if (icsEvents.length === 0) {
        toast({
          title: "Error",
          description: "No se pudieron generar eventos",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Generar el contenido del archivo .ics manualmente
      const icsContent = generateICSContent(icsEvents);

      // Crear y descargar el archivo
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const tabName = tabs.find((t) => t.id === activeTabId)?.title || `Plan #${activeTabId + 1}`;
      link.download = `FIUBA-Plan-${tabName.replace(/[^a-z0-9]/gi, "_")}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Éxito",
        description: "Archivo .ics generado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error inesperado al generar el archivo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Exportar a Calendario</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Fecha de inicio del período académico</FormLabel>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Fecha de fin del período académico</FormLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button 
            colorScheme="purple" 
            mr={3} 
            onClick={generateICS}
            isDisabled={!canExport}
          >
            Exportar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportCalendarModal;

