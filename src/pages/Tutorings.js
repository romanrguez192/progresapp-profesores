import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { getTutoringsByDegree } from "../firebase/functions";
import {
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  LinearProgress,
} from "@material-ui/core";
import "./Tutorings.css";
import { degrees } from "../degrees";
import Divider from "@material-ui/core/Divider";
import TutoringIcon from "@material-ui/icons/MenuBook";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const Tutorings = () => {
  const user = useUser();
  const [tutorings, setTutorings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [degree, setDegree] = useState(user.degree);

  useEffect(() => {
    setLoading(true);
    return getTutoringsByDegree(degree, (tutorings) => {
      setTutorings(tutorings);
      setLoading(false);
    });
  }, [degree]);

  const handleChangeDegree = (e) => {
    setDegree(e.target.value);
  };

  return (
    /* Contenedor de la pantalla de tutorías */
    <div className="cBackgroundTutoring">
      <div>{loading && <LinearProgress color="secondary" />}</div>
      {/*Título Tutorías*/}
      <div className="cTitleTutoring">
        <h1>
          Tutorías
        </h1>
      </div>
      {/* Seleccionador de carrera */}
      <TextField
        select
        label="Seleccionar Carrera"
        variant="outlined"
        onChange={(e) => handleChangeDegree(e)}
        value={degree}
        style={{ width: "200pt" }}
      >
        {degrees.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
      {/* Línea divisora */}
      <div className="divTutoring">
        <Divider />
      </div>
      {!loading && (
        /* Lista de tutorías */
        <div className="cListTutoring">
          <List>
            {tutorings.map((tutoring) => (
              /* Elemento de la lista */
              <ListItem
                key={tutoring.id}
                button
                divider                
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "5pt",
                  marginBottom: "10pt",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",

                }}
                component={Link}
                to={"/tutorias/" + tutoring.id}
              >
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#d3485a40" }}>
                    <TutoringIcon color="secondary"/>
                  </Avatar>
                </ListItemAvatar>
                {/* Barra vertical */}
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ marginRight: "7pt" }}
                />
                <ListItemText
                  key={tutoring.id + "txt"}
                  primary={tutoring.name}
                  secondaryTypographyProps={{color: "textSecondary", align: "left"}}
                  secondary={`${tutoring.tutor.name}\n${
                    days[tutoring.day]
                  } ${format(tutoring.startTime, "p")} - ${format(
                    tutoring.endingTime,
                    "p"
                  )}`}
                  style={{ whiteSpace: "pre-wrap"}}                  
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default Tutorings;
