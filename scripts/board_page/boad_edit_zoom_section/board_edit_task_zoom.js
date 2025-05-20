// Storage for subtasks being edited
let currentSubTaskEdit = {};

/**
 * Opens task edit interface
 * @param {string} taskId - Task to edit
 */
function openEditSectionZoom(taskId) {
  closeTaskZoomSection();
  document.getElementById("taskZoomSectionEdit").classList.remove("d-none");
  document.getElementById("body").classList.add("overflow-hidden");
  
  const taskKey = findTaskKey(taskId);
  if (taskKey) currentSubTaskEdit = { ...currentUser.tasks[taskKey].subtasks };
  
  renderEditSectionZoom(taskId);
  setupEnterKeyListener();
}

/**
 * Closes edit interface
 */
function closeTaskZoomEditSectionZoom() {
  document.getElementById("taskZoomSectionEdit").classList.add("d-none");
  document.getElementById("body").classList.remove("overflow-hidden");
}

/**
 * Saves task changes
 * @param {string} taskKey - Task key
 */
async function saveTaskChangesZoom(taskKey) {
  if (!validateTitleAndDate() || !validateAssignedContacts(taskKey)) return;
  
  let priority = getCurrentEditPriority();
  updateTaskDataInMemory(taskKey, priority);
  
  try {
    await updateTaskInFirebase(currentUser.id, taskKey, currentUser.tasks[taskKey]);
    refreshColumns();
    closeTaskZoomEditSectionZoom();
    showToastMessage("Edited task");
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save changes. Please try again.");
  }
}

/**
 * Refreshes all columns
 */
function refreshColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}

/**
 * Renders subtasks list
 */
function renderSubtasksEditZoom() {
  let container = document.getElementById("subtaskSectionEdit");
  container.innerHTML = "";
  
  Object.entries(currentSubTaskEdit || {}).forEach(([id, st]) => {
    container.innerHTML += subtaskEditZoomTemplate(id, st);
  });
}

function subtaskEditZoomTemplate(id, st) {
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

/**
 * Sets up Enter key for adding subtasks
 */
function setupEnterKeyListener() {
  let input = document.getElementById("subtaskEdit");
  if (!input) return;
  
  input.addEventListener("keydown", evt => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      addSubtaskEditZoom();
    }
  });
}

/**
 * Adds a new subtask
 */
function addSubtaskEditZoom() {
  let input = document.getElementById("subtaskEdit");
  if (!input.value.trim()) return;
  
  let id = `subtask_${Date.now()}`;
  currentSubTaskEdit[id] = { subTaskDescription: input.value, checked: false };
  input.value = "";
  renderSubtasksEditZoom();
}

/**
 * Removes a subtask
 * @param {string} subtaskId - Subtask ID
 */
function deleteSubtaskZoom(subtaskId) {
  delete currentSubTaskEdit[subtaskId];
  renderSubtasksEditZoom();
}

/**
 * Switches subtask to edit mode
 * @param {string} id - Subtask ID
 */
function editSubtaskZoom(id) {
  let bulletPoint = document.getElementById(`taskBulletPoint${id}`);
  bulletPoint.classList.remove("task-bullet-point");
  bulletPoint.innerHTML = editSubtaskZoomTemplate(id, currentSubTaskEdit);
}

function editSubtaskZoomTemplate(id, currentSubTaskEdit) {
  return `
    <div class="subtask-edit-point-section">
      <div class="subtask-edit-point">
        <input id="editedTask${id}" class="subtask-input-edit" value="${currentSubTaskEdit[id].subTaskDescription}" type="text">
        <div class="subtask-edit-icons">
          <img class="edit-trash-icon" src="./assets/img/trashImg.svg" alt="" onclick="deleteSubtaskZoom('${id}')">
          <div class="subtaskSeparator"></div>
          <img class="edit-check-icon" src="./assets/img/checkBlack.svg" alt="" onclick="saveSubtaskZoom('${id}')">
        </div>
      </div>
    </div>`;
}

/**
 * Saves edited subtask
 * @param {string} id - Subtask ID
 */
function saveSubtaskZoom(id) {
  let input = document.getElementById(`editedTask${id}`);
  if (!input) return;
  
  currentSubTaskEdit[id].subTaskDescription = input.value;
  renderSubtasksEditZoom();
}

