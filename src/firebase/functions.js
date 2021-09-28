import { auth, db, storage } from "./config";
import { subjectDegrees, subjectName } from "../utils/degrees";
import { add } from "date-fns";

// Inicio de sesión de profesores con correo y contraseña
export const professorLogin = (email, password) => {
  const promise = auth.signInWithEmailAndPassword(email, password);
  return promise;
};

// Cerrar Sesión
export const signOut = () => {
  auth.signOut();
};

// Registro de profesores
export const professorSignUp = async (user) => {
  const response = await auth.createUserWithEmailAndPassword(user.email, user.password);

  const uid = response.user.uid;

  const data = {
    uid,
    name: user.name,
    idDocument: user.idDocument,
    email: user.email,
    phone: user.phone,
  };

  const promise = db.collection("professors").doc(uid).set(data);
  return promise;
};

// Subir archivo al storage
export const uploadFile = async (file, path) => {
  const fileRef = storage.ref().child(path);

  await fileRef.put(file);
  const url = await fileRef.getDownloadURL();
  return url;
};

// Obtener las tutorías de un estudiante dado su uid
export const getStudentTutorings = (uid, func) => {
  return db
    .collection("tutorings")
    .where("studentsIDs", "array-contains", uid)
    .onSnapshot((snapshot) => {
      const tutorings = snapshot.docs.map((doc) => {
        const tutoring = doc.data();
        tutoring.id = doc.id;
        tutoring.startTime = new Date(tutoring.startTime * 1000);
        tutoring.endingTime = add(tutoring.startTime, { hours: 2 });
        return tutoring;
      });
      func(tutorings);
    });
};

// Obtener todas las tutorías de una carrera determinada
export const getTutoringsByDegree = (degree, func) => {
  return db
    .collection("tutorings")
    .where("degrees", "array-contains", degree)
    .onSnapshot((snapshot) => {
      const tutorings = snapshot.docs.map((doc) => {
        const tutoring = doc.data();
        tutoring.id = doc.id;
        tutoring.startTime = new Date(tutoring.startTime * 1000);
        tutoring.endingTime = add(tutoring.startTime, { hours: 2 });
        return tutoring;
      });
      func(tutorings);
    });
};

// Obtener los detalles de una tutoría
export const getTutoringById = (id, func) => {
  return db
    .collection("tutorings")
    .doc(id)
    .onSnapshot((tutoringDoc) => {
      if (!tutoringDoc.exists) {
        return null;
      }
      const tutoring = tutoringDoc.data();
      tutoring.id = tutoringDoc.id;
      tutoring.startTime = new Date(tutoring.startTime * 1000);
      tutoring.endingTime = add(tutoring.startTime, { hours: 2 });
      func(tutoring);
    });
};

// Crear una tutoría nueva
export const createTutoring = (tutor, tutoring) => {
  const data = {
    name: subjectName(tutoring.subjectID),
    tutor: {
      id: tutor.uid,
      name: tutor.name,
      phone: tutor.phone,
      email: tutor.email,
    },
    subjectID: tutoring.subjectID,
    degrees: subjectDegrees(tutoring.subjectID),
    classRoom: tutoring.classRoom,
    groupLink: tutoring.groupLink,
    studentsIDs: [],
    students: [],
    day: tutoring.day,
    startTime: tutoring.startTime,
  };

  const promise = db.collection("tutorings").add(data);
  return promise;
};

// Unirsea una tutoría
export const joinTutoring = async (tutoring, user) => {
  const promise = db
    .collection("tutorings")
    .doc(tutoring.id)
    .update({
      studentsIDs: [...tutoring.studentsIDs, user.uid],
      students: [...tutoring.students, { ...user, attendances: 0 }],
    });

  return promise;
};

// Obtener todas las tutorías de un tutor
export const getTutorTutorings = (tutorID, func) => {
  return db
    .collection("tutorings")
    .where("tutor.id", "==", tutorID)
    .onSnapshot((snapshot) => {
      const tutorings = snapshot.docs.map((doc) => {
        const tutoring = doc.data();
        tutoring.id = doc.id;
        tutoring.startTime = new Date(tutoring.startTime * 1000);
        tutoring.endingTime = add(tutoring.startTime, { hours: 2 });
        return tutoring;
      });
      func(tutorings);
    });
};

// Actualizar los datos de una tutoría
export const updateTutoring = async (tutoring, newData) => {
  await db.collection("tutorings").doc(tutoring.id).update(newData);

  const notification = {
    title: "Cambio en tutoría",
    message: `Un profesor modificó tu tutoría de ${tutoring.name}`,
    date: new Date(),
    read: false,
  };

  await db.collection("students").doc(tutoring.tutor.id).collection("notifications").add(notification);
};

// Obtener los notificaciones
export const getNotifications = (userID, func) => {
  return db
    .collection("professors")
    .doc(userID)
    .collection("notifications")
    .orderBy("date", "desc")
    .onSnapshot((snapshot) => {
      const notifications = snapshot.docs.map((doc) => {
        const notification = doc.data();
        notification.id = doc.id;
        return notification;
      });
      func(notifications);
    });
};

export const markAsRead = async (userID) => {
  const notifications = await db.collection("professors").doc(userID).collection("notifications").get();

  notifications.forEach((doc) => {
    db.collection("professors").doc(userID).collection("notifications").doc(doc.id).update({ read: true });
  });
};

// Obtener todos los estudiantes
export const getStudents = (func) => {
  return db.collection("students").onSnapshot((snapshot) => {
    const students = snapshot.docs.map((doc) => {
      const student = doc.data();
      return student;
    });

    func(students);
  });
};

export const toggleIsTutor = async (student) => {
  const isTutor = !student.isTutor;

  await db.collection("students").doc(student.uid).update({ isTutor });

  const notification = {
    title: isTutor ? "Eres tutor" : "Ya no eres tutor",
    message: isTutor ? "Fuiste asignado como tutor" : "Fuiste desasignado como tutor",
    date: new Date(),
    read: false,
  };

  await db.collection("students").doc(student.uid).collection("notifications").add(notification);
};
