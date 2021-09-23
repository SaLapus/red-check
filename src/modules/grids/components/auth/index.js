import "./auth.css";

export default (state) => {
  const user = state.user.name;

  const userNameText = document.createElement("div");
  userNameText.setAttribute("id", "AuthUserName");

  if (!user) {
    const formDiv = document.createElement("div");
    formDiv.setAttribute("id", "Auth");

    const authLabel = document.createElement("label");
    authLabel.innerText = "Вход:";
    authLabel.setAttribute("for", "AuthInput");

    const authInput = document.createElement("input");
    authInput.setAttribute("type", "text");
    authInput.setAttribute("id", "AuthInput");
    authInput.setAttribute("list", "AuthList");

    const authOptions = document.createElement("datalist");
    authOptions.setAttribute("id", "AuthList");

    const nicknames = [...state.data.keys()]
      .map((name) => {
        return { name, key: name.toLowerCase() };
      })
      .sort((a, b) => (a.key > b.key ? 1 : -1))
      .map((k) => k.name);

    for (const name of nicknames) {
      const option = document.createElement("option");
      option.value = name;

      authOptions.append(option);
    }

    authInput.addEventListener("keydown", (event) => {
      if (event.code === "Enter") {
        state.user.name = event.target.value;

        formDiv.remove();

        userNameText.innerText = state.user.name;
        const infoPlace = document.getElementById("infoPlace");
        infoPlace.append(userNameText);
      }
    });

    formDiv.append(authLabel, authInput, authOptions);

    const infoPlace = document.getElementById("infoPlace");
    infoPlace.append(formDiv);

    authInput.focus();
  } else {
    userNameText.innerText = user;
    const infoPlace = document.getElementById("infoPlace");
    infoPlace.append(userNameText);
  }
};
