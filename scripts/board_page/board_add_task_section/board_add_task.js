/**
 * Saves a new task after validation, building the task object,
 * and sending it to the database.
 * @returns {Promise<void>}
 */
async function saveNewTask() {
    const assignedContacts = collectAssignedContacts();
    if (!Object.keys(assignedContacts).length) return showErrorNoContacts();
  
    const titleElem = document.getElementById('title');
    const dateElem = document.getElementById('date');
    const catSec = document.getElementById('selectTaskCategorySpan');
  
    if (!validateTitle(titleElem) || !validateDate(dateElem) || !validateCategory(catSec)) return;
  
    const newTask = buildNewTaskObject(titleElem, dateElem, catSec, assignedContacts);
    await saveTaskToDatabase(newTask);
  }


  /**
 * Builds a new task object with validated data.
 * @param {HTMLElement} titleElem - Title input element.
 * @param {HTMLElement} dateElem - Date input element.
 * @param {HTMLElement} catSec   - Category span element.
 * @param {Object} assignedContacts - Object of checked contacts.
 * @returns {Object} A fully prepared task object.
 */
function buildNewTaskObject(titleElem, dateElem, catSec, assignedContacts) {
    const prio = getPriority();
    const formattedTitle = capitalizeFirstLetter(titleElem.value.trim());
    const descrElem = document.getElementById('description');
    const formattedDescr = descrElem.value.trim()
      ? capitalizeFirstLetter(descrElem.value.trim())
      : "";
  
    return {
      id: `task_${Date.now()}`,
      assignedTo: assignedContacts,
      category: catSec.innerText.includes("Technical") ? "Technical Task" : "User Story",
      currentStatus: "toDo",
      dueDate: dateElem.value,
      priority: prio,
      subtasks: currentSubTask || {},
      taskDescription: formattedDescr,
      title: formattedTitle,
    };
  }


  /**
 * Collects all checked contacts and returns them as an object.
 * @returns {Object} An object of assigned contacts.
 */
function collectAssignedContacts() {
    const c = currentUser.contacts || {};
    const assignedNames = {};
  
    for (let key in c) {
      const box = document.getElementById(`assignedToCheckbox${key}`);
      if (box && box.checked) {
        assignedNames[`contact_${key}`] = {
          firstName: c[key].firstNameContact,
          lastName: c[key].lastNameContact
        };
      }
    }
    return assignedNames;
  }


  /**
 * Closes the "Add Task" board, re-enables scrolling, and resets the form.
 */
function closeAddTaskBoard() {
    const addTaskSection = document.getElementById("addTaskBoardSection");
    const body = document.getElementById("body");
    addTaskSection.classList.add("d-none");
    body.classList.remove("overflow-hidden");
    resetForm();
  }


  /**
 * Determines the current priority based on chosen CSS classes.
 * @returns {string} "Urgent", "Medium", or "Low"
 */
function getPriority() {
    if (document.getElementById('prioUrgent').classList.contains('prio-urgent-chosen')) return 'Urgent';
    if (document.getElementById('prioMedium').classList.contains('prio-medium-chosen')) return 'Medium';
    return 'Low';
  }


  /**
 * Sends the prepared task to the database and handles the result.
 * @param {Object} newTask - The task object to be saved.
 * @returns {Promise<void>}
 */
async function saveTaskToDatabase(newTask) {
      const result = await postTaskToDatabase(currentUser.id, newTask);
      closeAddTaskBoard();
      initBoardPage();
  }


  /**
 * Resets the entire form to its default state.
 */
function resetForm() {
    resetInputFields();
    resetCategoryField();
    resetPriorityButtons();
    clearSubtasks();
    renderSubtasks();
    resetSubtaskInputSection();
    renderAssignedToSection();
    closeAssignedToDropdown();
    closeCategoryDropdown();
  }


  /**
 * Clears all current subtasks.
 */
function clearSubtasks() {
    currentSubTask = {};
  }
  

  /**
 * Deletes a subtask from the currentSubTask object by ID.
 * @param {string} id - The subtask ID to delete.
 */
function deleteSubtask(id) {
    delete currentSubTask[id];
    renderSubtasks();
  }


  /**
 * Adds a new subtask from the input field.
 */
function addSubtask() {
    const input = document.getElementById("subtask");
    if (!input.value.trim()) {
      return;
    }
    const newKey = `subtask_${Date.now()}`;
    currentSubTask[newKey] = { subTaskDescription: input.value, checked: false };
    input.value = "";
    input.disabled = true; // Quick blur-fix for some browsers
    input.disabled = false;
    renderSubtasks();
    closeInputSubtaskSection(event);
  }


  /**
 * Saves the edited subtask text and re-renders.
 * @param {string} id - The subtask ID to save.
 */
function saveSubtask(id) {
    const edited = document.getElementById(`editedTask${id}`);
    if (!edited) return;
    currentSubTask[id].subTaskDescription = edited.value;
    renderSubtasks();
  }


  /**
 * Sets the priority to "Urgent" and updates visual styles.
 */
