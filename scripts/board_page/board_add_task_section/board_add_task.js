/**
 * Saves a new task after validation and sends it to database
 * @returns {Promise<void>}
 */
async function saveNewTask() {
  ensureBoardValidationAlertsExist();

  if (!validateBoardForm()) return;
  if (!validateAssignedContactsBoard()) return;

  const titleElement = document.getElementById("title");
  const dateElement = document.getElementById("date");
  const categoryElement = document.getElementById("selectTaskCategorySpan");

  if (!validateRequiredFields(titleElement, dateElement, categoryElement))
    return;

  const assignedContacts = collectAssignedContacts();
  const taskData = buildNewTaskObject(
    titleElement,
    dateElement,
    categoryElement,
    assignedContacts
  );

  await saveTaskToDatabase(taskData);
}

/**
 * Validates that assigned contacts are present, otherwise triggers error animation
 * @returns {boolean} True if valid contacts exist
 */
function validateAssignedContactsBoard() {
  const assignedContacts = collectAssignedContacts();
  if (!Object.keys(assignedContacts).length) {
    rotateMessage(); // Show error animation for no contacts
    return false;
  }
  return true;
}

/**
 * Validates title, date and category fields
 * @param {HTMLElement} titleElement
 * @param {HTMLElement} dateElement
 * @param {HTMLElement} categoryElement
 * @returns {boolean} True if all fields are valid
 */
function validateRequiredFields(titleElement, dateElement, categoryElement) {
  return (
    validateTitle(titleElement) &&
    validateDate(dateElement) &&
    validateCategory(categoryElement)
  );
}

/**
 * Builds a task object from form data
 * @param {HTMLElement} titleElement - Title input element
 * @param {HTMLElement} dateElement - Date input element
 * @param {HTMLElement} categoryElement - Category span element
 * @param {Object} assignedContacts - Selected contacts object
 * @returns {Object} The constructed task object
 */
function buildNewTaskObject(titleElement, dateElement, categoryElement, assignedContacts) {
  return {
    id: generateTaskId(),
    assignedTo: assignedContacts,
    category: getCategoryFromElement(categoryElement),
    currentStatus: "toDo",
    dueDate: dateElement.value,
    priority: getPriority(),
    subtasks: getCurrentSubtasks(),
    taskDescription: getFormattedDescription(),
    title: getFormattedTitle(titleElement),
  };
}

/**
 * Generates a unique task ID based on the current timestamp.
 * @returns {string} The generated task ID.
 */
function generateTaskId() {
  return `task_${Date.now()}`;
}

/**
 * Determines the task category based on the category element's inner text.
 * @param {HTMLElement} categoryElement - The DOM element containing the category text.
 * @returns {string} The category as "Technical Task" or "User Story".
 */
function getCategoryFromElement(categoryElement) {
  return categoryElement.innerText.includes("Technical")
    ? "Technical Task"
    : "User Story";
}

/**
 * Formats the task title by trimming and capitalizing the first letter.
 * @param {HTMLElement} titleElement - The input element containing the title.
 * @returns {string} The formatted title string.
 */
function getFormattedTitle(titleElement) {
  return capitalizeFirstLetter(titleElement.value.trim());
}

/**
 * Retrieves and formats the task description from the description input.
 * @returns {string} The formatted description or empty string if none.
 */
function getFormattedDescription() {
  const descriptionElement = document.getElementById("description");
  if (descriptionElement && descriptionElement.value.trim()) {
    return capitalizeFirstLetter(descriptionElement.value.trim());
  }
  return "";
}

/**
 * Retrieves the current subtasks object or returns an empty object if none.
 * @returns {Object} The current subtasks.
 */
function getCurrentSubtasks() {
  return currentSubTask || {};
}

/**
 * Collects all checked contacts
 * @returns {Object} Selected contacts
 */
function collectAssignedContacts() {
  const contacts = currentUser.contacts || {};
  const selected = {};

  // Loop through all contacts
  for (let key in contacts) {
    const checkbox = document.getElementById(`assignedToCheckbox${key}`);
    // If checkbox exists and is checked
    if (checkbox && checkbox.checked) {
      selected[`contact_${key}`] = {
        firstName: contacts[key].firstNameContact,
        lastName: contacts[key].lastNameContact,
      };
    }
  }
  return selected;
}

/**
 * Closes the add task panel and resets form
 */
