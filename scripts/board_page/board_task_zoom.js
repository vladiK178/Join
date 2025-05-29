/**
 * Opens the task zoom section by making it visible and preventing body scrolling
 */
function openTaskZoomSection() {
  const zoomSection = document.getElementById("taskZoomSection");
  document.getElementById("body").classList.add("overflow-hidden");
  zoomSection.classList.remove("d-none");
}

/**
 * Closes the task zoom section by hiding it and enabling body scrolling again
 */
function closeTaskZoomSection() {
  document.getElementById("body").classList.remove("overflow-hidden");
  document.getElementById("taskZoomSection").classList.add("d-none");
}

/**
 * Finds a task in the user's tasks array by its ID
 * @param {string} taskId - The ID of the task to find
 * @returns {Object|undefined} The found task object or undefined if not found
 */
function findTaskById(taskId) {
  let tasks = Object.values(currentUser.tasks || {});
  return tasks.find((task) => task.id === taskId);
}

/**
 * Renders the category badge and close button in the task zoom view.
 * 
 * @param {Object} task - The task object to display. Must contain a `category` property.
 */
function renderTaskCategoryAndCloseSection(task) {
  const container = document.getElementById("taskCategoryAndCloseSection");
  const card = document.getElementById("task-card-element");

  if (!container || !card) return;

  if (!task.category) {
    renderMissingCategory(container);
    return;
  }

  const categoryClass = getCategoryClass(task.category);
  renderCategoryBadge(container, task.category, categoryClass);
  renderCloseButton(card);
}

/**
 * Displays an error message if no category is found.
 * 
 * @param {HTMLElement} container - The DOM element to render the message in.
 */
function renderMissingCategory(container) {
  container.innerHTML = `<div class="error-message"><span>No category found</span></div>`;
}

/**
 * Returns the appropriate CSS class based on the task category.
 * 
 * @param {string} category - The category name.
 * @returns {string} The corresponding CSS class name.
 */
function getCategoryClass(category) {
  return category.includes("User Story")
    ? "user-story-container-zoom"
    : "technical-task-container-zoom";
}

/**
 * Renders the category badge inside the given container.
 * 
 * @param {HTMLElement} container - The element where the badge will be rendered.
 * @param {string} category - The name of the category.
 * @param {string} className - The CSS class to apply.
 */
function renderCategoryBadge(container, category, className) {
  container.innerHTML += `
    <div class="${className}">
      <span>${category}</span>
    </div>`;
}

/**
 * Inserts the close button at the beginning of the task card.
 * 
 * @param {HTMLElement} card - The card element to insert the button into.
 */
function renderCloseButton(card) {
  card.insertAdjacentHTML(
    "afterbegin",
    `
    <div onclick="closeTaskZoomSection()" class="close-subtask-container">
      <img src="./assets/img/closeSubtask.svg" alt="">
    </div>`
  );
}

/**
 * Renders the subtasks section in the task zoom view.
 * 
 * @param {Object} task - The task object containing subtasks.
 */
function renderSubtaskZoomSection(task) {
  const subtaskSection = document.getElementById("subtaskZoomSection");
  if (!subtaskSection) return;

  clearSubtaskSection(subtaskSection);

  if (!hasValidSubtasks(task.subtasks)) {
    renderNoSubtasksMessage(subtaskSection);
    return;
  }

  renderAllSubtasks(task, subtaskSection);
}

/**
 * Clears the subtask section to avoid duplicate entries.
 * 
 * @param {HTMLElement} container - The DOM element for the subtask section.
 */
function clearSubtaskSection(container) {
  container.innerHTML = "";
}

/**
 * Checks if the task has valid subtasks.
 * 
 * @param {Object} subtasks - The subtasks object to validate.
 * @returns {boolean} True if subtasks are valid and not empty.
 */
function hasValidSubtasks(subtasks) {
  return subtasks && typeof subtasks === "object" && Object.keys(subtasks).length > 0;
}

