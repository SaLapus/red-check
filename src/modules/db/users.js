import { getAuth, signInAnonymously, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default (app) => {
  const auth = getAuth(app);
  // connectAuthEmulator(auth, "http://localhost:9099");

  const db = getFirestore(app);
  // connectFirestoreEmulator(db, "localhost", 8080);

  const collRef = collection(db, "users");

  return async () => {
    const { user } = await signInAnonymously(auth);

    const q = query(collRef, where("uid", "==", user.uid));
    const docs = await getDocs(q);

    let loginState = undefined;

    if (docs.empty) {
      loginState = [
        undefined,
        async (nickname) => {
          addDoc(collRef, {
            name: nickname,
            uid: user.uid,
          });
          loginState = [nickname, undefined];
        },
      ];
    } else {
      if (docs.size === 1) {
        let name = "";
        docs.forEach((doc) => (name = doc.get("name")));
        loginState = [name, undefined];
      } else console.error("MORE THEN 1 EDITOR. WTF. CALL SALAPUS.");
    }

    return () => loginState;
  };
};
