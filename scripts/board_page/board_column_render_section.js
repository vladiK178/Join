/**
 * Keeps track of currently open mobile menu
 */
let currentlyOpenMenu = null;

/**
 * Renders task category
 */
function renderTaskCategory(taskId, task, column) {
  const container = document.getElementById(`taskCategory${column}${taskId}`);
  if (!container) return;

  if (task.category?.includes("User Story")) {
    container.innerHTML = `<div class="user-story-container"><span>User Story</span></div>`;
  } else if (task.category?.includes("Technical Task")) {
    container.innerHTML = `<div class="technical-task-container"><span>Technical Task</span></div>`;
  } else {
    container.innerHTML = `<div class="default-task-container"><span>Uncategorized</span></div>`;
  }
}

/**
 * Renders subtask progress bar if subtasks exist.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {Object} task - The task object containing subtasks.
 * @param {string} column - The column identifier (used for DOM element ID).
 */
function renderSubtaskProgress(taskId, task, column) {
  const container = getSubtaskProgressContainer(taskId, column);
  if (!container) return;

  const subtasks = getSubtasksArray(task);
  if (!hasSubtasks(subtasks)) {
    clearSubtaskProgress(container);
    return;
  }

  const completedCount = countCompletedSubtasks(subtasks);
  const progressPercent = calculateProgressPercent(completedCount, subtasks.length);

  renderProgressBar(container, completedCount, subtasks.length, progressPercent);
}

/**
 * Gets the container element for the subtask progress bar.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {string} column - The column identifier.
 * @returns {HTMLElement|null} The container element or null if not found.
 */
function getSubtaskProgressContainer(taskId, column) {
  return document.getElementById(`subtaskBarAndSubtaskSpan${column}${taskId}`);
}

/**
 * Converts subtasks object to an array.
 * 
 * @param {Object} task - The task object.
 * @returns {Array} Array of subtasks or empty array.
 */
function getSubtasksArray(task) {
  return Object.values(task.subtasks || {});
}

/**
 * Checks if there are any subtasks.
 * 
 * @param {Array} subtasks - Array of subtasks.
 * @returns {boolean} True if there is at least one subtask.
 */
function hasSubtasks(subtasks) {
  return subtasks.length > 0;
}

/**
 * Clears the subtask progress container.
 * 
 * @param {HTMLElement} container - The container element.
 */
function clearSubtaskProgress(container) {
  container.innerHTML = "";
}

/**
 * Counts the number of completed subtasks.
 * 
 * @param {Array} subtasks - Array of subtasks.
 * @returns {number} Number of completed subtasks.
 */
function countCompletedSubtasks(subtasks) {
  return subtasks.filter(st => st.checked).length;
}

/**
 * Calculates progress percentage.
 * 
 * @param {number} completed - Number of completed subtasks.
 * @param {number} total - Total number of subtasks.
 * @returns {number} Progress percentage (0-100).
 */
function calculateProgressPercent(completed, total) {
  return (completed / total) * 100;
}

/**
 * Renders the progress bar and subtask count.
 * 
 * @param {HTMLElement} container - The container element.
 * @param {number} completedCount - Completed subtasks count.
 * @param {number} totalCount - Total subtasks count.
 * @param {number} progressPercent - Progress bar width percentage.
 */
function renderProgressBar(container, completedCount, totalCount, progressPercent) {
  container.innerHTML = `
    <div class="subtask-bar">
      <div class="progress" style="width: ${progressPercent}%"></div>
    </div>
    <div class="subtask-span">${completedCount}/${totalCount} Subtask</div>`;
}

/**
 * Opens task detail view
 */
function handleTaskClick(taskId) {
  if (!taskId) return;
  openTaskZoomSection();
  renderTaskZoomSection(taskId);
}

/**
 * Renders contact circles for a task.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {Object} task - The task object containing assigned contacts.
 * @param {string} column - The column identifier (used in element ID).
 */
function renderNameCircleSection(taskId, task, column) {
  const container = getNameCircleContainer(taskId, column);
  if (!container) return;

  const contactList = getContactList(task);
  clearContainer(container);

  renderVisibleContacts(container, taskId, contactList);
  renderExtraContacts(container, contactList);
}

