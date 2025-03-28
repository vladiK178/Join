let currentSubTaskEdit = {};


/** Opens the edit zoom section for a given task. */
function openEditSectionZoom(taskId) {
  closeTaskZoomSection(); // Closes the regular zoom if open
  showEditZoomSectionUI();
  const taskKey = findTaskKeyByIdZoom(taskId);
  if (taskKey) currentSubTaskEdit = { ...currentUser.tasks[taskKey].subtasks };
  renderEditSectionZoom(taskId);
  addEnterListenerToSubtaskEdit();
}


/** Shows the edit zoom section and hides body overflow. */
function showEditZoomSectionUI() {
  document.getElementById("taskZoomSectionEdit").classList.remove("d-none");
  document.getElementById("body").classList.add("overflow-hidden");
}


/** Closes the edit zoom section and restores body overflow. */
function closeTaskZoomEditSectionZoom() {
  document.getElementById("taskZoomSectionEdit").classList.add("d-none");
  document.getElementById("body").classList.remove("overflow-hidden");
}


/** Saves changes to a task and updates Firebase/UI. */
async function saveTaskChangesZoom(taskKey) {
  if (!validateTitleAndDate()) return;
  if (!validateAssignedContacts(taskKey)) return;
  let priority = getCurrentEditPriority();
  updateTaskDataInMemory(taskKey, priority);
  try {
    await updateTaskInFirebase(currentUser.id, taskKey, currentUser.tasks[taskKey]);
    reRenderBoardColumns();
    closeTaskZoomEditSectionZoom();
  } catch (err) {
    console.error("Error saving task changes:", err);
    alert("An error occurred while saving the task. Please try again.");
  }
}


/** Re-renders columns after a task is updated. */
function reRenderBoardColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}


/** Renders the list of subtasks in the edit zoom view. */
function renderSubtasksEditZoom() {
  let sec = document.getElementById("subtaskSectionEdit");
  sec.innerHTML = "";
  Object.entries(currentSubTaskEdit || {}).forEach(([id, st]) => {
    sec.innerHTML += getSubtaskEditHtml(id, st);
  });
}


/** Returns HTML for a single subtask in edit mode. */
function getSubtaskEditHtml(id, st) {
  return `
    <div id="taskBulletPoint${id}" class="task-bullet-point">
      <li>${st.subTaskDescription}</li>
      <div id="edit-trash-section" class="edit-trash-section">
        <img onclick="editSubtaskZoom('${id}')" src="./assets/img/subtaskPen.svg" alt="">
        <div class="seperator-edit-trash"></div>
        <img onclick="deleteSubtaskZoom('${id}')" src="./assets/img/trashImg.svg" alt="">
      </div>
    </div>`;
}


/** Adds subtask on Enter key. */
function addEnterListenerToSubtaskEdit() {
  let input = document.getElementById("subtaskEdit");
  if (!input) return;
  input.addEventListener("keydown", evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      addSubtaskEditZoom();
    }
  });
}


/** Adds a new subtask to the local edit object. */
function addSubtaskEditZoom() {
  let input = document.getElementById("subtaskEdit");
  if (!input.value.trim()) return console.warn("Subtask input is empty.");
  let id = `subtask_${Date.now()}`;
  currentSubTaskEdit[id] = { subTaskDescription: input.value, checked: false };
  input.value = "";
  renderSubtasksEditZoom();
}


/** Deletes a subtask from the local edit object. */
function deleteSubtaskZoom(subtaskId) {
  delete currentSubTaskEdit[subtaskId];
  renderSubtasksEditZoom();
}


/** Switches a subtask into edit mode (input field). */
function editSubtaskZoom(id) {
  let bp = document.getElementById(`taskBulletPoint${id}`);
  bp.classList.remove("task-bullet-point");
  bp.innerHTML = getSubtaskZoomEditHtml(id, currentSubTaskEdit[id].subTaskDescription);
}


/** Returns HTML for a subtask in edit mode (input). */
function getSubtaskZoomEditHtml(id, description) {
  return `
    <div class="subtask-edit-point-section">
      <div class="subtask-edit-point">
        <input id="editedTask${id}" class="subtask-input-edit" value="${description}" type="text">
        <div class="subtask-edit-icons">
          <img class="edit-trash-icon" src="./assets/img/trashImg.svg" alt="" onclick="deleteSubtaskZoom('${id}')">
          <div class="subtaskSeparator"></div>
          <img class="edit-check-icon" src="./assets/img/checkBlack.svg" alt="" onclick="saveSubtaskZoom('${id}')">
        </div>
      </div>
    </div>`;
}


/** Saves the edited subtask description. */
function saveSubtaskZoom(id) {
  let input = document.getElementById(`editedTask${id}`);
  if (!input) return;
  currentSubTaskEdit[id].subTaskDescription = input.value;
  renderSubtasksEditZoom();
}


