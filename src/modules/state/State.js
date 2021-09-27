import receiveData from "../ntl";

import { Comments, Users, Trace } from "../firebase";

import getMainGridOptions from "../grids/main";
import getProjectsGridOptions from "../grids/projects";
import getPersonGridOptions from "../grids/person";

import Components from "../grids/components";

class State {
  user = { onNameSetted: new Map() };
  /**@type {RedsData} */
  data = {
    reds: undefined,
    projects: undefined,
  };
  comments = {
    reds: undefined,
    projects: undefined,
  };
  context = {
    filters: {
      date: {
        _option: 5,
        get option() {
          return this._option;
        },
        set option(o) {
          this._option = parseInt(o);

          [...this.onChange.values()].filter((cb) => !!cb).forEach((cb) => cb(o));
        },

        onChange: new Map(),
      },
    },
  };

  views = new Map([
    [
      "main",
      {
        id: "main",
        getGrid: () => {
          return getMainGridOptions(this);
        },
        components: [
          Components.Export,
          Components.RedsProjects,
          Components.Auth,

          Components.Comment,
        ],
      },
    ],
    [
      "projects",
      {
        id: "projects",
        getGrid: () => {
          return getProjectsGridOptions(this);
        },
        components: [
          Components.Export,
          Components.RedsProjects,
          Components.Auth,

          Components.Comment,
        ],
      },
    ],
    [
      "person",
      {
        id: "person",
        getGrid: ({ nickname }) => {
          const person = this.data.reds.get(nickname);
          return getPersonGridOptions(nickname, person, this);
        },
        components: [Components.Export, Components.Return, Components.Auth],
      },
    ],
  ]);

  _currentView = {
    id: "",
    prevIds: [],
    grid: undefined,
    components: [],
    clear() {
      const infoDiv = document.getElementById("infoPlace");
      let view = undefined;

      if (this.id) view = document.getElementById(this.id);

      if (infoDiv)
        for (let i = infoDiv.children.length - 1; i >= 0; i--)
          infoDiv.children.item(i).remove();

      if (view) view.remove();
    },
  };
  get currentView() {
    return this._currentView;
  }
  set currentView({ viewId, initData }) {
    let view = this.views.get(viewId);

    if (!view) view = this.views.get("main");

    Object.assign(this._currentView, {
      id: view.id,
      prevIds: this._currentView.prevIds.concat([this._currentView.id]),
      grid: view.getGrid(initData),
      components: view.components,
    });
  }

  /**
   * @param {RedsData} reds
   */
  constructor({ reds, projects }, login, comments) {
    this.data = { reds, projects };
    this.comments = comments;

    this.user = {
      get name() {
        const [user] = login();
        return user;
      },
      set name(nickname) {
        const [, setName] = login();
        if (setName && nickname) {
          setName(nickname);

          [...this.onNameSetted.values()].filter((cb) => !!cb).forEach((cb) => cb(true));
        }
      },
      onNameSetted: new Map(),
    };
  }

  render() {
    const workspace = document.getElementById("workspace");

    const viewDiv = document.createElement("div");
    viewDiv.setAttribute("id", this.currentView.id);

    const gridDiv = document.createElement("div");
    gridDiv.setAttribute("id", this.currentView.id + "Grid");
    gridDiv.classList.add("ag-theme-alpine");

    viewDiv.append(gridDiv);
    workspace.append(viewDiv);

    this.currentView.components.forEach((cb) => cb(this));

    const gridOptions = this.currentView.grid;

    // eslint-disable-next-line no-undef
    new agGrid.Grid(gridDiv, gridOptions);
  }

  changeView(viewId, initData) {
    this.currentView.clear();
    this.currentView = { viewId, initData };

    this.render();
  }

  saveToCSV() {
    const gridOptions = this.currentView.grid;

    const selected = gridOptions.api.getSelectedNodes();

    gridOptions.api.exportDataAsCsv({ onlySelected: selected.length > 0 });
  }
}

export default async () => {
  const traceNTLRequests = Trace("NTL_API");
  const traceLogin = Trace("Login");
  const traceComments = Trace("Comments First Load");

  traceNTLRequests.start();
  const data = await receiveData();
  traceNTLRequests.stop();

  traceLogin.start();
  const login = await Users();
  traceLogin.stop();

  traceComments.start();
  const comments = await Comments(login);
  traceComments.stop();

  const state = new State(data, login, comments);

  return state;
};
