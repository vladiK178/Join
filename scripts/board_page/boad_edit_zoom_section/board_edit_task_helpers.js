/** Checks if title and date are valid, toggles alert messages if not. */
function validateTitleAndDate() {
    let title = document.getElementById("titleEdit");
    let date = document.getElementById("dateEdit");
    let isValid = true;
    if (!title.value.trim()) {
      document.getElementById("alertMessageTitleEdit").classList.remove("hide-alert-message");
      isValid = false;
    } else {
      document.getElementById("alertMessageTitleEdit").classList.add("hide-alert-message");
    }
    if (!date.value) {
      document.getElementById("alertMessageDateEdit").classList.remove("hide-alert-message");
      isValid = false;
    } else {
      document.getElementById("alertMessageDateEdit").classList.add("hide-alert-message");
    }
    return isValid;
  }


  /** Ensures at least one contact is assigned to the task. */
function validateAssignedContacts(taskKey) {
    let task = currentUser.tasks[taskKey];
    if (!task.assignedTo || Object.keys(task.assignedTo).length === 0) {
      alert("Please assign at least one contact before saving changes.");
      return false;
    }
    return true;
  }


  /** Determines current priority based on selected elements. */
function getCurrentEditPriority() {
    if (document.getElementById("prioUrgentEdit").classList.contains("prio-urgent-chosen")) {
      return "Urgent";
    } else if (document.getElementById("prioMediumEdit").classList.contains("prio-medium-chosen")) {
      return "Medium";
    }
    return "Low";
  }
  

  /** Updates the task data in local memory (currentUser). */
function updateTaskDataInMemory(taskKey, priority) {
    const t = currentUser.tasks[taskKey];
    currentUser.tasks[taskKey] = {
      ...t,
      title: document.getElementById("titleEdit").value,
      taskDescription: document.getElementById("descriptionEdit").value,
      dueDate: document.getElementById("dateEdit").value,
      priority,
      subtasks: currentSubTaskEdit // <--- Ensure updated subtasks are included
    };
  }