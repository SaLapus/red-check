import {
  collection,
  Timestamp,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

/**
 * @type Map<string, string>
 */
const data = new Map();

const DataWrapper = {
  _onChangeCallbacks: new Map(),

  get(project) {
    return data.get(project);
  },
  set(project, text) {
    const prevText = data.get(project);

    if (prevText === text) return;

    if (text) data.set(project, text);
    else data.delete(project);

    this._onChangeCallbacks.forEach((cb) =>
      cb(this.getAll(), { project, text: { prev: prevText, cur: text } })
    );
  },
  reset(newData) {
    data.clear();
    for (const [name, text] of newData) data.set(name, text);

    this._onChangeCallbacks.forEach((cb, key) => {
      if (key !== "sync") cb(this.getAll());
    });
  },

  getAll() {
    return data;
  },

  setOnChange(id, callback) {
    this._onChangeCallbacks.set(id, callback);
  },
  removeOnChange(id) {
    this._onChangeCallbacks.delete(id);
  },
};

export default (db) => {
  const collRef = collection(db, "comments_projects");

  const DataBase = {
    getUser: undefined,

    initDB: async (getUserName) => {
      DataBase.getUser = getUserName;

      const docs = await getDocs(collRef);

      docs.forEach((doc) => {
        const { name, text } = doc.data();
        data.set(name, text);
      });
    },
    /**
     * @param {Map<string, string>} data
     * @param { {nickname: string, text: {prev: string, cur: string}} } update
     */
    pushToDB: async (data, { project, text: { prev, cur } }) => {
      const [user] = DataBase.getUser();
      if (!user) return;

      const q = query(collRef, where("name", "==", project));
      const docs = await getDocs(q);

      if (!prev && cur && docs.empty) {
        await addDoc(collRef, {
          name: project,
          text: cur,
          create: {
            user,
            at: Timestamp.fromDate(new Date()),
          },
          change: {
            user: "",
            at: Timestamp.fromDate(new Date()),
          },
        });
        return;
      }

      if (prev && cur) {
        if (docs.size > 1) console.error("MORE THEN 1 PROJECT. WTF. CALL SALAPUS.");
        else if (docs.size === 0) console.error("NO PROJECT. WTF. CALL SALAPUS.");
        else if (docs.size === 1) {
          docs.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              text: cur,
              change: {
                user,
                at: Timestamp.fromDate(new Date()),
              },
            });
          });
          return;
        }
      }

      if (prev && !cur) {
        if (docs.size > 1) console.error("MORE THEN 1 PROJECT. WTF. CALL SALAPUS.");
        else if (docs.size === 0) console.error("NO PROJECT. WTF. CALL SALAPUS.");
        else if (docs.size === 1) {
          docs.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
          return;
        }
      }
    },

    startSync: () => {
      onSnapshot(collRef, {
        next: (docs) => {
          const data = [];
          docs.forEach((doc) => {
            const { name: project, text } = doc.data();
            data.push([project, text]);
          });

          DataWrapper.reset(data);
        },
        error: (error) => console.log(`${error.name}: ${error.message}`),
      });
    },
  };

  return async (getUserName) => {
    await DataBase.initDB(getUserName);
    DataWrapper.setOnChange("sync", DataBase.pushToDB);
    DataBase.startSync();

    return DataWrapper;
  };
};
