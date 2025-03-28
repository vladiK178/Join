/**
 * Holds the currently open menu for mobile toggling.
 * @type {HTMLElement|null}
 */
let currentlyOpenMenu = null;


/**
 * Renders the category label (e.g., "User Story" or "Technical Task") for a task.
 * 
 * @param {string} taskId - The unique identifier for the task.
 * @param {Object} task - The task object containing category information.
 * @param {string} column - The name or status of the column where the task is displayed.
 */
function renderTaskCategory(taskId, task, column) {
  const content = document.getElementById(`taskCategory${column}${taskId}`);
  if (!content) {
    return;
  }

  if (task.category && task.category.includes("User Story")) {
    content.innerHTML = `<div class="user-story-container"><span>User Story</span></div>`;
  } else if (task.category && task.category.includes("Technical Task")) {
    content.innerHTML = `<div class="technical-task-container"><span>Technical Task</span></div>`;
  } else {
    content.innerHTML = `<div class="default-task-container"><span>Uncategorized</span></div>`;
  }
}


 /**
  * Renders the subtask progress bar and subtask count for a task.
  * 
  * @param {string} taskId - The unique identifier for the task.
  * @param {Object} task - The task object containing subtask information.
  * @param {string} column - The name or status of the column where the task is displayed.
  */
function renderSubtaskProgress(taskId, task, column) {
  const subtaskSectionComplete = document.getElementById(`subtaskBarAndSubtaskSpan${column}${taskId}`);
  const totalSubtasks = Object.values(task.subtasks || {});
  const checkedSubtasks = totalSubtasks.filter(subtask => subtask.checked);

  const progressPercent = totalSubtasks.length
    ? (checkedSubtasks.length / totalSubtasks.length) * 100
    : 0;

  subtaskSectionComplete.innerHTML = `
    <div class="subtask-bar">
      <div class="progress" style="width: ${progressPercent}%"></div>
    </div>
    <div class="subtask-span">${checkedSubtasks.length}/${totalSubtasks.length} Subtask</div>`;
}


 /**
  * Handles a click on a task to open its "zoom" view.
  * 
  * @param {string} taskId - The unique identifier for the task.
  */
function handleTaskClick(taskId) {
  if (!taskId) {
    return;
  }
  openTaskZoomSection();
  renderTaskZoomSection(taskId);
}


 /**
  * Renders the circle of initials for each contact assigned to a task.
  * 
  * @param {string} taskId - The unique identifier for the task.
  * @param {Object} task - The task object containing assigned contacts.
  * @param {string} column - The name or status of the column where the task is displayed.
  */
function renderNameCircleSection(taskId, task, column) {
  const nameCircleSection = document.getElementById(`nameCircleSection${column}${taskId}`);
  if (!nameCircleSection) {
    return;
  }

  const assignedTo = task.assignedTo || {};
  const contactsArray = Object.entries(assignedTo);
  nameCircleSection.innerHTML = "";

  // Display up to 3 contacts
  contactsArray.slice(0, 3).forEach(([key, contact]) => {
    const initials = `${(contact.firstName || "U").charAt(0)}${(contact.lastName || "U").charAt(0)}`;
    const color = getOrAssignColorForTask(taskId, key);
    nameCircleSection.innerHTML += `
      <div class="name-circle-add-section-note" style="background-color: ${color}">
        <span>${initials}</span>
      </div>`;
  });

  // If more than 3 contacts, display the additional count
  const additionalContacts = contactsArray.length - 3;
  if (additionalContacts > 0) {
    nameCircleSection.innerHTML += `
      <div class="additionalContactNumber">
        <span>+${additionalContacts}</span>
      </div>`;
  }
}


 /**
  * Renders the priority icon of a task (e.g., "Urgent", "Medium", or "Low").
  * 
  * @param {string} taskId - The unique identifier for the task.
  * @param {Object} task - The task object containing priority information.
  * @param {string} column - The name or status of the column where the task is displayed.
  */
function renderPrioImg(taskId, task, column) {
  const prioImg = document.getElementById(`prioImg${column}${taskId}`);
  if (!prioImg) {
    return;
  }

  const priorityValue = task.priority || task.prio;
  switch (priorityValue) {
    case "Urgent":
      prioImg.src = "assets/img/urgentArrowNote.svg";
      break;
    case "Medium":
      prioImg.src = "assets/img/Prio media (1).svg";
      break;
    case "Low":
      prioImg.src = "assets/img/lowArrowGreeen.svg";
      break;
  }
}


 /**
  * Toggles the mobile menu for a particular task, closing any other open menus.
  * 
  * @param {Event} event - The click event triggered by the mobile menu icon.
  */
