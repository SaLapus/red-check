// import { GoogleSpreadsheet } from "google-spreadsheet";

import receiveData from "./RedsData.js";
import getMainGridOptions from "../main/TableInfo";
import getPersonGridOptions from "../person/TableInfo";

// import creds from "../../red-check-table-376b7fe348fd.json";

class State {
  _currentView = {
    view: "",
    id: "",
    grid: undefined,
  };
  get currentView() {
    return this._currentView;
  }
  set currentView(view) {
    switch (view) {
      case "main":
        this._currentView = {
          view: "main",
          id: this.mainView.id,
          grid: this.mainView.grid,
        };
        break;
      case "person":
        this._currentView = {
          view: "person",
          id: this.personView.id,
          grid: this.personView.grid,
        };
        break;
      default:
        this._currentView = {
          view: "main",
          id: this.mainView.id,
          grid: this.mainView.grid,
        };
    }
  }

  /**@type {RedsData} */
  data = undefined;

  mainView = {
    id: "mainGrid",
    _grid: undefined,
    state: undefined,
  };

  personView = {
    id: "personalGrid",
    _grid: undefined,
    state: undefined,
  };

  /**
   * @param {RedsData} reds
   */
  constructor(reds) {
    this.data = reds;

    this.mainView.state = this;
    this.personView.state = this;

    Object.defineProperty(this.mainView, "grid", {
      get() {
        if (!this._grid) this._grid = getMainGridOptions(this.state);
        return this._grid;
      },
    });

    Object.defineProperty(this.personView, "grid", {
      get() {
        return this._grid;
      },
      set({person: nickname, context}) {
        const person = this.state.data.get(nickname);
        this._grid = getPersonGridOptions(nickname, person, context);
      },
    });
  }

  render() {
    const gridDiv = document.getElementById(this.currentView.id);
    const gridOptions = this.currentView.grid;

    // eslint-disable-next-line no-undef
    new agGrid.Grid(gridDiv, gridOptions);
  }

  toMainView() {
    const prevView = this.currentView.view;
    this.currentView = "main";

    if (!prevView) this.render();

    const mainDiv = document.getElementById(this.mainView.id);
    const personDiv = document.getElementById(this.personView.id);
    const returnBtn = document.getElementById("returnBtn");

    returnBtn.setAttribute("style", "display: none;");
    if (personDiv) personDiv.remove();
    mainDiv.removeAttribute("style");
  }

  toPersonView(person, context) {
    this.personView.grid = {person, context};
    this.currentView = "person";

    // We need to recreate table div every time we need to render new table
    const personDiv = document.createElement("div");
    personDiv.id = this.personView.id;
    personDiv.classList.add("ag-theme-alpine");

    const workspace = document.getElementById("workspace");

    const mainDiv = document.getElementById(this.mainView.id);
    const returnBtn = document.getElementById("returnBtn");

    returnBtn.removeAttribute("style");
    mainDiv.setAttribute("style", "display: none;");
    workspace.appendChild(personDiv);

    this.render();
  }

  saveToCSV() {
    const gridOptions = this.currentView.grid;

    const selected = gridOptions.api.getSelectedNodes();

    gridOptions.api.exportDataAsCsv({ onlySelected: selected.length > 0 });
  }

  // saveToSpreadSheet() {
  //   const doc = new GoogleSpreadsheet("1JjvMgNAcnVv4OQknnEdZKmhmZKMC9rRlX1KihPgioDY");

  //   await doc.useServiceAccountAuth({
  //     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  //     private_key: process.env.GOOGLE_PRIVATE_KEY,
  //   });

  //   await doc.loadInfo(); // loads document properties and worksheets

  //   const sheet = doc.sheetsByIndex[0];
  //   sheet.addRow;
  // }
}

export default async () => {
  return new State(await receiveData());
};