function closeAddTaskBoard() {
  // Hide the add task section
  const taskSection = document.getElementById("addTaskBoardSection");
  taskSection.classList.add("d-none");

  // Enable scrolling on body
  const bodyElement = document.getElementById("body");
  bodyElement.classList.remove("overflow-hidden");

  // Reset the form to default state
  resetForm();
}

/**
 * Gets the selected priority
 * @returns {string} Priority level
 */
function getPriority() {
  // Check which priority button is active
  if (
    document
      .getElementById("prioUrgent")
      .classList.contains("prio-urgent-chosen")
  ) {
    return "Urgent";
  }
  if (
    document
      .getElementById("prioMedium")
      .classList.contains("prio-medium-chosen")
  ) {
    return "Medium";
  }
  return "Low";
}

/**
 * Saves task to database and handles UI updates
 * @param {Object} taskData - The task to save
 */
async function saveTaskToDatabase(taskData) {
  try {
    // Send to database
    await postTaskToDatabase(currentUser.id, taskData);

    // Close panel and refresh board
    closeAddTaskBoard();
    initBoardPage();
  } catch (error) {
    console.error("Failed to save task:", error);
  }
}

/**
 * Resets all form elements to default state
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
 * Clears all current subtasks
 */
function clearSubtasks() {
  currentSubTask = {};
}

/**
 * Removes a subtask by its ID
 * @param {string} subtaskId - ID of the subtask
 */
function deleteSubtask(subtaskId) {
  delete currentSubTask[subtaskId];
  renderSubtasks();
}

/**
 * Adds a new subtask from the input field to currentSubTask and updates UI
 */
function addSubtask() {
  const inputField = document.getElementById("subtask");
  const inputValue = inputField.value.trim();
  if (!inputValue) return;

  addNewSubtask(inputValue);
  resetSubtaskInput(inputField);
  renderSubtasks();
  closeInputSubtaskSection(event);
}

/**
 * Adds the subtask to currentSubTask object
 * @param {string} description - Description of the new subtask
 */
function addNewSubtask(description) {
  const newSubtaskId = `subtask_${Date.now()}`;
  currentSubTask[newSubtaskId] = {
    subTaskDescription: description,
    checked: false,
  };
}

/**
 * Clears and resets the input field
 * @param {HTMLElement} inputField - The subtask input element
 */
function resetSubtaskInput(inputField) {
  inputField.value = "";
  inputField.disabled = true;  // fix focus issue
  inputField.disabled = false;
}

/**
 * Updates a subtask's description after editing
 * @param {string} subtaskId - ID of the subtask
 */
function saveSubtask(subtaskId) {
  const editedInput = document.getElementById(`editedTask${subtaskId}`);
  if (!editedInput) return;

  // Update the subtask text
  currentSubTask[subtaskId].subTaskDescription = editedInput.value;
  renderSubtasks();
}

/**
 * Sets the priority button styles and icons based on selected priority
 * @param {string} priority - The priority to select ('urgent', 'medium', or 'low')
 */
function pressPriorityButton(priority) {
  ['urgent', 'medium', 'low'].forEach((p) => {
    const btn = document.getElementById(`prio${capitalizeFirstLetter(p)}`);
    const icon = document.getElementById(`${p}-button-icon`);
    const selected = p === priority;

    btn.classList.toggle(`prio-${p}-chosen`, selected);
    btn.classList.toggle(`prio-${p}`, !selected);
    icon.src = getIconSrc(p, selected);
  });
}

/**
 * Returns the icon source path based on priority and selection state
 * @param {string} priority - The priority type ('urgent', 'medium', 'low')
 * @param {boolean} isSelected - Whether this priority is currently selected
 * @returns {string} The path to the appropriate icon image
 */
