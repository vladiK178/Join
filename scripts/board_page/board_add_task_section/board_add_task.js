/**
 * Saves a new task after validation and sends it to database
 * @returns {Promise<void>}
 */
async function saveNewTask() {
  // injects error spans if missing
  ensureBoardValidationAlertsExist();
  if (!validateBoardForm()) return;
  // Get assigned contacts and validate
  const assignedContacts = collectAssignedContacts();
  if (!Object.keys(assignedContacts).length) {
      rotateMessage(); // Show error animation for no contacts
      return;
  }

  // Get main form elements
  const titleElement = document.getElementById('title');
  const dateElement = document.getElementById('date');
  const categoryElement = document.getElementById('selectTaskCategorySpan');

  // Validate required fields
  if (!validateTitle(titleElement) || !validateDate(dateElement) || !validateCategory(categoryElement)) {
      return;
  }

  // Build and save the task
  const taskData = buildNewTaskObject(titleElement, dateElement, categoryElement, assignedContacts);
  await saveTaskToDatabase(taskData);
}


/**
* Builds a task object from form data
* @param {HTMLElement} titleElement - Title input
* @param {HTMLElement} dateElement - Date input
* @param {HTMLElement} categoryElement - Category span
* @param {Object} assignedContacts - Selected contacts
* @returns {Object} The complete task object
*/
function buildNewTaskObject(titleElement, dateElement, categoryElement, assignedContacts) {
  // Get task priority
  const priority = getPriority();
  
  // Format title with capitalization
  const formattedTitle = capitalizeFirstLetter(titleElement.value.trim());
  
  // Get and format description
  const descriptionElement = document.getElementById('description');
  let formattedDescription = "";
  if (descriptionElement.value.trim()) {
      formattedDescription = capitalizeFirstLetter(descriptionElement.value.trim());
  }

  // Create the task object
  return {
      id: `task_${Date.now()}`,
      assignedTo: assignedContacts,
      category: categoryElement.innerText.includes("Technical") ? "Technical Task" : "User Story",
      currentStatus: "toDo",
      dueDate: dateElement.value,
      priority: priority,
      subtasks: currentSubTask || {},
      taskDescription: formattedDescription,
      title: formattedTitle,
  };
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
              lastName: contacts[key].lastNameContact
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
  if (document.getElementById('prioUrgent').classList.contains('prio-urgent-chosen')) {
      return 'Urgent';
  }
  if (document.getElementById('prioMedium').classList.contains('prio-medium-chosen')) {
      return 'Medium';
  }
  return 'Low';
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
* Creates a new subtask from input field
*/
function addSubtask() {
  const inputField = document.getElementById("subtask");
  const inputValue = inputField.value.trim();
  
  // Skip if input is empty
  if (!inputValue) {
      return;
  }
  
  // Create unique ID and add subtask
  const newSubtaskId = `subtask_${Date.now()}`;
  currentSubTask[newSubtaskId] = { 
      subTaskDescription: inputValue, 
      checked: false 
  };
  
  // Clear input field
  inputField.value = "";
  
  // Fix for focus issues in some browsers
  inputField.disabled = true;
  inputField.disabled = false;
  
  // Update UI
  renderSubtasks();
  closeInputSubtaskSection(event);
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
* Sets priority to Urgent and updates button styles
*/
function pressUrgentButton() {
  // Reset other buttons
  document.getElementById("prioMedium").classList.remove("prio-medium-chosen");
  document.getElementById("prioMedium").classList.add("prio-medium");
  document.getElementById("prioLow").classList.remove("prio-low-chosen");
  document.getElementById("prioLow").classList.add("prio-low");
  
  // Set this button as chosen
  document.getElementById("prioUrgent").classList.remove("prio-urgent");
  document.getElementById("prioUrgent").classList.add("prio-urgent-chosen");
  
  // Update icons
  document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowWhite.svg";
  document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesOrange.svg";
  document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreeen.svg";
}


/**
* Sets priority to Medium and updates button styles
*/
function pressMediumButton() {
  // Reset other buttons
  document.getElementById("prioUrgent").classList.remove("prio-urgent-chosen");
  document.getElementById("prioUrgent").classList.add("prio-urgent");
  document.getElementById("prioLow").classList.remove("prio-low-chosen");
  document.getElementById("prioLow").classList.add("prio-low");
  
  // Set this button as chosen
  document.getElementById("prioMedium").classList.remove("prio-medium");
  document.getElementById("prioMedium").classList.add("prio-medium-chosen");
  
  // Update icons
  document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowRed.svg";
  document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesWhite.svg";
  document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreeen.svg";
}


/**
* Sets priority to Low and updates button styles
*/
function pressLowButton() {
  // Reset other buttons
  document.getElementById("prioUrgent").classList.remove("prio-urgent-chosen");
  document.getElementById("prioUrgent").classList.add("prio-urgent");
  document.getElementById("prioMedium").classList.remove("prio-medium-chosen");
  document.getElementById("prioMedium").classList.add("prio-medium");
  
  // Set this button as chosen
  document.getElementById("prioLow").classList.remove("prio-low");
  document.getElementById("prioLow").classList.add("prio-low-chosen");
  
  // Update icons
  document.getElementById("urgent-button-icon").src = "./assets/img/urgentArrowRed.svg";
  document.getElementById("medium-button-icon").src = "./assets/img/mediumLinesOrange.svg";
  document.getElementById("low-button-icon").src = "./assets/img/lowArrowGreenWhite.svg";
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
  dropdownSection.classList.toggle('d-none');
  
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
  const iconSection = document.getElementById('subtaskIconSection');
  const inputSection = document.getElementById('subtaskSectionInput');
  const inputField = document.getElementById('subtask');

  // Remove blue border
  inputSection.classList.remove('blue-border');
  
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
  const iconSection = document.getElementById('subtaskIconSection');
  const inputSection = document.getElementById('subtaskSectionInput');

  // Add blue border
  inputSection.classList.add('blue-border');
  iconSection.classList.remove('add-subtask-img');
  
  // Change to input mode with close and submit icons
  iconSection.innerHTML = `
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
      container.innerHTML += `
        <div id="taskBulletPoint${id}" class="task-bullet-point">
            <li>${subtask.subTaskDescription}</li>
            <div id="edit-trash-section" class="edit-trash-section">
                <img onclick="editSubtask('${id}')" src="./assets/img/subtaskPen.svg" alt="">
                <div class="seperator-edit-trash"></div>
                <img onclick="deleteSubtask('${id}')" src="./assets/img/trashImg.svg" alt="">
            </div>
        </div>`;
  });
}


/**
* Renders the add task panel content
*/
function renderAddTaskContent() {
  const taskPanel = document.getElementById('addTaskBoardSection');
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
  bulletPoint.innerHTML = `
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