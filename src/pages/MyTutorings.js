import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { getTutorTutorings } from "../firebase/functions";
import { useHistory } from "react-router-dom";
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import "./MyTutorings.css";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import CreateTutoring from "../components/CreateTutoring";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
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

const MyTutoring = () => {
  const [tutorings, setTutorings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const user = useUser();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);

    // TODO: Poner esto cuando sea posible asignar tutores
    // if (!user.isTutor) {
    //   history.replace("/");
    // }

    return getTutorTutorings(user.uid, (tutorings) => {
      setTutorings(tutorings);
      setLoading(false);
    });
  }, []);

  return (
    /* Contenedor de la pantalla de mis tutorías */
    <div className="cBackgroundMyTutorings">
      <div>{loading && <LinearProgress color="secondary" />}</div>
      {/* Título Mis Tutorías */}
      <div className="cTitleMyTutorings">
        <h1>Mis tutorías</h1>
      </div>
      <Dialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        aria-labelledby="create-dialog-title"
      >
        <DialogTitle id="create-dialog-title">Nueva Tutoría</DialogTitle>
        <DialogContent>
          <CreateTutoring close={() => setShowCreate(false)} />
        </DialogContent>
      </Dialog>
      {/* Línea divisora */}
      <div className="divMyTutorings">
        <Divider />
      </div>
      {/* Lista de tutorías */}
      {!loading &&
        (!tutorings.length ? (
          <div>
            {/* TODO: ESTO */}
            <p>
              Aún no has publicado tutorías. ¡Haz click en el botón para
              hacerlo!
            </p>
          </div>
        ) : (
          <div className="cListMyTutorings">
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
                  to={"/mistutorias/" + tutoring.id}
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
        ))}
      <div className="bAddTutoring">
        <Fab
          size="large"
          color="primary"
          aria-label="add"
          onClick={() => setShowCreate(true)}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default MyTutoring;