function getIconSrc(priority, isSelected) {
  const icons = {
    urgent: ["./assets/img/urgentArrowRed.svg", "./assets/img/urgentArrowWhite.svg"],
    medium: ["./assets/img/mediumLinesOrange.svg", "./assets/img/mediumLinesWhite.svg"],
    low: ["./assets/img/lowArrowGreeen.svg", "./assets/img/lowArrowGreenWhite.svg"],
  };
  return isSelected ? icons[priority][1] : icons[priority][0];
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Shows no contacts error animation
 */
function showErrorNoContacts() {
  rotateMessage();
}

/**
 * Toggles dropdown visibility and arrow icon
 * @param {HTMLElement} dropdownSection - The dropdown container
 * @param {HTMLElement} arrowImage - The arrow icon
 */
function toggleCategory(dropdownSection, arrowImage) {
  // Toggle visibility
  dropdownSection.classList.toggle("d-none");

  // Change arrow direction
  if (arrowImage.src.includes("dropDownArrowDown.svg")) {
    arrowImage.src = "assets/img/dropDownArrowUp.svg";
  } else {
    arrowImage.src = "assets/img/dropDownArrowDown.svg";
  }
}

/**
 * Closes the subtask input form
 * @param {Event} event - The click event
 */
function closeInputSubtaskSection(event) {
  const iconSection = document.getElementById("subtaskIconSection");
  const inputSection = document.getElementById("subtaskSectionInput");
  const inputField = document.getElementById("subtask");

  // Remove blue border
  inputSection.classList.remove("blue-border");

  // Reset to default state
  iconSection.innerHTML = `
    <div onclick="showInputSubtaskSection()" id="subtaskIconSection" class="add-subtask-img">
      <img src="./assets/img/addCross.svg" alt="">
    </div>`;

  // Prevent event bubbling
  event.stopPropagation();

  // Clear input
  inputField.value = "";
}

/**
 * Shows the subtask input form
 */
function showInputSubtaskSection() {
  const iconSection = document.getElementById("subtaskIconSection");
  const inputSection = document.getElementById("subtaskSectionInput");

  // Add blue border
  inputSection.classList.add("blue-border");
  iconSection.classList.remove("add-subtask-img");

  // Change to input mode with close and submit icons
  iconSection.innerHTML = inputSubtaskIconTemplate();
}

function inputSubtaskIconTemplate() {
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
 * Resets subtask input section to default state
 */
function resetSubtaskInputSection() {
  const iconSection = document.getElementById("subtaskIconSection");
  if (iconSection) {
    iconSection.innerHTML = `
        <div onclick="showInputSubtaskSection()" id="subtaskIconSection" class="add-subtask-img">
            <img src="./assets/img/addCross.svg" alt="">
        </div>`;
  }
}

/**
 * Renders all current subtasks in the list
 */
function renderSubtasks() {
  const container = document.getElementById("subtaskSection");
  if (!container) return;

  // Clear current content
  container.innerHTML = "";

  // Add each subtask
  Object.entries(currentSubTask).forEach(([id, subtask]) => {
    container.innerHTML += renderSubtasksTemplate(id, subtask);
  });
}

function renderSubtasksTemplate(id, subtask) {
  return `
        <div id="taskBulletPoint${id}" class="task-bullet-point">
            <li>${subtask.subTaskDescription}</li>
            <div id="edit-trash-section" class="edit-trash-section">
                <img onclick="editSubtask('${id}')" src="./assets/img/subtaskPen.svg" alt="">
                <div class="seperator-edit-trash"></div>
                <img onclick="deleteSubtask('${id}')" src="./assets/img/trashImg.svg" alt="">
            </div>
        </div>`;
}

/**
 * Renders the add task panel content
 */
function renderAddTaskContent() {
  const taskPanel = document.getElementById("addTaskBoardSection");
  taskPanel.innerHTML = getAddTaskSectionContent();
}

/**
 * Changes a subtask to edit mode
 * @param {string} subtaskId - ID of the subtask to edit
 */
function editSubtask(subtaskId) {
  const bulletPoint = document.getElementById(`taskBulletPoint${subtaskId}`);
  if (!bulletPoint) return;

  // Remove regular styling
  bulletPoint.classList.remove("task-bullet-point");

  // Replace with edit form
  bulletPoint.innerHTML = editSubtaskTemplate(subtaskId, currentSubTask);
}

function editSubtaskTemplate(subtaskId, currentSubTask) {
  return `
    <div class="subtask-edit-point-section">
        <div class="subtask-edit-point">
            <input id="editedTask${subtaskId}" class="subtask-input-edit"
                   value="${currentSubTask[subtaskId].subTaskDescription}" type="text">
            <div class="subtask-edit-icons">
                <img class="edit-trash-icon" src="./assets/img/trashImg.svg"
                     alt="" onclick="deleteSubtask('${subtaskId}')">
                <div class="subtaskSeparator"></div>
                <img class="edit-check-icon" src="./assets/img/checkBlack.svg"
                     alt="" onclick="saveSubtask('${subtaskId}')">
            </div>
        </div>
    </div>`;
}
