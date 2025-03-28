/** Creates a new subtask from input field. */
function addSubtask() {
  let input = document.getElementById('subtask');
  if (input.value.length === 0) return console.log("ERROR: Subtask is empty");

  const subtaskId = `subtask_${Date.now()}`;
  currentSubTask[subtaskId] = {
    subTaskDescription: input.value,
    checked: false,
  };

  // quick fix to avoid weird focus issues
  input.value = "";
  input.disabled = true;
  input.disabled = false;

  renderSubtasks();
  closeInputSubtaskSection(event);
}


/** Deletes a subtask by its key. */
function deleteSubTasks(key) {
  if (!currentSubTask[key]) {
    return console.error(`Subtask with ID ${key} does not exist`);
  }
  delete currentSubTask[key];
  renderSubtasks();
}


/** Saves the edited subtask. */
function saveSubtask(key) {
  let edited = document.getElementById(`editedTask${key}`);
  if (!edited || !currentSubTask[key]) {
    return console.error(`Subtask with ID ${key} does not exist or no input found`);
  }
  currentSubTask[key].subTaskDescription = edited.value;
  renderSubtasks();
}


/** Switches the selected subtask into edit mode. */
function subtaskEdit(key) {
  if (!currentSubTask[key]) {
    return console.error(`No subtask with ID ${key}`);
  }
  let bp = document.getElementById(`taskBulletPoint${key}`);
  bp.classList.remove('task-bullet-point');
  bp.innerHTML = `
    <div class="subtask-edit-point-section">
      <div class="subtask-edit-point">
        <input id="editedTask${key}" class="subtask-input-edit"
          value="${currentSubTask[key].subTaskDescription}" type="text">
        <div class="subtask-edit-icons">
          <img class="edit-trash-icon" src="./assets/img/trashImg.svg"
            alt="" onclick="deleteSubTasks('${key}')">
          <div class="subtaskSeparator"></div>
          <img class="edit-check-icon" src="./assets/img/checkBlack.svg"
            alt="" onclick="saveSubtask('${key}')">
        </div>
      </div>
    </div>`;
}


/** Shows the subtask input section and changes icons. */
function showInputSubtaskSection(evt) {
  // Stop event bubbling so it doesn't conflict with other clicks
  evt.stopPropagation();

  let iconSec = document.getElementById('subtaskIconSection');
  let subSec = document.getElementById('subtaskSectionInput');
  subSec.classList.add('blue-border');
  iconSec.classList.remove('add-subtask-img');
  
  // Replace the icon area with the close + check icons
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


/** Closes the subtask input section. */
function closeInputSubtaskSection(evt) {
  evt.stopPropagation();

  let iconSec = document.getElementById('subtaskIconSection');
  let subSec = document.getElementById('subtaskSectionInput');
  let input = document.getElementById('subtask');

  subSec.classList.remove('blue-border');
  iconSec.innerHTML = `
    <div onclick="showInputSubtaskSection(event)" id="subtaskIconSection" class="add-subtask-img">
      <img src="./assets/img/addCross.svg" alt="">
    </div>`;
  
  input.value = "";
}