/**
 * Renders a message indicating there are no subtasks.
 * 
 * @param {HTMLElement} container - The DOM element for the subtask section.
 */
function renderNoSubtasksMessage(container) {
  container.innerHTML = `<span>No subtasks</span>`;
}

/**
 * Renders all subtasks with checkboxes into the subtask section.
 * 
 * @param {Object} task - The task object containing subtasks and ID.
 * @param {HTMLElement} container - The DOM element for the subtask section.
 */
function renderAllSubtasks(task, container) {
  Object.entries(task.subtasks).forEach(([subtaskId, subtask]) => {
    renderSingleSubtask(container, task.id, subtaskId, subtask);
  });
}

/**
 * Renders a single subtask with checkbox and description.
 * 
 * @param {HTMLElement} container - The DOM element to append to.
 * @param {string} taskId - ID of the task the subtask belongs to.
 * @param {string} subtaskId - ID of the subtask.
 * @param {Object} subtask - The subtask object containing `subTaskDescription` and `checked`.
 */
function renderSingleSubtask(container, taskId, subtaskId, subtask) {
  const checkboxImage = subtask.checked ? "checkboxChecked" : "checkboxEmpty";
  container.innerHTML += `
    <div class="subtask-zoom">
      <img onclick="checkOrUncheckSubtask('${taskId}','${subtaskId}')"
           src="./assets/img/${checkboxImage}.svg" alt="checkbox">
      <span>${subtask.subTaskDescription}</span>
    </div>`;
}

/**
 * Toggles a subtask's checked state and updates in Firebase and UI
 * @param {string} taskId - The ID of the task
 * @param {string} subtaskId - The ID of the subtask to toggle
 */
async function checkOrUncheckSubtask(taskId, subtaskId) {
  try {
    // Get the task and subtask
    const taskKey = getTaskKeyById(taskId);
    let subtask = getSubtaskByKey(taskKey, subtaskId);

    // Toggle the checked state
    subtask.checked = !subtask.checked;

    // Update in Firebase
    await updateSpecificSubtask(currentUser.id, taskKey, subtaskId, subtask);

    // Update UI - Only update the relevant parts
    let task = currentUser.tasks[taskKey];

    // Only update the specific subtask indicator
    renderSubtaskProgress(taskId, task, task.currentStatus);

    // Only refresh the subtasks in the zoom view, not the whole task
    renderSubtaskZoomSection(task);
  } catch (err) {
    console.error("Error toggling subtask:", err);
  }
}

/**
 * Gets a task's Firebase key by its ID
 * @param {string} taskId - The ID of the task
 * @returns {string} - The Firebase key
 * @throws {Error} If task not found
 */
function getTaskKeyById(taskId) {
  let key = Object.keys(currentUser.tasks).find(
    (k) => currentUser.tasks[k].id === taskId
  );
  if (!key) {
    throw new Error(`Could not find task with ID: ${taskId}`);
  }
  return key;
}

/**
 * Gets a specific subtask from a task
 * @param {string} taskKey - The task's Firebase key
 * @param {string} subtaskId - The subtask ID
 * @returns {Object} - The subtask object
 * @throws {Error} If subtask not found
 */
function getSubtaskByKey(taskKey, subtaskId) {
  let subtask = currentUser.tasks[taskKey].subtasks[subtaskId];
  if (!subtask) {
    throw new Error(`Could not find subtask: ${subtaskId}`);
  }
  return subtask;
}

/**
 * Renders people assigned to the task with their initials and name
 * @param {Object} task - The task object
 */
