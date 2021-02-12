import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import "./TablesPage.css";
import { useUser } from "../contexts/UserContext";
import { getTutoringById } from "../firebase/functions";
import { useParams, useHistory } from "react-router-dom";
import { LinearProgress, Divider } from "@material-ui/core";
import { degreeName } from "../degrees";
import { updateTutoring } from "../firebase/functions";

const TablesPage = () => {
  const [tutoring, setTutoring] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useUser();
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = getTutoringById(params.id, (tutoring) => {
      const students = improveData(tutoring.students);
      setStudents(students);
      setTutoring(tutoring);
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
    {
      title: "Asistencias",
      field: "attendances",
    },
  ];

  const increment = async (uid) => {
    tutoring.students.forEach((student) => {
      if (student.uid === uid) {
        student.attendances++;
      }
    });

    await updateTutoring(tutoring.id, { students: tutoring.students });
  };

  const decrement = async (uid) => {
    tutoring.students.forEach((student) => {
      if (student.uid === uid && student.attendances > 0) {
        student.attendances--;
      }
    });

    await updateTutoring(tutoring.id, { students: tutoring.students });
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
      <div className="pTitlesTutoring">
        <p className="nTutoring" style={{ color: "#3c3b3e" }}>
          {tutoring.name}
        </p>
      </div>
      <div className="cInfoTutoring">
        <Divider style={{ marginBottom: "10pt" }} />
      </div>
      <div className="table-container">
        <MaterialTable
          columns={columns}
          data={students}
          title="Estudiantes"
          options={{
            searchFieldStyle: { display: "none" },
            headerStyle: { fontWeight: "bold" },
            pageSizeOptions: [],
            emptyRowsWhenPaging: false,
            pageSize: 15,
            actionsColumnIndex: -1,
          }}
          localization={{
            header: { actions: "Control de asistencia" },
            body: { emptyDataSourceMessage: "No hay estudiantes inscritos" },
          }}
          actions={[
            {
              icon: AddIcon,
              tooltip: "Incrementar asistencia",
              onClick: (event, rowData) => increment(rowData.uid),
            },
            {
              icon: RemoveIcon,
              tooltip: "Disminuir asistencia",
              onClick: (event, rowData) => decrement(rowData.uid),
            },
          ]}
          components={{
            Pagination: () => null,
          }}
        />
      </div>
    </div>
  );
};

export default TablesPage;
