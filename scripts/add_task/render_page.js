function initAddTaskPage() {
  renderDesktopTemplate();
  renderAddTaskContent();
}

function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = getDesktopTemplate();
}

function renderAddTaskContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getAddTaskContent();
}
