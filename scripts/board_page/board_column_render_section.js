/**
 * Keeps track of currently open mobile menu
 * @type {HTMLElement|null}
 */
let currentlyOpenMenu = null;

/**
 * Renders task category label
 * @param {string} taskId - Task identifier
 * @param {Object} task - Task data
 * @param {string} column - Column status
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
 * Renders subtask progress bar
 * @param {string} taskId - Task identifier
 * @param {Object} task - Task data
 * @param {string} column - Column status
 */
function renderSubtaskProgress(taskId, task, column) {
  const container = document.getElementById(
    `subtaskBarAndSubtaskSpan${column}${taskId}`
  );
  if (!container) return;

  const subtasks = Object.values(task.subtasks || {});
  const completedCount = subtasks.filter((st) => st.checked).length;
  const totalCount = subtasks.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  container.innerHTML = `
    <div class="subtask-bar">
      <div class="progress" style="width: ${progressPercent}%"></div>
    </div>
    <div class="subtask-span">${completedCount}/${totalCount} Subtask</div>`;
}

/**
 * Opens task detail view
 * @param {string} taskId - Task to view
 */
function handleTaskClick(taskId) {
  if (!taskId) return;
  openTaskZoomSection();
  renderTaskZoomSection(taskId);
}

/**
 * Renders contact circles for task
 * @param {string} taskId - Task identifier
 * @param {Object} task - Task data
 * @param {string} column - Column status
 */
function renderNameCircleSection(taskId, task, column) {
  const container = document.getElementById(
    `nameCircleSection${column}${taskId}`
  );
  if (!container) return;

  const contacts = task.assignedTo || {};
  const contactList = Object.entries(contacts);

  container.innerHTML = "";

  // Show first 3 contacts
  const visibleContacts = contactList.slice(0, 3);
  visibleContacts.forEach(([contactKey, contact]) => {
    const firstInitial = (contact.firstName || "U").charAt(0);
    const lastInitial = (contact.lastName || "U").charAt(0);
    const color = getOrAssignColorForTask(taskId, contactKey);

    container.innerHTML += `
      <div class="name-circle-add-section-note" style="background-color: ${color}">
        <span>${firstInitial}${lastInitial}</span>
      </div>`;
  });

  // Show +X indicator if more contacts
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
 * @param {string} taskId - Task identifier
 * @param {Object} task - Task data
 * @param {string} column - Column status
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
 * Toggles mobile menu visibility
 * @param {Event} event - Click event
 */
function toggleMenuMobile(event) {
  event.stopPropagation();

  const menuBtn = event.currentTarget;
  const taskId = menuBtn.getAttribute("data-task-id");
  const menuContainer = document.getElementById(`menuSectionMobile${taskId}`);

  if (!menuContainer) return;

  // Close previously open menu
  if (currentlyOpenMenu && currentlyOpenMenu !== menuContainer) {
    currentlyOpenMenu.classList.add("d-none");

    const prevBtn = document.querySelector(".open-menu-mobile");
    if (prevBtn) {
      prevBtn.classList.remove("open-menu-mobile");
      prevBtn.classList.add("closed-menu-mobile");
    }
  }

  const isMenuOpen = !menuContainer.classList.contains("d-none");

  if (isMenuOpen) {
    // Close menu
    menuContainer.classList.add("d-none");
    menuBtn.classList.remove("open-menu-mobile");
    menuBtn.classList.add("closed-menu-mobile");
    currentlyOpenMenu = null;
  } else {
    // Open menu
    menuContainer.classList.remove("d-none");
    menuBtn.classList.remove("closed-menu-mobile");
    menuBtn.classList.add("open-menu-mobile");
    currentlyOpenMenu = menuContainer;
  }
}

/**
 * Gets tasks with specific status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered tasks
 */
function getFilteredTasks(status) {
  return Object.values(currentUser.tasks || {}).filter(
    (task) => task.currentStatus === status
  );
}

/**
 * Safely gets column DOM element
 * @param {string} columnId - Column identifier
 * @returns {HTMLElement|null} Column element
 */
function getColumnElement(columnId) {
  return document.getElementById(columnId);
}

/**
 * Clears column content
 * @param {HTMLElement} column - Column to clear
 */
function clearColumnContent(column) {
  column.innerHTML = "";
}

/**
 * Shows empty column message
 * @param {HTMLElement} column - Column element
 * @param {string} status - Status name
 */
function renderNoTasksNotification(column, status) {
  // Format status for display (add spaces before capitals)
  const formattedStatus = status.replace(/([A-Z])/g, " $1");

  column.innerHTML = `
    <div class="empty-notification">
      <span>No tasks ${formattedStatus}</span>
    </div>`;
}

/**
 * Generates HTML for all tasks in column
 * @param {Array} tasks - Tasks to render
 * @param {string} status - Column status
 * @returns {string} Combined HTML
 */
function buildColumnContent(tasks, status) {
  return tasks
    .map((task) => (task.id ? getColumnContent(task, status) : ""))
    .join("");
}

/**
 * Sets up column drag/drop events
 * @param {HTMLElement} column - Column element
 * @param {string} columnId - Column ID
 * @param {string} status - Column status
 */
function addColumnDragAndDropListeners(column, columnId, status) {
  // Dragover event
  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    showEmptyDashedNote(columnId);
  });

  // Dragleave event
  column.addEventListener("dragleave", () => {
    hideEmptyDashedNote(columnId);
  });

  // Drop event
  column.addEventListener("drop", (event) => {
    event.preventDefault();
    drop(event, status);
    hideEmptyDashedNote(columnId);
  });
}

/**
 * Renders task details within column
 * @param {Array} tasks - Tasks to render
 * @param {string} status - Column status
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
 * @param {Array} tasks - Tasks to display
 * @param {string} status - Column status
 * @param {string} columnId - Column DOM element ID
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
 * @param {string} status - Column status
 * @param {string} columnId - Column DOM ID
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