function toggleMenuMobile(event) {
  event.stopPropagation(); 

  const noteMenuMobile = event.currentTarget;
  const taskId = noteMenuMobile.getAttribute('data-task-id');
  const menuSection = document.getElementById(`menuSectionMobile${taskId}`);

  if (!menuSection) {
    return;
  }

  // Close any previously open menu
  if (currentlyOpenMenu && currentlyOpenMenu !== menuSection) {
    currentlyOpenMenu.classList.add('d-none');
    document.querySelector('.open-menu-mobile')?.classList.replace('open-menu-mobile', 'closed-menu-mobile');
  }

  // Toggle current menu
  const isMenuOpen = !menuSection.classList.contains('d-none');
  if (isMenuOpen) {
    menuSection.classList.add('d-none');
    noteMenuMobile.classList.remove('open-menu-mobile');
    noteMenuMobile.classList.add('closed-menu-mobile');
    currentlyOpenMenu = null;
  } else {
    menuSection.classList.remove('d-none');
    noteMenuMobile.classList.remove('closed-menu-mobile');
    noteMenuMobile.classList.add('open-menu-mobile');
    currentlyOpenMenu = menuSection;
  }
}


 /**
  * Retrieves and filters the tasks by their current status.
  * 
  * @param {string} status - The status by which to filter tasks (e.g., "ToDo", "InProgress").
  * @returns {Array} The list of filtered tasks.
  */
function getFilteredTasks(status) {
  const tasksArray = Object.values(currentUser.tasks || {});
  return tasksArray.filter(task => task.currentStatus === status);
}


 /**
  * Gets the DOM element for the specified column ID.
  * 
  * @param {string} columnId - The ID of the target column element.
  * @returns {HTMLElement|null} The column element, or null if not found.
  */
function getColumnElement(columnId) {
  const column = document.getElementById(columnId);
  if (!column) {
    return null;
  }
  return column;
}


 /**
  * Clears all inner HTML of the given column element.
  * 
  * @param {HTMLElement} column - The DOM element representing the column.
  */
function clearColumnContent(column) {
  column.innerHTML = "";
}


 /**
  * Renders a notification indicating there are no tasks for the given status.
  * 
  * @param {HTMLElement} column - The DOM element representing the column.
  * @param {string} status - The status indicating which tasks were expected.
  */
function renderNoTasksNotification(column, status) {
  column.innerHTML = `
    <div class="empty-notification">
      <span>No tasks ${status.replace(/([A-Z])/g, ' $1')}</span>
    </div>`;
}


 /**
  * Builds the HTML content for all tasks in a filtered list.
  * 
  * @param {Array} tasks - The list of task objects.
  * @param {string} status - The current status of these tasks.
  * @returns {string} A concatenated string of HTML for all tasks.
  */
function buildColumnContent(tasks, status) {
  let columnContent = "";
  tasks.forEach(task => {
    if (!task.id) {
      return;
    }
    // Assumes getColumnContent is a globally available function
    columnContent += getColumnContent(task, status);
  });
  return columnContent;
}


 /**
  * Adds drag-and-drop event listeners to the column element.
  * 
  * @param {HTMLElement} column - The DOM element representing the column.
  * @param {string} columnId - The ID of the column element.
  * @param {string} status - The current status of the tasks in this column.
  */
function addColumnDragAndDropListeners(column, columnId, status) {
  column.addEventListener('dragover', (event) => {
    event.preventDefault();
    showEmptyDashedNote(columnId);
  });

  column.addEventListener('dragleave', () => {
    hideEmptyDashedNote(columnId);
  });

  column.addEventListener('drop', (event) => {
    event.preventDefault();
    // Assumes drop is a globally available function
    drop(event, status);
    hideEmptyDashedNote(columnId);
  });
}


 /**
  * Renders details (category, names, subtasks, priority) for each task in the list.
  * 
  * @param {Array} tasks - The list of task objects.
  * @param {string} status - The current status of these tasks.
  */
function renderTasksDetails(tasks, status) {
  tasks.forEach(task => {
    renderTaskCategory(task.id, task, status);
    renderNameCircleSection(task.id, task, status);
    renderSubtaskProgress(task.id, task, status);
    renderPrioImg(task.id, task, status);
  });
}


 /**
  * Orchestrates rendering of tasks in the given column based on the specified status.
  * 
  * @param {string} status - The status of the tasks to be rendered (e.g., "ToDo", "InProgress", etc.).
  * @param {string} columnId - The ID of the column element where tasks will be displayed.
  */
function renderColumn(status, columnId) {
  const filteredTasks = getFilteredTasks(status);
  const column = getColumnElement(columnId);
  if (!column) return;

  clearColumnContent(column);

  if (filteredTasks.length === 0) {
    renderNoTasksNotification(column, status);
  } else {
    const content = buildColumnContent(filteredTasks, status);
    column.innerHTML = content;
  }

  addColumnDragAndDropListeners(column, columnId, status);
  renderTasksDetails(filteredTasks, status);
}