/**
 * Variable to keep track of which menu is currently open in mobile view.
 * @type {HTMLElement|null}
 */
let currentlyOpenMenu = null;

/**
 * Renders the category label (User Story or Technical Task) for a task
 *
 * @param {string} taskId - The ID of the task
 * @param {Object} task - The task object with all data
 * @param {string} column - The column status where the task is located
 */
function renderTaskCategory(taskId, task, column) {
  // Get the container element for this task's category
  const categoryContainer = document.getElementById(
    `taskCategory${column}${taskId}`
  );

  // Don't proceed if container not found
  if (!categoryContainer) {
    return;
  }

  // Choose which category to display based on task data
  if (task.category && task.category.includes("User Story")) {
    // User Story category
    categoryContainer.innerHTML = `<div class="user-story-container"><span>User Story</span></div>`;
  } else if (task.category && task.category.includes("Technical Task")) {
    // Technical Task category
    categoryContainer.innerHTML = `<div class="technical-task-container"><span>Technical Task</span></div>`;
  } else {
    // Default fallback if no valid category
    categoryContainer.innerHTML = `<div class="default-task-container"><span>Uncategorized</span></div>`;
  }
}

/**
 * Creates and updates the subtask progress bar and count
 *
 * @param {string} taskId - The ID of the task
 * @param {Object} task - The task object containing subtasks
 * @param {string} column - The column status where the task is shown
 */
function renderSubtaskProgress(taskId, task, column) {
  // Find the container for the subtask progress
  const subtaskContainer = document.getElementById(
    `subtaskBarAndSubtaskSpan${column}${taskId}`
  );

  // Get all subtasks and count completed ones
  const allSubtasks = Object.values(task.subtasks || {});
  const completedSubtasks = allSubtasks.filter((subtask) => subtask.checked);

  // Calculate percentage for progress bar
  let progressPercentage = 0;
  if (allSubtasks.length > 0) {
    progressPercentage = (completedSubtasks.length / allSubtasks.length) * 100;
  }

  // Update the HTML with progress bar and count
  subtaskContainer.innerHTML = `
    <div class="subtask-bar">
      <div class="progress" style="width: ${progressPercentage}%"></div>
    </div>
    <div class="subtask-span">${completedSubtasks.length}/${allSubtasks.length} Subtask</div>`;
}

/**
 * Opens the detailed view when clicking on a task
 *
 * @param {string} taskId - The ID of the clicked task
 */
function handleTaskClick(taskId) {
  // Skip if no valid taskId provided
  if (!taskId) {
    return;
  }

  // Open the zoom section and render task details
  openTaskZoomSection();
  renderTaskZoomSection(taskId);
}

/**
 * Renders the profile circles for each assigned contact
 *
 * @param {string} taskId - The ID of the task
 * @param {Object} task - The task object with assigned contacts
 * @param {string} column - The column status where the task is shown
 */
function renderNameCircleSection(taskId, task, column) {
  // Find the container for contact circles
  const circleContainer = document.getElementById(
    `nameCircleSection${column}${taskId}`
  );

  // Don't proceed if container not found
  if (!circleContainer) {
    return;
  }

  // Get assigned contacts data
  const contacts = task.assignedTo || {};
  const contactsList = Object.entries(contacts);

  // Clear current content
  circleContainer.innerHTML = "";

  // Show first 3 contacts with their initials
  const firstThreeContacts = contactsList.slice(0, 3);
  firstThreeContacts.forEach(([contactKey, contactData]) => {
    // Get initials, with "U" as fallback if name parts missing
    const firstInitial = (contactData.firstName || "U").charAt(0);
    const lastInitial = (contactData.lastName || "U").charAt(0);
    const initials = `${firstInitial}${lastInitial}`;

    // Get a consistent color for this contact
    const contactColor = getOrAssignColorForTask(taskId, contactKey);

    // Add contact circle to the container
    circleContainer.innerHTML += `
      <div class="name-circle-add-section-note" style="background-color: ${contactColor}">
        <span>${initials}</span>
      </div>`;
  });

  // If more than 3 contacts, show a +X indicator
  const extraContactsCount = contactsList.length - 3;
  if (extraContactsCount > 0) {
    circleContainer.innerHTML += `
      <div class="additionalContactNumber">
        <span>+${extraContactsCount}</span>
      </div>`;
  }
}

/**
 * Sets the correct priority icon for a task
 *
 * @param {string} taskId - The ID of the task
 * @param {Object} task - The task with priority information
 * @param {string} column - The column status where the task is shown
 */
function renderPrioImg(taskId, task, column) {
  // Get the priority image element
  const priorityImage = document.getElementById(`prioImg${column}${taskId}`);

  // Exit if image element not found
  if (!priorityImage) {
    return;
  }

  // Get priority from either priority or prio property
  const taskPriority = task.priority || task.prio;

  // Set the correct image source based on priority
  if (taskPriority === "Urgent") {
    priorityImage.src = "assets/img/urgentArrowNote.svg";
  } else if (taskPriority === "Medium") {
    priorityImage.src = "assets/img/Prio media (1).svg";
  } else {
    priorityImage.src = "assets/img/lowArrowGreeen.svg";
  }
}

/**
 * Handles opening and closing the mobile menu for tasks
 *
 * @param {Event} event - The click event from the menu button
 */
