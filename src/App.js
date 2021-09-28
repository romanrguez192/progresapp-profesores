import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { unstable_createMuiStrictModeTheme as createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./pages/Login.css";
import "./pages/Home.css";
import "./pages/MyTutorings.css";
import "./pages/SignUp.css";
import "./pages/TablesPage.css";
import "./pages/TutoringDetail.css";
import "./pages/Tutorings.css";
import "./components/CreateTutoring.css";
import "./components/NavBar.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Tutorings from "./pages/Tutorings";
import TutoringDetail from "./pages/TutoringDetail";
import { UserProvider } from "./contexts/UserContext";
import CustomRoute from "./components/CustomRoute";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import TablesPage from "./pages/TablesPage";
import StudentsPage from "./pages/StudentsPage";

//Tema
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },

  palette: {
    //Moradito clarito
    primary: {
      main: "#475694",
    },
    //Rojosado
    secondary: {
      main: "#d3485a",
    },
    //Rosado
    tertiary: {
      main: "#fb86bb",
    },
    //Cremita
    quaternary: {
      main: "#ffe4d4",
    },
    //Morado oscuro
    quinary: {
      main: "#232b4a",
    },
    //Marron claro
    sextarian: {
      main: "#b39490",
    },
    //Mostaza
    septenary: {
      main: "#fca976",
    },
    //negro
    octonary: {
      main: "#3c3b3e",
    },
  },
});

function App() {
  return (
    <div>
      {/* Tema */}
      <ThemeProvider theme={theme}>
        <UserProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Router>
              <Switch>
                {/* Página principal */}
                <CustomRoute exact path="/" auth={true}>
                  <NavBar />
                  <Home />
                </CustomRoute>
                {/* Página de información */}
                <CustomRoute path="/about" auth>
                  <NavBar />
                  <About />
                </CustomRoute>
                {/* Página de lista de tutorías */}
                <CustomRoute exact path="/tutorias" auth={true}>
                  <NavBar />
                  <Tutorings />
                </CustomRoute>
                {/* Detalle de tutoría */}
                <CustomRoute path="/tutorias/:id" auth={true}>
                  <NavBar />
                  <TutoringDetail />
                </CustomRoute>
                {/* Pagina de la asistencia */}
                <CustomRoute path="/asistencia/:id" auth={true}>
                  <NavBar />
                  <TablesPage />
                </CustomRoute>
                {/* Pagina de estudiantes */}
                <CustomRoute path="/estudiantes" auth={true}>
                  <NavBar />
                  <StudentsPage />
                </CustomRoute>
                {/* Página de registro */}
                <CustomRoute path="/signup" auth={false}>
                  <SignUp />
                </CustomRoute>
                {/* Página de inicio de sesión */}
                <CustomRoute path="/login" auth={false}>
                  <Login />
                </CustomRoute>
              </Switch>
            </Router>
          </MuiPickersUtilsProvider>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