/**
 * Shows subtask input field
 */
function showInputSubtaskSectionEditZoom() {
  let iconSection = document.getElementById("subtaskIconSectionEdit");
  iconSection.classList.remove("add-subtask-img");
  iconSection.innerHTML = showInputSubtaskSectionEditZoomTemplate();
}

function showInputSubtaskSectionEditZoomTemplate() {
  return `
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

/**
 * Hides subtask input field
 * @param {Event} evt - Event object
 */
function closeInputSubtaskSectionEditZoom(evt) {
  let iconSection = document.getElementById("subtaskIconSectionEdit");
  iconSection.innerHTML = `<img src="./assets/img/addCross.svg" alt="">`;
  iconSection.classList.add("add-subtask-img");
  evt.stopPropagation();
}

function shortenName(name) {
  return name.length > 15 ? name.slice(0, 12) + "..." : name;
}

/**
 * Rendert die Zuweisungssektion (Dropdown + ausgewählte Kontakte) im Edit-Zoom.
 * @param {string} taskKey - Schlüssel der zu bearbeitenden Aufgabe
 */
function renderAssignedToSectionEditZoom(taskKey) {
  const task = currentUser.tasks[taskKey];
  const dropdownSection = document.getElementById("dropDownSectionEdit");
  const chosenSection = document.getElementById("choosenNamesSectionEdit");
  dropdownSection.innerHTML = "";
  chosenSection.innerHTML = "";

  renderAssignedContactsEditZoom(task, dropdownSection, chosenSection);
}

/**
 * Rendert alle Kontakte im Dropdown und zeigt die Auswahl an, falls zugewiesen.
 * @param {Object} task - Die aktuelle Aufgabe
 * @param {HTMLElement} dropdownSection - DOM-Element für das Dropdown
 * @param {HTMLElement} chosenSection - DOM-Element für die ausgewählten Namen
 */
function renderAssignedContactsEditZoom(task, dropdownSection, chosenSection) {
  const colorMap = {};

  Object.entries(currentUser.contacts || {}).forEach(([key, contact]) => {
    if (!colorMap[key]) colorMap[key] = getRandomColorFromPalette();

    const isAssigned = isContactAssigned(task, contact);
    renderContactDropdownEntry(task, key, contact, colorMap[key], isAssigned, dropdownSection);

    if (isAssigned) {
      renderAssignedCircleEditZoom(key, contact, colorMap[key], chosenSection);
    }
  });
}

/**
 * Fügt einen Kontakt dem Dropdown hinzu.
 * @param {Object} task - Die aktuelle Aufgabe
 * @param {string} key - Schlüssel des Kontakts
 * @param {Object} contact - Kontaktdaten
 * @param {string} color - Farbcodierung für Kontaktkreis
 * @param {boolean} isAssigned - Ob der Kontakt zugewiesen ist
 * @param {HTMLElement} container - DOM-Container für das Dropdown
 */
function renderContactDropdownEntry(task, key, contact, color, isAssigned, container) {
  const className = isAssigned ? "checked-assigned-to" : "assigned-to-name";
  const checked = isAssigned ? "checked" : "";

  container.innerHTML += renderContactDropdownEntryTemplate(task, key, color, className, contact, checked);
}

function renderContactDropdownEntryTemplate(task, key, color, className, contact, checked) {
  return `
    <div onclick="toggleAssignedToEditZoom('${task.id}','${key}','${color}')"
         id="assignedToNameEdit${key}" class="${className}">
      <div class="name-section">
        <div class="name-circle-add-section" style="background-color: ${color}">
          <span>${contact.firstNameContact.charAt(
            0
          )}${contact.lastNameContact.charAt(0)}</span>
        </div>
        <span>${shortenName(
          `${contact.firstNameContact} ${contact.lastNameContact}`
        )}</span>
      </div>
      <input class="custom-checkbox" id="assignedToCheckboxEdit${key}" type="checkbox" ${checked}
             style="pointer-events: none;">
    </div>`;
}

/**
 * Rendert den farbigen Kreis für einen bereits zugewiesenen Kontakt.
 * @param {string} key - Schlüssel des Kontakts
 * @param {Object} contact - Kontaktdaten
 * @param {string} color - Farbcode
 * @param {HTMLElement} container - DOM-Container für zugewiesene Kontakte
 */
function renderAssignedCircleEditZoom(key, contact, color, container) {
  container.innerHTML += `
    <div id="chosenNameEdit${key}" class="name-circle-add-section" style="background-color: ${color}">
      <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
    </div>`;
}

/**
 * Checks if contact is assigned to task
 * @param {Object} task - Task object
 * @param {Object} contact - Contact to check
 * @returns {boolean} True if assigned
 */
function isContactAssigned(task, contact) {
  return task.assignedTo && Object.values(task.assignedTo).some(
    a => a.firstName === contact.firstNameContact && a.lastName === contact.lastNameContact
  );
}

/**
 * Schaltet die Zuweisung eines Kontakts für eine Aufgabe um.
 * @param {string} taskId - ID der Aufgabe
 * @param {string} key - Schlüssel des Kontakts
 * @param {string} color - Farbe für den Kontaktkreis
 */
function toggleAssignedToEditZoom(taskId, key, color) {
  const taskKey = findTaskKey(taskId);
  if (!taskKey) return;

  const task = currentUser.tasks[taskKey];
  const checkbox = document.getElementById(`assignedToCheckboxEdit${key}`);
  const div = document.getElementById(`assignedToNameEdit${key}`);
  const chosenSection = document.getElementById("choosenNamesSectionEdit");

  checkbox.checked = !checkbox.checked;

  checkbox.checked
    ? assignContactToTask(task, key, div, color, chosenSection)
    : unassignContactFromTask(task, key, div);
}

/**
 * Weist einen Kontakt der Aufgabe zu und zeigt Kreis an.
 * @param {Object} task - Aufgabenobjekt
 * @param {string} key - Kontakt-Schlüssel
 * @param {HTMLElement} div - Element mit Kontaktanzeige
 * @param {string} color - Farbe für den Kreis
 * @param {HTMLElement} chosenSection - DOM-Element für die ausgewählten Kontakte
 */
function assignContactToTask(task, key, div, color, chosenSection) {
  div.classList.replace("assigned-to-name", "checked-assigned-to");

  if (!task.assignedTo) task.assignedTo = {};
  task.assignedTo[`contact_${key}`] = {
    firstName: currentUser.contacts[key].firstNameContact,
    lastName: currentUser.contacts[key].lastNameContact
  };

  if (!document.getElementById(`chosenNameEdit${key}`)) {
    chosenSection.innerHTML += `
      <div id="chosenNameEdit${key}" class="name-circle-add-section" style="background-color: ${color}">
        <span>${currentUser.contacts[key].firstNameContact.charAt(0)}${currentUser.contacts[key].lastNameContact.charAt(0)}</span>
      </div>`;
  }
}

/**
 * Entfernt einen Kontakt von der Aufgabe und entfernt Kreis.
 * @param {Object} task - Aufgabenobjekt
 * @param {string} key - Kontakt-Schlüssel
 * @param {HTMLElement} div - DOM-Element für den Kontakt
 */
function unassignContactFromTask(task, key, div) {
  div.classList.replace("checked-assigned-to", "assigned-to-name");
  delete task.assignedTo[`contact_${key}`];

  const circle = document.getElementById(`chosenNameEdit${key}`);
  if (circle) circle.remove();
}

/**
 * Toggles category dropdown
 */
function openAndCloseCategorySectionEditZoom() {
  let dropdown = document.getElementById("categoryDropDownSectionEdit");
  let arrowImg = document.getElementById("dropDownImgCategoryEdit");
  
  dropdown.classList.toggle("d-none");
  arrowImg.src = dropdown.classList.contains("d-none")
    ? "assets/img/dropDownArrowDown.svg"
    : "assets/img/dropDownArrowUp.svg";
}

/**
 * Sets category and closes dropdown
 * @param {string} categoryName - Selected category
 */
function setCategoryAndClose(categoryName) {
  document.getElementById("selectTaskCategorySpanEdit").innerHTML = categoryName;
  document.getElementById("categoryDropDownSectionEdit").classList.add("d-none");
  document.getElementById("dropDownImgCategoryEdit").src = "assets/img/dropDownArrowDown.svg";
}

// Category selection functions
function choseTechnicalTaskEditZoom() { setCategoryAndClose("Technical Task"); }
function choseUserStoryEditZoom() { setCategoryAndClose("User Story"); }

/**
 * Sets priority to Urgent
 */
function pressUrgentButtonEditZoom() {
  resetEditPriorities();
  document.getElementById("prioUrgentEdit").classList.add("prio-urgent-chosen");
  document.getElementById("urgent-button-icon-edit").src = "./assets/img/urgentArrowWhite.svg";
}

/**
 * Sets priority to Medium
 */
function pressMediumButtonEditZoom() {
  resetEditPriorities();
  document.getElementById("prioMediumEdit").classList.add("prio-medium-chosen");
  document.getElementById("medium-button-icon-edit").src = "./assets/img/mediumLinesWhite.svg";
}

/**
 * Sets priority to Low
 */
function pressLowButtonEditZoom() {
  resetEditPriorities();
  document.getElementById("prioLowEdit").classList.add("prio-low-chosen");
  document.getElementById("low-button-icon-edit").src = "./assets/img/lowArrowGreenWhite.svg";
}

/**
 * Resets priority buttons
 */
function resetEditPriorities() {
  // Reset buttons and class names
  const priorities = [
    {id: "prioUrgentEdit", icon: "urgent-button-icon-edit", activeClass: "prio-urgent-chosen", 
     normalClass: "prio-urgent", normalIcon: "./assets/img/urgentArrowRed.svg"},
    {id: "prioMediumEdit", icon: "medium-button-icon-edit", activeClass: "prio-medium-chosen", 
     normalClass: "prio-medium", normalIcon: "./assets/img/mediumLinesOrange.svg"},
    {id: "prioLowEdit", icon: "low-button-icon-edit", activeClass: "prio-low-chosen", 
     normalClass: "prio-low", normalIcon: "./assets/img/lowArrowGreeen.svg"}
  ];
  
  priorities.forEach(p => {
    document.getElementById(p.id).classList.remove(p.activeClass);
    document.getElementById(p.id).classList.add(p.normalClass);
    document.getElementById(p.icon).src = p.normalIcon;
  });
}

/**
 * Finds task key by ID
 * @param {string} taskId - Task ID
 * @returns {string|undefined} Task key if found
 */
function findTaskKey(taskId) {
  return Object.keys(currentUser.tasks || {}).find(
    key => currentUser.tasks[key].id === taskId
  );
}

/**
 * Renders edit interface
 * @param {string} taskId - Task ID
 */
function renderEditSectionZoom(taskId) {
  const taskKey = findTaskKey(taskId);
  if (!taskKey) return console.error(`Task ${taskId} not found`);
  
  let task = currentUser.tasks[taskKey];
  document.getElementById("taskZoomSectionEdit").innerHTML = getEditZoomSection(task, taskKey);
  
  renderAssignedToSectionEditZoom(taskKey);
  renderNameCirclesEditZoom(taskKey);
  renderSubtasksEditZoom();
}

/**
 * Renders assigned contact circles
 * @param {string} taskKey - Task key
 */
function renderNameCirclesEditZoom(taskKey) {
  let container = document.getElementById("choosenNamesSectionEdit");
  container.innerHTML = "";
  
  let task = currentUser.tasks[taskKey];
  Object.entries(task.assignedTo || {}).forEach(([k, c]) => {
    let color = getOrAssignColorForTask(task.id, k);
    container.innerHTML += `
      <div class="name-circle-add-section" style="background-color: ${color}">
        <span>${c.firstName[0]}${c.lastName[0]}</span>
      </div>`;
  });
}

/**
 * Toggles assignee dropdown
 */
function openAndCloseAssignedToSectionEditZoom() {
  let dropdown = document.getElementById("dropDownSectionEdit");
  let arrowImg = document.getElementById("dropDownImgEdit");
  
  dropdown.classList.toggle("d-none");
  arrowImg.src = dropdown.classList.contains("d-none")
    ? "assets/img/dropDownArrowDown.svg"
    : "assets/img/dropDownArrowUp.svg";
}

/**
 * Shows/hides single name circle
 */
function choseNameAndShowCircleEditZoom() {
  let checkbox = document.getElementById("assignedToCheckboxEdit");
  document.getElementById("chosenNameEdit").classList.toggle("d-none", !checkbox.checked);
}