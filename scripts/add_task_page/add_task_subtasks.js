function addSubtask() {
  const input = document.getElementById("subtask");
  const value = input.value.trim();
  if (!value) return console.log("ERROR: Subtask is empty");

  const id = `subtask_${Date.now()}`;
  currentSubTask[id] = { subTaskDescription: value, checked: false };

  input.value = "";
  input.disabled = true;
  input.disabled = false;

  renderSubtasks();
  closeInputSubtaskSection(event);
}

function deleteSubTasks(key) {
  if (!currentSubTask[key])
    return console.error(`Subtask mit ID ${key} existiert nicht`);
  delete currentSubTask[key];
  renderSubtasks();
}

function saveSubtask(key) {
  const edited = document.getElementById(`editedTask${key}`);
  const currentSubtaskContainer = document.getElementById(
    `taskBulletPoint${key}`
  );
  if (!edited || !currentSubTask[key])
    return console.error(`Subtask ${key} nicht gefunden`);

  const value = edited.value.trim();

  if (value.length < 2) {
    deleteSubTasks(key);
    return;
  }

  currentSubTask[key].subTaskDescription = value;
  renderSubtasks();
}

function subtaskEdit(key) {
  const task = currentSubTask[key];
  if (!task) return console.error(`Subtask ${key} nicht vorhanden`);

  const container = document.getElementById(`taskBulletPoint${key}`);
  container.classList.remove("task-bullet-point");
  container.innerHTML = `
    <div class="subtask-edit-point-section">
      <div class="subtask-edit-point">
        <input id="editedTask${key}" class="subtask-input-edit" value="${task.subTaskDescription}" type="text">
        <div class="subtask-edit-icons">
          <img class="edit-trash-icon" src="./assets/img/trashImg.svg" alt="" onclick="deleteSubTasks('${key}')">
          <div class="subtaskSeparator"></div>
          <img class="edit-check-icon" src="./assets/img/checkBlack.svg" alt="" onclick="saveSubtask('${key}')">
        </div>
      </div>
    </div>`;
}

function showInputSubtaskSection(evt) {
  evt.stopPropagation();

  const iconSec = document.getElementById("subtaskIconSection");
  const subSec = document.getElementById("subtaskSectionInput");

  subSec.classList.add("blue-border");
  iconSec.classList.remove("add-subtask-img");
  iconSec.innerHTML = `
    <div class="show-subtask-input-icons">
      <div onclick="closeInputSubtaskSection(event)" class="subtask-close-container">
        <img class="subtask-close-icon" src="./assets/img/close.svg" alt="Close">
      </div>
      <div class="subtaskSeparator"></div>
      <div onclick="addSubtask()" class="subtask-check-container">
        <img class="subtask-check-icon" src="./assets/img/checkBlack.svg" alt="Check">
      </div>
    </div>`;
}

function closeInputSubtaskSection(evt) {
  evt.stopPropagation();

  const iconSec = document.getElementById("subtaskIconSection");
  const subSec = document.getElementById("subtaskSectionInput");
  const input = document.getElementById("subtask");

  subSec.classList.remove("blue-border");
  iconSec.innerHTML = `
    <div onclick="showInputSubtaskSection(event)" id="subtaskIconSection" class="add-subtask-img">
      <img src="./assets/img/addCross.svg" alt="">
    </div>`;

  input.value = "";
}
