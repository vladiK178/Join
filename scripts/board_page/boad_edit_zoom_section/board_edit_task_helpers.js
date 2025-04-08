/**
 * Checks if title and date inputs are valid
 * @returns {boolean} True if all inputs valid
 */
function validateTitleAndDate() {
  let title = document.getElementById("titleEdit");
  let date = document.getElementById("dateEdit");
  let valid = true;
  
  // Check title field
  if (!title.value.trim()) {
    document.getElementById("alertMessageTitleEdit").classList.remove("hide-alert-message");
    valid = false;
  } else {
    document.getElementById("alertMessageTitleEdit").classList.add("hide-alert-message");
  }
  
  // Check date field
  if (!date.value) {
    document.getElementById("alertMessageDateEdit").classList.remove("hide-alert-message");
    valid = false;
  } else {
    document.getElementById("alertMessageDateEdit").classList.add("hide-alert-message");
  }
  
  return valid;
}

/**
 * Validates that at least one contact is assigned
 * @param {string} taskKey - Key of task to check
 * @returns {boolean} True if task has contacts
 */
function validateAssignedContacts(taskKey) {
  let task = currentUser.tasks[taskKey];
  
  if (!task.assignedTo || Object.keys(task.assignedTo).length === 0) {
    alert("Please assign at least one contact before saving changes.");
    return false;
  }
  
  return true;
}

/**
 * Gets current priority from UI state
 * @returns {string} Priority level (Urgent, Medium, or Low)
 */
function getCurrentEditPriority() {
  const urgentBtn = document.getElementById("prioUrgentEdit");
  const mediumBtn = document.getElementById("prioMediumEdit");
  
  if (urgentBtn.classList.contains("prio-urgent-chosen")) {
    return "Urgent";
  } else if (mediumBtn.classList.contains("prio-medium-chosen")) {
    return "Medium";
  }
  
  return "Low";
}

/**
 * Updates task data in memory with form values
 * @param {string} taskKey - Key of task to update
 * @param {string} priority - Selected priority
 */
function updateTaskDataInMemory(taskKey, priority) {
  const task = currentUser.tasks[taskKey];
  
  // Update task with current form values
  currentUser.tasks[taskKey] = {
    ...task,
    title: document.getElementById("titleEdit").value,
    taskDescription: document.getElementById("descriptionEdit").value,
    dueDate: document.getElementById("dateEdit").value,
    priority,
    subtasks: currentSubTaskEdit
  };
}