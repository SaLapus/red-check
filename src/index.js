import "./index.css";

import getState from "./js/state/State";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const gif = document.getElementById("loading");
    const workspace = document.getElementById("workspace");

    const state = await getState();

    document
      .getElementById("saveCSV")
      .addEventListener("click", state.saveToCSV.bind(state));
    document
      .getElementById("returnBtn")
      .addEventListener("click", state.toMainView.bind(state));

    gif.remove();
    workspace.setAttribute("style", "height: 100%; width: 100%");

    state.toMainView();
  } catch (e) {
    console.log(e);
  }
});
