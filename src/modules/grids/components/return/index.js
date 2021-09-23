import "./return.css";

export default (state) => {
  const returnButton = document.createElement("button");

  returnButton.setAttribute("id", "returnToPrev");
  returnButton.innerText = "Вернуться";
  returnButton.addEventListener("click", () => {
    const { view, initData } = state.currentView.prevIds.pop();
    state.changeView(view, initData);
  });

  const infoPlace = document.getElementById("infoPlace");
  infoPlace.append(returnButton);
};
