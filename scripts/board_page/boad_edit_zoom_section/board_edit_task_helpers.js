/**
 * Prüft die Eingabe des Titels und zeigt bei Fehlern die Warnung an.
 * @returns {boolean} True, wenn Titel gültig ist
 */
function validateTitleEdit() {
  const title = document.getElementById("titleEdit");
  const alert = document.getElementById("alertMessageTitleEdit");
  if (!title.value.trim()) {
    alert.classList.remove("d-none");
    return false;
  }
  alert.classList.add("d-none");
  return true;
}

/**
 * Prüft die Eingabe des Datums und zeigt bei Fehlern die Warnung an.
 * @returns {boolean} True, wenn Datum gültig ist
 */
function validateDateEdit() {
  const date = document.getElementById("dateEdit");
  const alert = document.getElementById("alertMessageDateEdit");
  if (!date.value) {
    alert.classList.remove("d-none");
    return false;
  }
  alert.classList.add("d-none");
  return true;
}

/**
 * Validiert Titel und Datum und gibt true zurück, wenn beide gültig sind.
 * @returns {boolean} True, wenn alle Eingaben gültig sind
 */
function validateTitleAndDate() {
  const isTitleValid = validateTitleEdit();
  const isDateValid = validateDateEdit();
  return isTitleValid && isDateValid;
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
    subtasks: currentSubTaskEdit,
  };
}
