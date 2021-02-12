import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import {
  getTutoringById,
  joinTutoring,
  updateTutoring,
} from "../firebase/functions";
import {
  Button,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Divider,
  Avatar,
  ListItemAvatar,
} from "@material-ui/core";
import ScheduleIcon from "@material-ui/icons/QueryBuilderOutlined";
import { degrees } from "../degrees";
import { useParams, useHistory } from "react-router-dom";
import { format } from "date-fns";
import "./TutoringDetail.css";
import StudentsIcon from "@material-ui/icons/PersonOutlined";
import { faChalkboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogoWhatsapp } from "react-ionicons";
import ContactIcon from "@material-ui/icons/MailOutline";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Juéves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const TutoringDetail = () => {
  const [tutoring, setTutoring] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStudents, setShowStudents] = useState(false);

  const user = useUser();
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = getTutoringById(params.id, (tutoring) => {
      // Si soy el tutor
      if (tutoring && user.uid === tutoring.tutor.id) {
        history.replace(`/mistutorias/${params.id}`);
        return;
      }
      setTutoring(tutoring);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const join = async () => {
    if (tutoring.students.length === 15) {
      // TODO: Ver de qué forma colocamos este diálgo
      alert("Está lleno mi helmano");
      return;
    }

    try {
      await joinTutoring(tutoring, user);
      // TODO: MENSAJE
    } catch (error) {
      console.log(error);
      // TODO: Colocar de alguna forma el error
    }
  };

  const leave = async () => {
    const index = tutoring.studentsIDs.indexOf(user.uid);

    tutoring.studentsIDs.splice(index, 1);
    tutoring.students.splice(index, 1);

    try {
      await updateTutoring(tutoring.id, {
        studentsIDs: tutoring.studentsIDs,
        students: tutoring.students,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Verifica la pertenencia a la tutoría
  const belongs = () => {
    return tutoring.studentsIDs.includes(user.uid);
  };

  if (loading) {
    return (
      <div>
        <LinearProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="cBackgroundTutoringDetail">
      {!tutoring ? (
        <div className="pTitlesTutoring">
          <p className="nTutoring" style={{ color: "#3c3b3e" }}>
            Tutoría no encontrada
          </p>
          <p className="nTutor" style={{ color: "#3c3b3e" }}>
            La tutoría que buscabas desafortunadamente ya no existe
          </p>
        </div>
      ) : (
        <div>
          <div className="pTitlesTutoring">
            <p className="nTutoring" style={{ color: "#3c3b3e" }}>
              {tutoring.name}
            </p>
            <p className="nTutor" style={{ color: "#3c3b3e" }}>
              {tutoring.tutor.name}
            </p>
          </div>
          <div className="cInfoTutoring">
            <Divider style={{ marginBottom: "10pt" }} />
            <List>
              <ListItem
                divider
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "5pt",
                  marginBottom: "10pt",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#fca97640" }}>
                    <ScheduleIcon style={{ color: "#fca976" }} />
                  </Avatar>
                </ListItemAvatar>
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ marginRight: "7pt" }}
                />
                <ListItemText
                  primary="Horario"
                  secondary={`${days[tutoring.day]} ${format(
                    tutoring.startTime,
                    "p"
                  )} - ${format(tutoring.endingTime, "p")}`}
                  secondaryTypographyProps={{ align: "left" }}
                />
              </ListItem>
              <ListItem
                button={belongs()}
                divider
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "5pt",
                  marginBottom: "10pt",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
                onClick={() => belongs() && setShowStudents(true)}
              >
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#B3949040" }}>
                    <StudentsIcon style={{ color: "#B39490" }} />
                  </Avatar>
                </ListItemAvatar>
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ marginRight: "7pt" }}
                />
                <ListItemText
                  primary={belongs() ? "Ver estudiantes" : "Estudiantes"}
                  secondary={`${tutoring.students.length}/15`}
                  secondaryTypographyProps={{ align: "left" }}
                />
              </ListItem>
              <ListItem
                divider
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "5pt",
                  marginBottom: "10pt",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#fb86bb40" }}>
                    <FontAwesomeIcon
                      icon={faChalkboard}
                      style={{ color: "#fb86bb" }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ marginRight: "7pt" }}
                />
                <ListItemText
                  primary="Aula"
                  secondary={tutoring.classRoom}
                  secondaryTypographyProps={{ align: "left" }}
                />
              </ListItem>
              {belongs() ? (
                <div>
                  <ListItem
                    divider
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "5pt",
                      marginBottom: "10pt",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: "#25d36640" }}>
                        <LogoWhatsapp color="#25d366" />
                      </Avatar>
                    </ListItemAvatar>
                    <Divider
                      orientation="vertical"
                      flexItem
                      style={{ marginRight: "7pt" }}
                    />
                    <ListItemText
                      primary="Link del Grupo"
                      secondary={
                        tutoring.groupLink ? (
                          <a
                            // TODO: Asegurarme de ponerle el https luego al guardar en firebase
                            href={tutoring.groupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {tutoring.groupLink}
                          </a>
                        ) : (
                          "Ninguno"
                        )
                      }
                      secondaryTypographyProps={{ align: "left" }}
                    />
                  </ListItem>
                  <ListItem
                    divider
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "5pt",
                      marginBottom: "10pt",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar style={{ backgroundColor: "#d3485a40" }}>
                        <ContactIcon style={{ color: "#d3485a" }} />
                      </Avatar>
                    </ListItemAvatar>
                    <Divider
                      orientation="vertical"
                      flexItem
                      style={{ marginRight: "7pt" }}
                    />
                    <ListItemText
                      primary="Contactar al tutor"
                      secondary={
                        tutoring.tutor.phone
                          ? `${tutoring.tutor.phone} / ${tutoring.tutor.email}`
                          : `${tutoring.tutor.email}`
                      }
                      secondaryTypographyProps={{ align: "left" }}
                    />
                  </ListItem>
                  <Button
                    variant="contained"
                    fullWidth
                    color="secondary"
                    onClick={leave}
                  >
                    Abandonar Tutoría
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={join}
                  >
                    Unirse
                  </Button>
                </div>
              )}
            </List>
            <Dialog
              open={showStudents}
              onClose={() => setShowStudents(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Estudiantes</DialogTitle>
              <DialogContent>
                {tutoring.students.map((student) => (
                  <DialogContentText key={student.name}>
                    {student.name}
                  </DialogContentText>
                ))}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutoringDetail;
