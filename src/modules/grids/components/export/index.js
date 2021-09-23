import "./export.css";

export default (state) => {
  const exportButton = document.createElement("button");

  exportButton.setAttribute("id", "exportCSV");
  exportButton.innerText = "Сохранить";

  exportButton.addEventListener("click", state.saveToCSV.bind(state));

  const infoPlace = document.getElementById("infoPlace");
  infoPlace.append(exportButton);
};
