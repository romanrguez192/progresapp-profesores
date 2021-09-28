import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { getTutoringById, updateTutoring } from "../firebase/functions";
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
  DialogActions,
  DialogContentText,
  Divider,
  Avatar,
  ListItemAvatar,
} from "@material-ui/core";
import ScheduleIcon from "@material-ui/icons/QueryBuilderOutlined";
import { degrees } from "../utils/degrees";
import { useParams, useHistory, Link } from "react-router-dom";
import { format } from "date-fns";
import StudentsIcon from "@material-ui/icons/PersonOutlined";
import { faChalkboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogoWhatsapp } from "react-ionicons";
import ContactIcon from "@material-ui/icons/MailOutline";
import EditIcon from "@material-ui/icons/Edit";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { KeyboardTimePicker } from "@material-ui/pickers";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Juéves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const otherDays = [
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

const TutoringDetail = () => {
  const [tutoring, setTutoring] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeClassRoom, setChangeClassRoom] = useState(false);
  const [changeGroupLink, setChangeGroupLink] = useState(false);
  const [changeTime, setChangeTime] = useState(false);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [classRoom, setClassRoom] = useState("");
  const [groupLink, setGroupLink] = useState("");

  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = getTutoringById(params.id, (tutoring) => {
      setTutoring(tutoring);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const update = async (data) => {
    try {
      await updateTutoring(tutoring, data);
      setChangeClassRoom(false);
      setChangeGroupLink(false);
      setChangeTime(false);
    } catch (error) {
      console.log(error);
    }
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
                button
                divider
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "5pt",
                  marginBottom: "10pt",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
                component={Link}
                to={"/asistencia/" + tutoring.id}
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
                  primary="Asistencia"
                  secondary={`Estudiantes ${tutoring.students.length}/15`}
                  secondaryTypographyProps={{ align: "left" }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => history.push("/asistencia/" + tutoring.id)}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </ListItemSecondaryAction>
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
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => setChangeTime(true)}>
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
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
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => setChangeClassRoom(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
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
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => setChangeGroupLink(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Dialog
              open={changeTime}
              onClose={() => {
                setChangeTime(false);
                setDay("");
              }}
            >
              <DialogTitle>Cambiar Horario de Tutoría</DialogTitle>
              <DialogContent>
                <div className="cInputCreate">
                  <TextField
                    fullWidth
                    select
                    label="Día de la Semana"
                    onChange={(e) => setDay(e.target.value)}
                    value={day}
                  >
                    {otherDays.map((option) => (
                      <MenuItem key={option.number} value={option.number}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="cInputCreate">
                  <KeyboardTimePicker
                    fullWidth
                    label="Hora de Inicio"
                    value={startTime}
                    onChange={(value) => setStartTime(value)}
                    invalidDateMessage="Formato de fecha inválida"
                    cancelLabel="Cancelar"
                    keyboardIcon={<AccessTimeIcon />}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setChangeTime(false);
                    setDay("");
                  }}
                  color="primary"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  disabled={day === "" || startTime == "Invalid Date"}
                  onClick={() => update({ startTime, day })}
                >
                  Actualizar
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={changeClassRoom}
              onClose={() => {
                setChangeClassRoom(false);
                setClassRoom("");
              }}
            >
              <DialogTitle>Cambiar Aula de Tutoría</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  label="Salón"
                  placeholder="Ej: AR-22 o Virtual"
                  fullWidth
                  onChange={(e) => setClassRoom(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setChangeClassRoom(false);
                    setClassRoom("");
                  }}
                  color="primary"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  disabled={classRoom === ""}
                  onClick={() => update({ classRoom })}
                >
                  Actualizar
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={changeGroupLink}
              onClose={() => {
                setChangeGroupLink(false);
                setGroupLink("");
              }}
            >
              <DialogTitle>Cambiar Enlace de Grupo</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  label="Enlace de Grupo (WhatsApp)"
                  placeholder="Ej: https://chat.whatsapp.com/GIZ0lkQBlHGI2s9w0WJBC2"
                  fullWidth
                  onChange={(e) => setGroupLink(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setChangeGroupLink(false);
                    setGroupLink("");
                  }}
                  color="primary"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  disabled={groupLink === ""}
                  onClick={() => update({ groupLink })}
                >
                  Actualizar
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutoringDetail;
