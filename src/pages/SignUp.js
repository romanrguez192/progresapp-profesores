import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import logo from "../assets/logo.svg";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import "./SignUp.css";
import { professorSignUp } from "../firebase/functions";
import { Link } from "react-router-dom";
import { degrees } from "../degrees";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

// Pantalla de registro
const SignUp = () => {
  // Estado inicial
  const initialData = {
    name: "",
    idDocument: "",
    email: "",
    phone: "",
    degree: "",
    password: "",
    confirm: "",
  };

  // States
  const [user, setUser] = useState(initialData);
  const [errorMessages, setErrorMessages] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Función del Snackbar
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setConnectionError(false);
  };

  // Función llamada al cambiar el texto del input
  const handleChangeText = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  // Función para cambiar visibilidad de la contraseña
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Función del icono de de visibilidad
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  // Función de registro del estudiante al clickear el botón
  const signUp = async () => {
    const errorMessages = { ...initialData };

    // Borra los espacios al inicio y al final
    for (const property in user) {
      if (property !== "password" && property !== "confirm") {
        user[property] = user[property].trim();
      }
    }

    // Maneja los errores de inputs vacíos
    if (user.name === "") {
      errorMessages.name = "Ingresa tu nombre y apellido";
    }
    if (user.idDocument === "") {
      errorMessages.idDocument = "Ingresa tu cédula, por favor";
    }
    if (user.email === "") {
      errorMessages.email = "Ingresa tu correo, por favor";
    }
    if (user.degree === "") {
      errorMessages.degree = "Ingresa tu carrera, por favor";
    }
    if (user.password === "") {
      errorMessages.password =
        "Ingresa una contraseña de al menos 6 caracteres, por favor";
    }
    if (user.confirm === "") {
      errorMessages.confirm = "Repite tu contraseña, por favor";
    }

    // Verifica que todo input requerido esté lleno
    for (const property in user) {
      if (user[property] === "" && property !== "phone") {
        setErrorMessages(errorMessages);
        return;
      }
    }

    // Verifica que las contraseñas coincidan
    if (user.password !== user.confirm) {
      errorMessages.confirm =
        "Las contraseñas no coinciden, vuelve a intentarlo";
      setErrorMessages(errorMessages);
      return;
    }

    // Intenta registrar al usuario
    try {
      setLoading(true);
      await professorSignUp(user);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        errorMessages.email =
          "Ingresa una dirección de correo electrónico válida";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessages.email =
          "Ya existe un usuario con esta dirección de correo, intenta nuevamente";
      } else if (error.code === "auth/weak-password") {
        errorMessages.password =
          "Ingresa una contraseña de al menos 6 caracteres, por favor";
      } else {
        setConnectionError(true);
      }
      setErrorMessages(errorMessages);
      setLoading(false);
    }
  };

  return (
    /*Fondo del registro*/
    <div className="cBackgroundSignUp">
      {/* Header */}
      <div className="cSignUp">
        {/* Header */}
        <div className="cHeader">
          {/* Logo */}
          <div className="iLogo">
            <img src={logo} alt="logo" />
          </div>
          {/* Regístrate */}
          <div className="hSignUp">
            <h1>Regístrate en ProgresApp</h1>
          </div>
        </div>
        <div className="cTextFields">
          <div className="cNameAndId">
            {/* TextField del nombre */}
            <div className="tfName">
              <TextField
                fullWidth
                label="Nombre y Apellido"
                variant="outlined"
                required
                error={errorMessages.name !== ""}
                helperText={errorMessages.name}
                onChange={(e) => handleChangeText("name", e.target.value)}
              ></TextField>
            </div>
            {/* TextField de la cédula */}
            <div className="tfId">
              <TextField
                fullWidth
                label="Cédula"
                placeholder="Ej: 28.270.835"
                variant="outlined"
                required
                error={errorMessages.idDocument !== ""}
                helperText={errorMessages.idDocument}
                onChange={(e) => handleChangeText("idDocument", e.target.value)}
              ></TextField>
            </div>
          </div>
          {/* TextField del teléfono TODO: Ver si se puede mejorar*/}
          <div className="tfInfo">
            <TextField
              fullWidth
              label="Teléfono"
              placeholder="Ej: 0412-9216791"
              variant="outlined"
              error={errorMessages.phone !== ""}
              helperText={errorMessages.phone}
              onChange={(e) => handleChangeText("phone", e.target.value)}
            ></TextField>
          </div>
          {/* TextField de la carrera */}
          <div className="tfInfo">
            <TextField
              fullWidth
              select
              label="Carrera"
              variant="outlined"
              required
              error={errorMessages.degree !== ""}
              helperText={errorMessages.degree}
              onChange={(e) => handleChangeText("degree", e.target.value)}
              value={user.degree}
            >
              {degrees.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {/* TextField del correo */}
          <div className="tfInfo">
            <TextField
              fullWidth
              label="Correo"
              variant="outlined"
              type="email"
              required
              error={errorMessages.email !== ""}
              helperText={errorMessages.email}
              onChange={(e) => handleChangeText("email", e.target.value)}
            ></TextField>
          </div>
          {/* TextField de la contraseña */}
          <div className="tfInfo">
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              required
              error={errorMessages.password !== ""}
              helperText={errorMessages.password}
              onChange={(e) => handleChangeText("password", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </div>
          {/* TextField de repetir contraseña */}
          <div className="tfInfo">
            <TextField
              fullWidth
              label="Repetir Contraseña"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              required
              error={errorMessages.confirm !== ""}
              helperText={errorMessages.confirm}
              onChange={(e) => handleChangeText("confirm", e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            ></TextField>
          </div>
        </div>
        {/* Boton para registrarse */}
        <div className="bSignUp">
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={signUp}
          >
            Registrarse
          </Button>
        </div>
        {/* Botón que redirige al Login */}
        <div className="clLogin">
          <Link to="/login" className="lLogin">
            ¿Tienes una cuenta? ¡Inicia sesión aquí!
          </Link>
        </div>
        <Backdrop style={{ zIndex: 1, color: "#fff" }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={connectionError}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message="Error de conexión"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnack}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </div>
    </div>
  );
};

export default SignUp;
