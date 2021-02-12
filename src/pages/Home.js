import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import "./Home.css";
import { getStudentTutorings } from "../firebase/functions";
import { Link } from "react-router-dom";
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import TutoringIcon from "@material-ui/icons/MenuBook";
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
const Home = () => {
  const user = useUser();
  const [tutorings, setTutorings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    return getStudentTutorings(user.uid, (tutorings) => {
      setTutorings(tutorings);
      setLoading(false);
    });
  }, [user.uid]);

  return (
    <div className="cHomeBackground">
      <div>{loading && <LinearProgress color="secondary" />}</div>
      <div className="cTitleHome">
        <h1>ProgresApp</h1>
        <p style={{ color: "#3c3b3e", fontSize: "20pt" }}>{user.name}</p>
      </div>
      {/* Línea divisora */}
      <div className="divHomeTutorings">
        <Divider />
      </div>
      {/* Si no está inscrito en nada */}
      {!loading && !tutorings.length && (
        <div>
          <p>
            Todavía no te has inscrito en ninguna tutoría. ¡Ve a{" "}
            <em>Buscar Tutorías</em> para inscribirte en una!
          </p>
        </div>
      )}
      <div className="cListHomeTutorings">
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
                  <TutoringIcon color="secondary" />
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
                secondaryTypographyProps={{
                  color: "textSecondary",
                  align: "left",
                }}
                secondary={`${tutoring.classRoom}\n${
                  days[tutoring.day]
                } ${format(tutoring.startTime, "p")} - ${format(
                  tutoring.endingTime,
                  "p"
                )}`}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Home;