function renderAssignedToAndCircleNames(task) {
  let section = document.getElementById("circleAndNameSection");
  section.innerHTML = "";

  // Iterate through all assigned contacts
  Object.entries(task.assignedTo || {}).forEach(([key, contact]) => {
    // Get initials from first and last name
    let initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(
      0
    )}`;

    // Get or assign a color for this contact in this task
    let color = getOrAssignColorForTask(task.id, key);

    // Create HTML for the contact
    section.innerHTML += `
      <div class="name-section">
        <div class="name-circle-add-section" style="background-color: ${color}">
          <span>${initials}</span>
        </div>
        <span>${contact.firstName} ${contact.lastName}</span>
      </div>`;
  });
}

/**
 * Renders the correct priority icon based on task priority
 * @param {string} priority - The priority level (Urgent, Medium, Low)
 */
function renderPrioIconImg(priority) {
  let imgElement = document.getElementById("prioIconZoomImg");

  if (priority === "Urgent") {
    imgElement.src = "assets/img/urgentArrowRed.svg";
  } else if (priority === "Medium") {
    imgElement.src = "assets/img/Prio media (1).svg";
  } else {
    imgElement.src = "assets/img/lowArrowGreeen.svg";
  }
}

/**
 * Updates a specific subtask in Firebase
 * @param {string} userId - The current user ID
 * @param {string} taskKey - The task's Firebase key
 * @param {string} subtaskKey - The subtask's key
 * @param {Object} subtask - The updated subtask object
 * @returns {Promise<void>}
 */
async function updateSpecificSubtask(userId, taskKey, subtaskKey, subtask) {
  let url = `https://join-portfolio-9245f-default-rtdb.europe-west1.firebasedatabase.app/${userId}/tasks/${taskKey}/subtasks/${subtaskKey}.json`;

  let response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subtask),
  });

  if (!response.ok) {
    throw new Error(`Firebase update failed with status: ${response.status}`);
  }
}

async function updateTaskInFirebase(userId, taskKey, currentUserTask) {
  let url = `https://join-portfolio-9245f-default-rtdb.europe-west1.firebasedatabase.app/${userId}/tasks/${taskKey}.json`;

  let response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentUserTask),
  });

  if (!response.ok) {
    throw new Error(`Firebase update failed with status: ${response.status}`);
  }
}

/**
 * Deletes a task from Firebase and updates the UI
 * @param {string} taskId - The ID of the task to delete
 */
async function deleteTask(taskId) {
  try {
    // Find the task's Firebase key
    let key = getTaskKeyById(taskId);

    // Delete from Firebase
    await fetchDeleteTaskFromFirebase(key);

    // Remove from local data
    delete currentUser.tasks[key];

    // Update UI
    refreshBoardAfterDeletion();
    showToastMessage("Task deleted");
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

/**
 * Sends a DELETE request to Firebase to remove a task
 * @param {string} taskKey - The task's Firebase key
 * @returns {Promise<void>}
 */
async function fetchDeleteTaskFromFirebase(taskKey) {
  let url = `https://join-portfolio-9245f-default-rtdb.europe-west1.firebasedatabase.app/${currentUser.id}/tasks/${taskKey}.json`;

  let response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(
      `Failed to delete task from Firebase. Status: ${response.status}`
    );
  }
}

/**
 * Updates the board columns and closes the task zoom after deletion
 */
function refreshBoardAfterDeletion() {
  // Re-render all columns
  renderColumn("done", "doneNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");

  // Close the task detail view
  closeTaskZoomSection();
}

/**
 * Main function to render the task zoom view
 * @param {string} taskId - The ID of the task to display
 */
function renderTaskZoomSection(taskId) {
  // Find the task
  let task = findTaskById(taskId);
  if (!task) {
    console.error("Task not found:", taskId);
    return;
  }

  // Update the HTML with task details
  document.getElementById("taskZoomSection").innerHTML = getZoomTaskSection(
    task,
    taskId
  );

  // Render sections with task data
  renderTaskCategoryAndCloseSection(task);
  renderPrioIconImg(task.priority);
  renderAssignedToAndCircleNames(task);
  renderSubtaskZoomSection(task);
}
