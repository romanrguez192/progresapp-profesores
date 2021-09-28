import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";

const UserContext = React.createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wrongProgresApp, setWrongProgresApp] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const userDoc = await db.collection("professors").doc(user.uid).get();

          if (!userDoc.exists) {
            setWrongProgresApp(true);
            auth.signOut();
            return;
          }

          const userData = userDoc.data();
          setUser(userData);
        } catch (error) {
          console.log(error.message);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función del Snackbar
  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setWrongProgresApp(false);
  };

  return (
    <UserContext.Provider value={user}>
      {!loading && children}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={wrongProgresApp}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message="Estás intentando acceder con una cuenta de estudiante"
        action={
          <a style={{ textDecoration: "none" }} href="https://progresapp.web.app/">
            <Button color="secondary" size="small">
              Ir a ProgresApp Estudiantes
            </Button>
          </a>
        }
      />
    </UserContext.Provider>
  );
};
