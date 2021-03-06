import "./comment.css";

export default (state) => {
  const parentId = state.currentView.id;
  const user = state.user.name;
  const comments =
    parentId === "main"
      ? state.comments.reds
      : parentId === "projects"
      ? state.comments.projects
      : (() => {
          throw new Error("Invalid View");
        })();

  const commentInput = document.createElement("textarea");

  commentInput.setAttribute("id", parentId + "Comment");
  commentInput.classList.add("Comment");

  if (!user) {
    commentInput.setAttribute("placeholder", "Зайдите, чтобы оставлять комментарии");
    commentInput.setAttribute("readonly", true);

    state.user.onNameSetted.set("commentComp", (bool) => {
      if (!bool) return;

      commentInput.setAttribute("placeholder", "Добавьте комментарий <3");
      commentInput.removeAttribute("readonly");

      state.user.onNameSetted.delete("commentComp");
    });
  } else commentInput.setAttribute("placeholder", "Добавьте комментарий <3");

  let timeout;

  commentInput.addEventListener("input", (event) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(
      () => comments.set(event.target.getAttribute("data-key"), event.target.value),
      800
    );
  });

  const parent = document.getElementById(parentId);
  parent.append(commentInput);
};
