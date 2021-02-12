import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { createTutoring } from "../firebase/functions";
import {
  TextField,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { degreeSubjects } from "../degrees";
import { useParams } from "react-router-dom";
import { KeyboardTimePicker } from "@material-ui/pickers";
import "./CreateTutoring.css";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

const days = [
  {
    number: 0,
    name: "Lunes",
  },
  {
    number: 1,
    name: "Martes",
  },
  {
    number: 2,
    name: "Miércoles",
  },
  {
    number: 3,
    name: "Jueves",
  },
  {
    number: 4,
    name: "Viernes",
  },
  {
    number: 5,
    name: "Sábado",
  },
  {
    number: 6,
    name: "Domingo",
  },
];

const CreateTutoring = ({ close }) => {
  // Estado inicial
  const initialData = {
    subjectID: "",
    day: "",
    startTime: new Date(),
    classRoom: "",
    groupLink: "",
  };

  // States
  const [tutoring, setTutoring] = useState({ ...initialData });
  const [errorMessages, setErrorMessages] = useState({ ...initialData });

  const user = useUser();

  const subjects = degreeSubjects(user.degree);

  // Función llamada al cambiar el texto del input
  const handleChangeText = (name, value) => {
    setTutoring({ ...tutoring, [name]: value });
  };

  const publish = async () => {
    const errorMessages = { ...initialData };

    // Verifica los input
    if (tutoring.subjectID === "") {
      errorMessages.subjectID = "Selecciona el curso de tu tutoría";
    }
    if (tutoring.day === "") {
      errorMessages.day = "Selecciona el día de tu tutoría";
    }
    if (tutoring.classRoom === "") {
      errorMessages.classRoom = "Ingresa el salón de tu tutoría";
    }
    if (
      tutoring.startTime == "Invalid Date" ||
      tutoring.subjectID === "" ||
      tutoring.day === "" ||
      tutoring.classRoom === ""
    ) {
      setErrorMessages(errorMessages);
      return;
    }

    try {
      await createTutoring(user, tutoring);
      close();
    } catch (error) {
      console.log(error);
      // TODO: Error de desconexión
      setErrorMessages(errorMessages);
    }
  };

  return (
    <div className="cCreateT">
      {/* Select de la materia */}
      <div className="cInputCreate">
        <TextField
          fullWidth
          select
          label="Seleccionar Curso"
          variant="outlined"
          required
          error={errorMessages.subjectID !== ""}
          helperText={errorMessages.subjectID}
          onChange={(e) => handleChangeText("subjectID", e.target.value)}
          value={tutoring.subjectID}
        >
          {subjects.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {/* TODO: No centrar tanto */}
      <div className="cInputCreate">
        <TextField
          fullWidth
          select
          label="Día de la Semana"
          variant="outlined"
          required
          error={errorMessages.day !== ""}
          helperText={errorMessages.day}
          onChange={(e) => handleChangeText("day", e.target.value)}
          value={tutoring.day}
        >
          {days.map((option) => (
            <MenuItem key={option.number} value={option.number}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <div className="cInputCreate">
        <KeyboardTimePicker
          required
          fullWidth
          label="Hora de Inicio"
          value={tutoring.startTime}
          onChange={(value) => handleChangeText("startTime", value)}
          inputVariant="outlined"
          invalidDateMessage="Formato de fecha inválida"
          cancelLabel="Cancelar"
          keyboardIcon={<AccessTimeIcon />}
        />
      </div>
      <div className="cInputCreate">
        <TextField
          fullWidth
          label="Salón"
          placeholder="Ej: AR-22 o Virtual"
          variant="outlined"
          required
          error={errorMessages.classRoom !== ""}
          helperText={errorMessages.classRoom}
          onChange={(e) => handleChangeText("classRoom", e.target.value)}
        ></TextField>
      </div>
      <div className="cInputCreate">
        <TextField
          fullWidth
          label="Enlace de Grupo (WhatsApp)"
          variant="outlined"
          placeholder="Ej: https://chat.whatsapp.com/GIZ0lkQBlHGI2s9w0WJBC2"
          error={errorMessages.groupLink !== ""}
          helperText={errorMessages.groupLink}
          onChange={(e) => handleChangeText("groupLink", e.target.value)}
        ></TextField>
      </div>
      <div className="cBCreateTutoring">
        <Button
          size="medium"
          variant="contained"
          fullWidth
          color="primary"
          onClick={publish}
        >
          Publicar Tutoría
        </Button>
      </div>
      <div className="cBCancelTutoring">
        <Button
          size="medium"
          variant="contained"
          fullWidth
          color="secondary"
          onClick={close}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default CreateTutoring;
export { days };
