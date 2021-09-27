import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import reds from "./reds";
import projects from "./projects";

export default (app) => {
  const db = getFirestore(app);
  // connectFirestoreEmulator(db, "localhost", 8888);

  const redsConnect = reds(db);
  const projectsConnect = projects(db);

  return async (login) => {
    return {
      reds: await redsConnect(login),
      projects: await projectsConnect(login),
    };
  };
};