/**
 * Gets the container element for name circles.
 * 
 * @param {string} taskId - The task ID.
 * @param {string} column - The column identifier.
 * @returns {HTMLElement|null} The container element or null.
 */
function getNameCircleContainer(taskId, column) {
  return document.getElementById(`nameCircleSection${column}${taskId}`);
}

/**
 * Converts assigned contacts object into an array of entries.
 * 
 * @param {Object} task - The task object.
 * @returns {Array} Array of [key, contact] entries.
 */
function getContactList(task) {
  return Object.entries(task.assignedTo || {});
}

/**
 * Clears the content of a container element.
 * 
 * @param {HTMLElement} container - The container to clear.
 */
function clearContainer(container) {
  container.innerHTML = "";
}

/**
 * Renders up to the first 3 contact circles.
 * 
 * @param {HTMLElement} container - The container element.
 * @param {string} taskId - The task ID.
 * @param {Array} contactList - Array of contact entries.
 */
function renderVisibleContacts(container, taskId, contactList) {
  const visibleContacts = contactList.slice(0, 3);
  visibleContacts.forEach(([contactKey, contact]) => {
    const initials = getContactInitials(contact);
    const color = getOrAssignColorForTask(taskId, contactKey);
    container.innerHTML += `
      <div class="name-circle-add-section-note" style="background-color: ${color}">
        <span>${initials}</span>
      </div>`;
  });
}

/**
 * Gets the initials of a contact.
 * 
 * @param {Object} contact - The contact object.
 * @returns {string} Initials (first letter of first and last name).
 */
function getContactInitials(contact) {
  const firstInitial = (contact.firstName || "U").charAt(0);
  const lastInitial = (contact.lastName || "U").charAt(0);
  return `${firstInitial}${lastInitial}`;
}

/**
 * Renders the "+X" indicator for additional contacts.
 * 
 * @param {HTMLElement} container - The container element.
 * @param {Array} contactList - Array of contact entries.
 */
function renderExtraContacts(container, contactList) {
  const extraCount = contactList.length - 3;
  if (extraCount > 0) {
    container.innerHTML += `
      <div class="additionalContactNumber">
        <span>+${extraCount}</span>
      </div>`;
  }
}

/**
 * Sets priority icon for task
 */
function renderPrioImg(taskId, task, column) {
  const imgElement = document.getElementById(`prioImg${column}${taskId}`);
  if (!imgElement) return;

  const priority = task.priority || task.prio;

  switch (priority) {
    case "Urgent":
      imgElement.src = "assets/img/urgentArrowNote.svg";
      break;
    case "Medium":
      imgElement.src = "assets/img/Prio media (1).svg";
      break;
    default:
      imgElement.src = "assets/img/lowArrowGreeen.svg";
  }
}

/**
 * Toggles the visibility of the mobile menu for a task.
 * 
 * @param {Event} event - The click event triggering the toggle.
 */
function toggleMenuMobile(event) {
  event.stopPropagation();

  const menuBtn = event.currentTarget;
  const taskId = getTaskIdFromButton(menuBtn);
  const menuContainer = getMenuContainer(taskId);
  if (!menuContainer) return;

  closePreviouslyOpenMenu(menuContainer);
  toggleMenuState(menuContainer, menuBtn);
}

/**
 * Retrieves the task ID from the clicked menu button.
 * 
 * @param {HTMLElement} menuBtn - The menu button element.
 * @returns {string|null} The task ID or null if not found.
 */
function getTaskIdFromButton(menuBtn) {
  return menuBtn.getAttribute("data-task-id");
}

/**
 * Gets the menu container element for a given task ID.
 * 
 * @param {string} taskId - The task ID.
 * @returns {HTMLElement|null} The menu container element or null.
 */
function getMenuContainer(taskId) {
  return document.getElementById(`menuSectionMobile${taskId}`);
}

/**
 * Closes the previously open menu if it is different from the current one.
 * 
 * @param {HTMLElement} currentMenu - The menu container to keep open.
 */
function closePreviouslyOpenMenu(currentMenu) {
  if (currentlyOpenMenu && currentlyOpenMenu !== currentMenu) {
    currentlyOpenMenu.classList.add("d-none");
    resetPreviousMenuButton();
    currentlyOpenMenu = null;
  }
}