function pressUrgentButton() {
    document.getElementById("prioMedium").classList.remove("prio-medium-chosen");
    document.getElementById("prioMedium").classList.add("prio-medium");
    document.getElementById("prioLow").classList.remove("prio-low-chosen");
    document.getElementById("prioLow").classList.add("prio-low");
    document.getElementById("prioUrgent").classList.remove("prio-urgent");
    document.getElementById("prioUrgent").classList.add("prio-urgent-chosen");
    document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowWhite.svg";
    document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesOrange.svg";
    document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreeen.svg";
  }
  
  
  /**
   * Sets the priority to "Medium" and updates visual styles.
   */
  function pressMediumButton() {
    document.getElementById("prioUrgent").classList.remove("prio-urgent-chosen");
    document.getElementById("prioUrgent").classList.add("prio-urgent");
    document.getElementById("prioLow").classList.remove("prio-low-chosen");
    document.getElementById("prioLow").classList.add("prio-low");
    document.getElementById("prioMedium").classList.remove("prio-medium");
    document.getElementById("prioMedium").classList.add("prio-medium-chosen");
    document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowRed.svg";
    document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesWhite.svg";
    document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreeen.svg";
  }
  
  
  /**
   * Sets the priority to "Low" and updates visual styles.
   */
  function pressLowButton() {
    document.getElementById("prioUrgent").classList.remove("prio-urgent-chosen");
    document.getElementById("prioUrgent").classList.add("prio-urgent");
    document.getElementById("prioMedium").classList.remove("prio-medium-chosen");
    document.getElementById("prioMedium").classList.add("prio-medium");
    document.getElementById("prioLow").classList.remove("prio-low");
    document.getElementById("prioLow").classList.add("prio-low-chosen");
    document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowRed.svg";
    document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesOrange.svg";
    document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreenWhite.svg";
  }


  /**
 * Shows an error if no contacts are selected.
 */
function showErrorNoContacts() {
    rotateMessage();
  }


  /**
 * Toggles the category dropdown arrow icon and visibility.
 * @param {HTMLElement} dropSec - The category dropdown section.
 * @param {HTMLElement} dropImg - The dropdown arrow image element.
 */
function toggleCategory(dropSec, dropImg) {
    dropSec.classList.toggle('d-none');
    if (dropImg.src.includes("dropDownArrowDown.svg")) {
      dropImg.src = "assets/img/dropDownArrowUp.svg";
    } else {
      dropImg.src = "assets/img/dropDownArrowDown.svg";
    }
  }


  /**
 * Closes the subtask input section and clears the input.
 * @param {MouseEvent} event - The click event.
 */
function closeInputSubtaskSection(event) {
    const iconSec = document.getElementById('subtaskIconSection');
    const subSec = document.getElementById('subtaskSectionInput');
    const input = document.getElementById('subtask');
  
    subSec.classList.remove('blue-border');
    iconSec.innerHTML = `
      <div onclick="showInputSubtaskSection()" id="subtaskIconSection" class="add-subtask-img">
        <img src="./assets/img/addCross.svg" alt="">
      </div>`;
    event.stopPropagation();
    input.value = "";
  }


  /**
 * Shows the input section for subtasks.
 */
function showInputSubtaskSection() {
    const iconSec = document.getElementById('subtaskIconSection');
    const subSec = document.getElementById('subtaskSectionInput');
  
    subSec.classList.add('blue-border');
    iconSec.classList.remove('add-subtask-img');
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


  /**
 * Resets the subtask input section to its default (hidden input).
 */
function resetSubtaskInputSection() {
    const iconSec = document.getElementById("subtaskIconSection");
    if (iconSec) {
      iconSec.innerHTML = `
        <div onclick="showInputSubtaskSection()" id="subtaskIconSection" class="add-subtask-img">
          <img src="./assets/img/addCross.svg" alt="">
        </div>`;
    }
  }


  /**
 * Renders the list of existing subtasks.
 */
function renderSubtasks() {
    const sec = document.getElementById("subtaskSection");
    if (!sec) return;
    sec.innerHTML = "";
  
    Object.entries(currentSubTask).forEach(([id, st]) => {
      sec.innerHTML += `
        <div id="taskBulletPoint${id}" class="task-bullet-point">
          <li>${st.subTaskDescription}</li>
          <div id="edit-trash-section" class="edit-trash-section">
            <img onclick="editSubtask('${id}')" src="./assets/img/subtaskPen.svg" alt="">
            <div class="seperator-edit-trash"></div>
            <img onclick="deleteSubtask('${id}')" src="./assets/img/trashImg.svg" alt="">
          </div>
        </div>`;
    });
  }


  function renderAddTaskContent() {
    let addtaskSection = document.getElementById('addTaskBoardSection');
    addtaskSection.innerHTML = getAddTaskSectionContent();
  }

/**
 * Opens an inline edit form for a subtask.
 * @param {string} id - The subtask ID to edit.
 */
function editSubtask(id) {
    const bullet = document.getElementById(`taskBulletPoint${id}`);
    if (!bullet) return;
    bullet.classList.remove("task-bullet-point");
  
    bullet.innerHTML = `
      <div class="subtask-edit-point-section">
        <div class="subtask-edit-point">
          <input id="editedTask${id}" class="subtask-input-edit"
                 value="${currentSubTask[id].subTaskDescription}" type="text">
          <div class="subtask-edit-icons">
            <img class="edit-trash-icon" src="./assets/img/trashImg.svg"
                 alt="" onclick="deleteSubtask('${id}')">
            <div class="subtaskSeparator"></div>
            <img class="edit-check-icon" src="./assets/img/checkBlack.svg"
                 alt="" onclick="saveSubtask('${id}')">
          </div>
        </div>
      </div>`;
  }