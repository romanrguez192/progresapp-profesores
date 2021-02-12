import React, { useState } from "react";
import titlepc from "../assets/title-loginpc.svg";
import "./Login.css";
import {
  TextField,
  Button,
  InputAdornment,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { professorLogin } from "../firebase/functions";
import { Link } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// Página de Inicio de Sesión
const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const [user, setUser] = useState(initialState);
  const [errorMessages, setErrorMessages] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

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

  // Función del Snackbar
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setConnectionError(false);
  };

  // Función que inicia sesión al clickear el botón
  const login = async () => {
    const errorMessages = { ...initialState };

    if (user.email.trim() === "") {
      errorMessages.email = "Ingresa tu correo, por favor";
    }
    if (user.password === "") {
      errorMessages.password = "Ingresa tu contraseña, por favor";
    }

    // Verifica que los input estén llenos
    if (user.email.trim() === "" || user.password === "") {
      setErrorMessages(errorMessages);
      return;
    }

    // Inicia sesión
    try {
      setLoading(true);
      await professorLogin(user.email.trim(), user.password);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        errorMessages.email = "Ingresa una dirección de correo válida";
      } else if (error.code === "auth/user-not-found") {
        errorMessages.email =
          "No hay usuarios con este correo, intenta de nuevo";
      } else if (error.code === "auth/wrong-password") {
        errorMessages.password = "Contraseña incorrecta, intenta nuevamente";
      } else {
        setConnectionError(true);
      }

      setErrorMessages(errorMessages);
      setLoading(false);
    }
  };

  return (
    /* Contenedor del fondo */
    <div className="cBackgroundLogin">
      {/* Contenedor del login */}
      <div className="cLogin">
        {/* Logo */}
        <div className="cHeader">
          <img className="imgLogo" src={titlepc} alt="logo" />
        </div>
        {/* Inputs */}
        <div className="cInputs">
          {/* TextField del correo */}
          <div className="tfMail">
            <TextField
              fullWidth
              label="Correo"
              variant="outlined"
              type="email"
              error={errorMessages.email !== ""}
              helperText={errorMessages.email}
              onChange={(e) => handleChangeText("email", e.target.value)}
            ></TextField>
          </div>
          {/* TextField de la contraseña */}
          <div className="tfPassword">
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type={showPassword ? "text" : "password"}
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
        </div>
        {/* Boton para ingresar */}
        <div className="bLogin">
          <Button variant="contained" fullWidth color="primary" onClick={login}>
            Ingresar
          </Button>
        </div>
        {/* Botón que redirige al SignUp */}
        <div className="clSignUp">
          <Link to="/signup" className="lSignUp">
            ¿No tienes cuenta? ¡Regístrate aquí!
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

export default Login;
