import "./reds_projects.css";

export default (state) => {
  const returnButton = document.createElement("button");

  returnButton.setAttribute("id", "RedsAndProjects");

  let text = "";
  let nextView = "";

  switch (state.currentView.id) {
    case "main":
      text = "К проектам";
      nextView = "projects";
      break;
    case "projects":
      text = "К редакторам";
      nextView = "main";
      break;
    default:
      throw new Error("Invalid View");
  }
  returnButton.innerText = text;
  returnButton.addEventListener("click", () => {
    state.changeView(nextView);
  });

  const infoPlace = document.getElementById("infoPlace");
  infoPlace.append(returnButton);
};