/** Shows the input field/icons for adding a subtask. */
function showInputSubtaskSectionEditZoom() {
  let iconSec = document.getElementById("subtaskIconSectionEdit");
  iconSec.classList.remove("add-subtask-img");
  iconSec.innerHTML = `
    <div class="show-subtask-input-icons">
      <div onclick="closeInputSubtaskSectionEditZoom(event)" class="subtask-close-container">
        <img class="subtask-close-icon" src="./assets/img/close.svg" alt="Close">
      </div>
      <div class="subtaskSeparator"></div>
      <div onclick="addSubtaskEditZoom()" class="subtask-check-container">
        <img class="subtask-check-icon" src="./assets/img/checkBlack.svg" alt="Check">
      </div>
    </div>`;
}


/** Resets the subtask input field to the original UI. */
function closeInputSubtaskSectionEditZoom(evt) {
  let iconSec = document.getElementById("subtaskIconSectionEdit");
  iconSec.innerHTML = `<img src="./assets/img/addCross.svg" alt="">`;
  iconSec.classList.add("add-subtask-img");
  evt.stopPropagation();
}


/** Renders both the dropdown and chosen circles for assigned contacts. */
function renderAssignedToSectionEditZoom(taskKey) {
  let task = currentUser.tasks[taskKey];
  let ddSec = document.getElementById("dropDownSectionEdit");
  let chosenSec = document.getElementById("choosenNamesSectionEdit");
  ddSec.innerHTML = "";
  chosenSec.innerHTML = "";

  const map = {};
  Object.entries(currentUser.contacts || {}).forEach(([k, c]) => {
    if (!map[k]) map[k] = getRandomColorFromPalette();
    renderContactInDropdown(task, k, c, map[k], ddSec);
    if (isContactAssigned(task, c)) renderContactCircle(k, c, map[k], chosenSec);
  });
}


/** Renders a single contact into the "Assigned To" dropdown. */
function renderContactInDropdown(task, key, contact, color, container) {
  let assigned = isContactAssigned(task, contact) ? "checked-assigned-to" : "assigned-to-name";
  let checkedAttr = isContactAssigned(task, contact) ? "checked" : "";
  container.innerHTML += `
    <div onclick="toggleAssignedToEditZoom('${task.id}','${key}','${color}')"
         id="assignedToNameEdit${key}" class="${assigned}">
      <div class="name-section">
        <div class="name-circle-add-section" style="background-color: ${color}">
          <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
        </div>
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
      </div>
      <input class="custom-checkbox" id="assignedToCheckboxEdit${key}" type="checkbox"
             ${checkedAttr} style="pointer-events: none;">
    </div>`;
}


/** Renders a circle in the chosen names section. */
function renderContactCircle(key, contact, color, container) {
  container.innerHTML += `
    <div id="chosenNameEdit${key}" class="name-circle-add-section" style="background-color: ${color}">
      <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
    </div>`;
}


/** Checks if a contact is assigned to the given task. */
function isContactAssigned(task, contact) {
  return task.assignedTo && Object.values(task.assignedTo).some(
    a => a.firstName === contact.firstNameContact && a.lastName === contact.lastNameContact
  );
}


/** Toggles a contact's assignment for a given task. */
function toggleAssignedToEditZoom(taskId, key, color) {
  let taskKey = findTaskKeyByIdZoom(taskId);
  if (!taskKey) return;
  let t = currentUser.tasks[taskKey];
  let box = document.getElementById(`assignedToCheckboxEdit${key}`);
  let div = document.getElementById(`assignedToNameEdit${key}`);
  let chosenSec = document.getElementById("choosenNamesSectionEdit");

  box.checked = !box.checked;
  if (box.checked) assignContact(t, key, color, div, chosenSec);
  else unassignContact(t, key, div);
}


/** Assigns a contact to a task and updates the UI. */
function assignContact(task, key, color, div, chosenSec) {
  div.classList.replace("assigned-to-name", "checked-assigned-to");
  if (!task.assignedTo) task.assignedTo = {};
  task.assignedTo[`contact_${key}`] = {
    firstName: currentUser.contacts[key].firstNameContact,
    lastName: currentUser.contacts[key].lastNameContact
  };
  if (!document.getElementById(`chosenNameEdit${key}`)) {
    chosenSec.innerHTML += `
      <div id="chosenNameEdit${key}" class="name-circle-add-section" style="background-color: ${color}">
        <span>${currentUser.contacts[key].firstNameContact.charAt(0)}${currentUser.contacts[key].lastNameContact.charAt(0)}</span>
      </div>`;
  }
}


/** Unassigns a contact from a task and updates the UI. */
function unassignContact(task, key, div) {
  div.classList.replace("checked-assigned-to", "assigned-to-name");
  delete task.assignedTo[`contact_${key}`];
  let chosen = document.getElementById(`chosenNameEdit${key}`);
  if (chosen) chosen.remove();
}