/**
 * Resets the CSS classes of the previously open menu button.
 */
function resetPreviousMenuButton() {
  const prevBtn = document.querySelector(".open-menu-mobile");
  if (prevBtn) {
    prevBtn.classList.remove("open-menu-mobile");
    prevBtn.classList.add("closed-menu-mobile");
  }
}

/**
 * Toggles the menu open or closed and updates button styles accordingly.
 * 
 * @param {HTMLElement} menuContainer - The menu container element.
 * @param {HTMLElement} menuBtn - The button that toggles the menu.
 */
function toggleMenuState(menuContainer, menuBtn) {
  const isOpen = !menuContainer.classList.contains("d-none");

  if (isOpen) {
    closeBoardMenu(menuContainer, menuBtn);
  } else {
    openBoardMenu(menuContainer, menuBtn);
  }
}

/**
 * Closes the menu and updates the button style.
 * 
 * @param {HTMLElement} menuContainer - The menu container element.
 * @param {HTMLElement} menuBtn - The button that toggles the menu.
 */
function closeBoardMenu(menuContainer, menuBtn) {
  menuContainer.classList.add("d-none");
  menuBtn.classList.remove("open-menu-mobile");
  menuBtn.classList.add("closed-menu-mobile");
  currentlyOpenMenu = null;
}

/**
 * Opens the menu and updates the button style.
 * 
 * @param {HTMLElement} menuContainer - The menu container element.
 * @param {HTMLElement} menuBtn - The button that toggles the menu.
 */
function openBoardMenu(menuContainer, menuBtn) {
  menuContainer.classList.remove("d-none");
  menuBtn.classList.remove("closed-menu-mobile");
  menuBtn.classList.add("open-menu-mobile");
  currentlyOpenMenu = menuContainer;
}

/**
 * Gets tasks with specific status
 */
function getFilteredTasks(status) {
  return Object.values(currentUser.tasks || {}).filter(
    (task) => task.currentStatus === status
  );
}

/**
 * Gets column DOM element by id
 */
function getColumnElement(columnId) {
  return document.getElementById(columnId);
}

/**
 * Clears column content
 */
function clearColumnContent(column) {
  column.innerHTML = "";
}

/**
 * Shows empty column message
 */
function renderNoTasksNotification(column, status) {
  const formattedStatus = status.replace(/([A-Z])/g, " $1");

  column.innerHTML = `
    <div class="empty-notification">
      <span>No tasks ${formattedStatus}</span>
    </div>`;
}

/**
 * Builds HTML for column tasks
 */
function buildColumnContent(tasks, status) {
  return tasks
    .map((task) => (task.id ? getColumnContent(task, status) : ""))
    .join("");
}

/**
 * Sets up column drag/drop events
 */
function addColumnDragAndDropListeners(column, columnId, status) {
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    showEmptyDashedNote(columnId);
  });

  column.addEventListener("dragleave", () => {
    hideEmptyDashedNote(columnId);
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();
    drop(event, status);
    hideEmptyDashedNote(columnId);
  });
}

/**
 * Renders details for tasks in column
 */
function renderTasksDetails(tasks, status) {
  tasks.forEach((task) => {
    renderTaskCategory(task.id, task, status);
    renderNameCircleSection(task.id, task, status);
    renderSubtaskProgress(task.id, task, status);
    renderPrioImg(task.id, task, status);
  });
}

/**
 * Renders filtered tasks in column
 */
function renderFilteredColumn(tasks, status, columnId) {
  const column = document.getElementById(columnId);
  if (!column) return;

  if (tasks.length === 0) {
    column.innerHTML = `<div class="empty-notification"><span>No tasks found</span></div>`;
    return;
  }

  column.innerHTML = buildColumnContent(tasks, status);
  renderTasksDetails(tasks, status);
}

/**
 * Renders column with tasks
 */
function renderColumn(status, columnId) {
  const tasks = getFilteredTasks(status);
  const column = getColumnElement(columnId);

  if (!column) return;

  clearColumnContent(column);

  if (tasks.length === 0) {
    renderNoTasksNotification(column, status);
  } else {
    column.innerHTML = buildColumnContent(tasks, status);
  }

  addColumnDragAndDropListeners(column, columnId, status);
  renderTasksDetails(tasks, status);
}
