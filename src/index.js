import "./index.css";

import getState from "./modules/state/State";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("START");
  try {
    const gif = document.getElementById("loading");
    const workspace = document.getElementById("workspace");

    const state = await getState();

    gif.remove();
    workspace.setAttribute("style", "height: 100%; width: 100%");

    state.changeView("main");
  } catch (e) {
    console.log(e);
  }
});