/** Opens/closes the category dropdown in edit zoom. */
function openAndCloseCategorySectionEditZoom() {
  let sec = document.getElementById("categoryDropDownSectionEdit");
  let img = document.getElementById("dropDownImgCategoryEdit");
  sec.classList.toggle("d-none");
  img.src = img.src.includes("dropDownArrowDown")
    ? "assets/img/dropDownArrowUp.svg"
    : "assets/img/dropDownArrowDown.svg";
}


/** Sets the category to "Technical Task" and closes dropdown. */
function choseTechnicalTaskEditZoom() {
  setCategoryAndClose("Technical Task");
}


/** Sets the category to "User Story" and closes dropdown. */
function choseUserStoryEditZoom() {
  setCategoryAndClose("User Story");
}


/** Updates #selectTaskCategorySpanEdit and closes dropdown. */
function setCategoryAndClose(categoryName) {
  document.getElementById("selectTaskCategorySpanEdit").innerHTML = categoryName;
  document.getElementById("categoryDropDownSectionEdit").classList.add("d-none");
  document.getElementById("dropDownImgCategoryEdit").src = "assets/img/dropDownArrowDown.svg";
}


/** Sets priority to "Urgent" in edit zoom UI. */
function pressUrgentButtonEditZoom() {
  resetEditPriorities();
  document.getElementById("prioUrgentEdit").classList.add("prio-urgent-chosen");
  document.getElementById("urgent-button-icon-edit").src = "./assets/img/urgentArrowWhite.svg";
}


/** Sets priority to "Medium" in edit zoom UI. */
function pressMediumButtonEditZoom() {
  resetEditPriorities();
  document.getElementById("prioMediumEdit").classList.add("prio-medium-chosen");
  document.getElementById("medium-button-icon-edit").src = "./assets/img/mediumLinesWhite.svg";
}


/** Sets priority to "Low" in edit zoom UI. */
function pressLowButtonEditZoom() {
  resetEditPriorities();
  document.getElementById("prioLowEdit").classList.add("prio-low-chosen");
  document.getElementById("low-button-icon-edit").src = "./assets/img/lowArrowGreenWhite.svg";
}


/** Resets priority button UI to default in edit zoom. */
function resetEditPriorities() {
  let u = document.getElementById("prioUrgentEdit");
  let m = document.getElementById("prioMediumEdit");
  let l = document.getElementById("prioLowEdit");
  u.classList.remove("prio-urgent-chosen");
  u.classList.add("prio-urgent");
  m.classList.remove("prio-medium-chosen");
  m.classList.add("prio-medium");
  l.classList.remove("prio-low-chosen");
  l.classList.add("prio-low");
  document.getElementById("urgent-button-icon-edit").src = "./assets/img/urgentArrowRed.svg";
  document.getElementById("medium-button-icon-edit").src = "./assets/img/mediumLinesOrange.svg";
  document.getElementById("low-button-icon-edit").src = "./assets/img/lowArrowGreeen.svg";
}


/** Finds the task key by matching the provided task ID. */
function findTaskKeyByIdZoom(taskId) {
  return Object.keys(currentUser.tasks || {}).find(
    key => currentUser.tasks[key].id === taskId
  );
}


/** Renders the edit section zoom UI for a given task. */
function renderEditSectionZoom(taskId) {
  const tKey = findTaskKeyByIdZoom(taskId);
  if (!tKey) return console.error(`Task with ID "${taskId}" not found.`);
  let task = currentUser.tasks[tKey];
  document.getElementById("taskZoomSectionEdit").innerHTML = getEditZoomSection(task, tKey);
  renderAssignedToSectionEditZoom(tKey);
  renderNameCirclesEditZoom(tKey);
  renderSubtasksEditZoom(); 
}


/** Renders assigned name circles for the given task in edit zoom. */
function renderNameCirclesEditZoom(taskKey) {
  let sec = document.getElementById("choosenNamesSectionEdit");
  sec.innerHTML = "";
  let t = currentUser.tasks[taskKey];
  Object.entries(t.assignedTo || {}).forEach(([k, c]) => {
    let color = getOrAssignColorForTask(t.id, k);
    let initials = `${c.firstName[0]}${c.lastName[0]}`;
    sec.innerHTML += `
      <div class="name-circle-add-section" style="background-color: ${color}">
        <span>${initials}</span>
      </div>`;
  });
}


/** Opens/closes the "Assigned To" dropdown in edit zoom. */
function openAndCloseAssignedToSectionEditZoom() {
  let ddSec = document.getElementById("dropDownSectionEdit");
  let ddImg = document.getElementById("dropDownImgEdit");
  ddSec.classList.toggle("d-none");
  ddImg.src = ddImg.src.includes("dropDownArrowDown")
    ? "assets/img/dropDownArrowUp.svg"
    : "assets/img/dropDownArrowDown.svg";
}


/** Toggles showing a single chosen name circle (not heavily used in current UI). */
function choseNameAndShowCircleEditZoom() {
  let box = document.getElementById("assignedToCheckboxEdit");
  document.getElementById("chosenNameEdit").classList.toggle("d-none", !box.checked);
}
