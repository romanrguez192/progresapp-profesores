import React from "react";
import Divider from "@material-ui/core/Divider";

const About = () => {
  return (
    <div className="cHomeBackground">
      <div className="cTitleHome">
        <h1>ProgresApp Profesores</h1>
        <p style={{ color: "#3c3b3e", fontSize: "20pt" }}>Tutorías UCAB</p>
      </div>
      {/* Línea divisora */}
      <div className="divHomeTutorings">
        <Divider />
      </div>
      <div className="cHomeMssg">
        <p>Aplicación Web desarrollada por Román Rodríguez, José Saad, Mónica Cuaulma y Miguelanggelo Sumoza</p>
      </div>
    </div>
  );
};

export default About;