function toggleMenuMobile(event) {
  // Prevent click from reaching underlying elements
  event.stopPropagation();

  // Get clicked menu button and its associated task
  const menuButton = event.currentTarget;
  const taskId = menuButton.getAttribute("data-task-id");

  // Find the menu container for this task
  const menuContainer = document.getElementById(`menuSectionMobile${taskId}`);

  // Exit if menu container not found
  if (!menuContainer) {
    return;
  }

  // Close previously open menu if different from current one
  if (currentlyOpenMenu && currentlyOpenMenu !== menuContainer) {
    // Hide the previously open menu
    currentlyOpenMenu.classList.add("d-none");

    // Find the button for the previously open menu and reset its style
    // The ?. operator is used to safely access classList if the element exists
    const previousButton = document.querySelector(".open-menu-mobile");
    if (previousButton) {
      previousButton.classList.remove("open-menu-mobile");
      previousButton.classList.add("closed-menu-mobile");
    }
  }

  // Check if current menu is already open
  const isMenuOpen = !menuContainer.classList.contains("d-none");

  if (isMenuOpen) {
    // Close the current menu
    menuContainer.classList.add("d-none");
    menuButton.classList.remove("open-menu-mobile");
    menuButton.classList.add("closed-menu-mobile");
    currentlyOpenMenu = null;
  } else {
    // Open the current menu
    menuContainer.classList.remove("d-none");
    menuButton.classList.remove("closed-menu-mobile");
    menuButton.classList.add("open-menu-mobile");
    currentlyOpenMenu = menuContainer;
  }
}

/**
 * Extracts tasks with a specific status from all user tasks
 *
 * @param {string} status - The status to filter by (e.g., "toDo")
 * @returns {Array} - Array of tasks with matching status
 */
function getFilteredTasks(status) {
  // Convert tasks object to array, defaulting to empty object if missing
  const allTasks = Object.values(currentUser.tasks || {});

  // Filter tasks by the requested status
  const matchingTasks = allTasks.filter(
    (task) => task.currentStatus === status
  );

  return matchingTasks;
}

/**
 * Gets a DOM element for a board column by its ID
 *
 * @param {string} columnId - The ID of the column element
 * @returns {HTMLElement|null} - The column element or null if not found
 */
function getColumnElement(columnId) {
  const columnElement = document.getElementById(columnId);

  // Return null if element not found
  if (!columnElement) {
    return null;
  }

  return columnElement;
}

/**
 * Empties a column's content
 *
 * @param {HTMLElement} column - The column element to clear
 */
function clearColumnContent(column) {
  // Remove all HTML content from the column
  column.innerHTML = "";
}

/**
 * Shows a message when a column has no tasks
 *
 * @param {HTMLElement} column - The column element
 * @param {string} status - The status name to display in the message
 */
function renderNoTasksNotification(column, status) {
  // Format the status with spaces before capital letters
  const formattedStatus = status.replace(/([A-Z])/g, " $1");

  // Add the empty notification to the column
  column.innerHTML = `
    <div class="empty-notification">
      <span>No tasks ${formattedStatus}</span>
    </div>`;
}

/**
 * Creates HTML for all tasks in a column
 *
 * @param {Array} tasks - List of task objects to render
 * @param {string} status - The column status these tasks belong to
 * @returns {string} - Combined HTML string for all tasks
 */
function buildColumnContent(tasks, status) {
  let allTasksHtml = "";

  // Create HTML for each task in the list
  tasks.forEach((task) => {
    // Skip tasks without an ID
    if (!task.id) {
      return;
    }

    // Add this task's HTML to the combined string
    // Using getColumnContent function which should be defined elsewhere
    allTasksHtml += getColumnContent(task, status);
  });

  return allTasksHtml;
}

/**
 * Sets up drag and drop event handlers for a column
 *
 * @param {HTMLElement} column - The column element
 * @param {string} columnId - The ID of the column
 * @param {string} status - The status this column represents
 */
function addColumnDragAndDropListeners(column, columnId, status) {
  // When dragging over the column
  column.addEventListener("dragover", (event) => {
    // Allow dropping by preventing default
    event.preventDefault();

    // Show a dashed outline placeholder
    showEmptyDashedNote(columnId);
  });

  // When dragging out of the column
  column.addEventListener("dragleave", () => {
    // Remove the dashed outline placeholder
    hideEmptyDashedNote(columnId);
  });

  // When dropping onto the column
  column.addEventListener("drop", (event) => {
    // Prevent default browser behavior
    event.preventDefault();

    // Handle the drop operation (using drop function defined elsewhere)
    drop(event, status);

    // Remove the dashed outline placeholder
    hideEmptyDashedNote(columnId);
  });
}

/**
 * Renders additional details for each task in a column
 *
 * @param {Array} tasks - List of task objects
 * @param {string} status - The column status these tasks belong to
 */
function renderTasksDetails(tasks, status) {
  // For each task, render all its UI components
  tasks.forEach((task) => {
    renderTaskCategory(task.id, task, status);
    renderNameCircleSection(task.id, task, status);
    renderSubtaskProgress(task.id, task, status);
    renderPrioImg(task.id, task, status);
  });
}

/**
 * Main function to render a column with its tasks
 *
 * @param {string} status - The status for tasks in this column
 * @param {string} columnId - The HTML ID of the column container
 */
function renderColumn(status, columnId) {
  // Get tasks for this status
  const tasksForColumn = getFilteredTasks(status);

  // Get the column DOM element
  const columnElement = getColumnElement(columnId);

  // Exit if column element not found
  if (!columnElement) return;

  // Clear existing content
  clearColumnContent(columnElement);

  // Check if there are any tasks for this column
  if (tasksForColumn.length === 0) {
    // Show empty message if no tasks
    renderNoTasksNotification(columnElement, status);
  } else {
    // Create and add task HTML content
    const columnHtml = buildColumnContent(tasksForColumn, status);
    columnElement.innerHTML = columnHtml;
  }

  // Set up drag and drop functionality
  addColumnDragAndDropListeners(columnElement, columnId, status);

  // Render all task details (category, assigned people, etc.)
  renderTasksDetails(tasksForColumn, status);
}
