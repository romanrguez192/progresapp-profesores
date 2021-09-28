import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useUser } from "../contexts/UserContext";
import { getStudents } from "../firebase/functions";
import { useParams, useHistory } from "react-router-dom";
import { LinearProgress, Divider } from "@material-ui/core";
import { degreeName } from "../utils/degrees";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import { toggleIsTutor } from "../firebase/functions";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useUser();
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = getStudents((students) => {
      const improvedStudents = improveData(students);
      setStudents(improvedStudents);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const improveData = (students) => {
    return students.map((student) => {
      const newStudent = { ...student };
      newStudent.degree = degreeName(newStudent.degree);

      return newStudent;
    });
  };

  const columns = [
    {
      title: "Nombre completo",
      field: "name",
    },
    {
      title: "Cédula",
      field: "idDocument",
    },
    {
      title: "Teléfono",
      field: "phone",
    },
    {
      title: "Carrera",
      field: "degree",
    },
  ];

  const changeIsTutor = (student) => {
    toggleIsTutor(student);
  };

  return (
    <div className="cBackgroundTutoringDetail">
      <div className="pTitlesTutoring">
        <p className="nTutoring" style={{ color: "#3c3b3e" }}>
          Lista de Estudiantes
        </p>
      </div>
      <div className="cInfoTutoring">
        <Divider style={{ marginBottom: "10pt" }} />
      </div>
      {loading ? (
        <LinearProgress color="secondary" />
      ) : (
        <div className="table-container">
          <MaterialTable
            columns={columns}
            data={students}
            title="Estudiantes"
            options={{
              search: true,
              headerStyle: { fontWeight: "bold" },
              pageSizeOptions: [10, 20, 30, 40, 50],
              pageSize: 10,
              emptyRowsWhenPaging: false,
              actionsColumnIndex: -1,
            }}
            localization={{
              header: { actions: "Tutor" },
              toolbar: { searchPlaceholder: "Buscar", searchTooltip: "Buscar" },
              body: {
                emptyDataSourceMessage: "No hay estudiantes que mostrar",
              },
              pagination: {
                firstTooltip: "Ir al principio",
                nextTooltip: "Siguiente página",
                previousTooltip: "Página anterior",
                lastTooltip: "Ir al final",
                labelDisplayedRows: "{from} - {to} de {count}",
                labelRowsSelect: "estudiantes",
                labelRowsPerPage: "Estudiantes por página:",
              },
            }}
            actions={[
              {
                xd: "LAL",
              },
            ]}
            components={{
              Action: (props) => (
                <Tooltip title={props.data.isTutor ? "Desasignar como tutor" : "Asignar como tutor"}>
                  <Switch checked={props.data.isTutor} onChange={() => changeIsTutor(props.data)} />
                </Tooltip>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
