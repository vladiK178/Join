/**
 * Adds a new subtask if the input field is not empty.
 * Generates a unique ID and renders the updated subtask list.
 */
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

/**
 * Deletes a subtask by its key if it exists.
 * @param {string} key - The ID of the subtask.
 */
function deleteSubTasks(key) {
  if (!currentSubTask[key])
    return console.error(`Subtask with ID ${key} does not exist`);
  delete currentSubTask[key];
  renderSubtasks();
}

/**
 * Saves the edited subtask. Deletes it if the new text is too short.
 * @param {string} key - The ID of the subtask.
 */
function saveSubtask(key) {
  const edited = document.getElementById(`editedTask${key}`);
  if (!edited || !currentSubTask[key])
    return console.error(`Subtask ${key} not found`);

  const value = edited.value.trim();
  if (value.length < 2) return deleteSubTasks(key);

  currentSubTask[key].subTaskDescription = value;
  renderSubtasks();
}

/**
 * Opens the input field to edit an existing subtask.
 * @param {string} key - The ID of the subtask.
 */
function subtaskEdit(key) {
  const task = currentSubTask[key];
  if (!task) return console.error(`Subtask ${key} not found`);

  const container = document.getElementById(`taskBulletPoint${key}`);
  container.classList.remove("task-bullet-point");
  container.innerHTML = subtaskEditTemplate(key, task);
}

/**
 * Returns the HTML template for the editable subtask field.
 * @param {string} key - The ID of the subtask.
 * @param {Object} task - The subtask object with description and status.
 * @returns {string} - The HTML string for the editable subtask.
 */
function subtaskEditTemplate(key, task) {
  return `
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

/**
 * Shows the input section for adding a new subtask.
 * @param {MouseEvent} evt - The click event.
 */
function showInputSubtaskSection(evt) {
  evt.stopPropagation();

  const iconSec = document.getElementById("subtaskIconSection");
  const subSec = document.getElementById("subtaskSectionInput");

  subSec.classList.add("blue-border");
  iconSec.classList.remove("add-subtask-img");
  iconSec.innerHTML = showInputTemplate();
}

/**
 * Returns the HTML template for the visible subtask input section.
 * @returns {string} - The HTML string for the input section.
 */
function showInputTemplate() {
  return `
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

/**
 * Closes the subtask input section and resets the input field.
 * @param {MouseEvent} evt - The click event.
 */
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
