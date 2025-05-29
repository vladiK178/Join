
(function syncUserIdFromUrl() {
  const fromUrl = getQueryParam("user");
  if (fromUrl) {
    localStorage.setItem("currentUserId", fromUrl);
  }
})();

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/** 
 * Global state variables
 */
let currentUser;
let nextTaskId = 0;
const assignedColors = {};
let colorMap = {};
let taskColorMap = {};
let currentDraggedTaskId = null;
let originalColumnId = null;

/**
 * Gets or assigns color for contact
 * @param {string} contactKey - Contact identifier
 * @returns {string} Color code
 */
function getOrAssignColor(contactKey) {
  if (!assignedColors[contactKey]) {
    assignedColors[contactKey] = getRandomColorFromPalette();
  }
  return assignedColors[contactKey];
}

/**
 * Gets or assigns color for task-contact pair
 * @param {string} taskId - Task identifier
 * @param {string} contactKey - Contact identifier
 * @returns {string} Color code
 */
function getOrAssignColorForTask(taskId, contactKey) {
  const key = `${taskId}_${contactKey}`;
  if (!taskColorMap[key]) {
    taskColorMap[key] = getRandomColorFromPalette();
  }
  return taskColorMap[key];
}

/**
 * Returns random color from palette
 * @returns {string} Hex color code
 */
function getRandomColorFromPalette() {
  const palette = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", 
    "#33FFF5", "#FF8C33", "#FFD433", "#A8FF33", "#8C33FF",
    "#FFB6C1", "#FF69B4", "#FF1493", "#C71585", "#DB7093"
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}

/**
 * Initializes board page
 */
async function initBoardPage() {
  try {
    await loadUserAndSetCurrent();
    
    if (!checkCurrentUser()) return;
    
    setupUIComponents();
    setupBoardFunctionality();
    checkForTaskAddSuccess();
  } catch (error) {
    console.error("Error during board initialization:", error);
    handleInitError();
  }
}

/**
 * Sets up UI components
 */
function setupUIComponents() {
  renderAddTaskContent();
  renderBoardUI();
}

/**
 * Sets up board functionality
 */
function setupBoardFunctionality() {
  setUpBoardColumns();
  addSubtaskEnterListener();
  initOutsideClickListener();
  attachMobileMenuEventListeners();
}

/**
 * Checks for task success parameter in URL
 */
function checkForTaskAddSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tasksuccess') === 'true') {
    showSuccessToast('Task successfully added');

    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
}

/**
 * Shows success message toast
 * @param {string} message - Message to display
 */
function showSuccessToast(message) {
  if (document.getElementById('successToast')) return;
  
  const toast = document.createElement('div');
  toast.id = 'successToast';
  toast.className = 'success-toast';
  toast.innerHTML = `
    <div class="success-icon-section">
      <span>${message}</span>
      <img src="./assets/img/check.svg" alt="">
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 2250);
}

/**
 * Loads user data from storage
 */
async function loadUserAndSetCurrent() {
  const userId = localStorage.getItem("currentUserId");
  
  if (!userId) {
    redirectToLogin("No user ID found");
    return;
  }
  
  await getUsersData();
  currentUser = users[userId];
  
  if (!currentUser) {
    localStorage.clear();
    redirectToLogin("User data not found");
    return;
  }
  
  localStorage.setItem("currentUserId", userId);
}

/**
 * Redirects to login page
 * @param {string} reason - Reason for redirect
 */
function redirectToLogin(reason) {
  console.error(reason + " - redirecting to login");
  window.location.href = "index.html";
}

/**
 * Verifies current user exists
 * @returns {boolean} User validity
 */
function checkCurrentUser() {
  if (!currentUser) {
    redirectToLogin("User not found");
    return false;
  }
  return true;
}

/**
 * Sets up UI components
 */
function renderBoardUI() {
  renderDesktopTemplate();
  renderBoardContent();
  changeToChosenBoardSection();
  renderNameCircles();
  renderAssignedToSection();
}

/**
 * Creates board columns with tasks
 */
function setUpBoardColumns() {
  const columns = [
    {status: "toDo", id: "toDoNotes"},
    {status: "inProgress", id: "inProgressNotes"},
    {status: "awaitFeedback", id: "awaitFeedbackNotes"},
    {status: "done", id: "doneNotes"}
  ];
  
  columns.forEach(col => renderColumn(col.status, col.id));
}

/**
 * Sets up subtask keyboard events
 */
function addSubtaskEnterListener() {
  const subtaskInput = document.getElementById('subtask');
  if (subtaskInput) {
    subtaskInput.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        addSubtask();
        evt.preventDefault();
      }
    });
  }
}

let userCircle;

/**
 * Loads desktop template
 */
function renderDesktopTemplate() {
  const container = document.getElementById("templateSection");
  if (container) {
    container.innerHTML = getDesktopTemplate(renderCurrentUserCircle());
  }
}

function renderCurrentUserCircle() {
  const currentUserFirstName = localStorage.getItem("firstName");
  const currentUserLastName = localStorage.getItem("lastName");
  const userCircle =
    currentUserFirstName[0].toUpperCase() +
    currentUserLastName[0].toUpperCase();
  return userCircle;
}

/**
 * Adds board content to page
 */
function renderBoardContent() {
  const container = document.getElementById("newContentSection");
  if (container) {
    container.innerHTML += getBoardContent(renderCurrentUserCircle());
  }
}

/**
 * Highlights board section in menu
 */
function changeToChosenBoardSection() {
  const summarySection = document.getElementById("summary-section");
  const summaryImg = document.getElementById("summary-img");
  
  if (summarySection && summaryImg) {
    summarySection.classList.remove("chosen-section");
    summaryImg.classList.remove("summary-img-chosen");
    summaryImg.classList.add("summary-img");
  }

  const boardSection = document.getElementById("board-section");
  const boardImg = document.getElementById("board-img");
  
  if (boardSection && boardImg) {
    boardSection.classList.add("chosen-section");
    boardImg.classList.remove("board-img");
    boardImg.classList.add("board-img-chosen");
  }
}

/**
 * Filters tasks by search term
 * @param {Event} event - Input event
 */
function filterTasks(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  
  if (!searchTerm) {
    renderAllColumns();
    return;
  }

  const filteredTasks = Object.values(currentUser.tasks || {}).filter(task => {
    const titleMatch = task.title?.toLowerCase().includes(searchTerm);
    const descMatch = task.taskDescription?.toLowerCase().includes(searchTerm);
    return titleMatch || descMatch;
  });

  clearAllColumns();
  renderFilteredTasks(filteredTasks);
}

/**
 * Clears all column content
 */
function clearAllColumns() {
  ["toDoNotes", "inProgressNotes", "awaitFeedbackNotes", "doneNotes"]
    .forEach(id => {
      const column = document.getElementById(id);
      if (column) column.innerHTML = "";
    });
}

/**
 * Renders tasks filtered by their status. If no tasks match, shows an empty message.
 * 
 * @param {Array<Object>} tasks - Array of task objects to render.
 * Each task should have a `currentStatus` property (e.g., "toDo", "inProgress", etc.).
 */
function renderFilteredTasks(tasks) {
  const byStatus = groupTasksByStatus(tasks);
  const totalTasks = Object.values(byStatus).flat().length;

  if (totalTasks === 0) {
    showEmptyMessages();
    return;
  }

  renderAllFilteredColumns(byStatus);
}

/**
 * Groups tasks by their current status into an object with status keys.
 * 
 * @param {Array<Object>} tasks - Array of task objects with a `currentStatus` property.
 * @returns {Object} An object with keys for each status and arrays of corresponding tasks.
 */
function groupTasksByStatus(tasks) {
  return {
    toDo: tasks.filter(t => t.currentStatus === "toDo"),
    inProgress: tasks.filter(t => t.currentStatus === "inProgress"),
    awaitFeedback: tasks.filter(t => t.currentStatus === "awaitFeedback"),
    done: tasks.filter(t => t.currentStatus === "done")
  };
}

/**
 * Displays an empty message in each task column if no tasks are found.
 * Assumes that HTML elements with IDs for each column ("toDoNotes", etc.) exist.
 */
function showEmptyMessages() {
  const ids = ["toDoNotes", "inProgressNotes", "awaitFeedbackNotes", "doneNotes"];
  ids.forEach(id => {
    const column = document.getElementById(id);
    if (column) {
      column.innerHTML = `<div class="empty-notification"><span>No tasks found</span></div>`;
    }
  });
}

/**
 * Renders all columns with their corresponding filtered tasks.
 * 
 * @param {Object} byStatus - Object containing arrays of tasks keyed by their status.
 */
function renderAllFilteredColumns(byStatus) {
  renderFilteredColumn(byStatus.toDo, "toDo", "toDoNotes");
  renderFilteredColumn(byStatus.inProgress, "inProgress", "inProgressNotes");
  renderFilteredColumn(byStatus.awaitFeedback, "awaitFeedback", "awaitFeedbackNotes");
  renderFilteredColumn(byStatus.done, "done", "doneNotes");
}

/**
 * Renders all columns from scratch
 */
function renderAllColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}

/**
 * Attaches mobile menu handlers
 */
function attachMobileMenuEventListeners() {
  const menuOptions = document.querySelectorAll('.menu-mobile .menu-option');
  menuOptions.forEach(option => {
    option.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      
      const taskId = option.getAttribute('data-task-id');
      const newCol = option.getAttribute('data-column');
      
      if (taskId && newCol) {
        moveTaskToNewColumn(taskId, newCol);
      }
    });
  });
}

/**
 * Moves a task to a new column and updates data and UI accordingly.
 * 
 * @param {string} taskId - The ID of the task to move.
 * @param {string} newColumn - The target column status.
 */
async function moveTaskToNewColumn(taskId, newColumn) {
  const menu = getMobileMenu(taskId);
  if (!menu) return;

  const taskKey = findTaskKey(taskId);
  if (!taskKey) return;

  try {
    await processTaskMove(taskKey, taskId, newColumn, menu);
  } catch (error) {
    handleTaskMoveError(error);
  }
}

/**
 * Gets the mobile menu element for the given task ID.
 * 
 * @param {string} taskId - The ID of the task.
 * @returns {HTMLElement|null} The menu element or null if not found.
 */
function getMobileMenu(taskId) {
  return document.getElementById(`menuSectionMobile${taskId}`);
}

/**
 * Finds the task key in the current user's tasks based on the task ID.
 * 
 * @param {string} taskId - The ID of the task to find.
 * @returns {string|undefined} The key of the task or undefined if not found.
 */
function findTaskKey(taskId) {
  return Object.keys(currentUser.tasks).find(
    key => currentUser.tasks[key].id === taskId
  );
}

/**
 * Handles the logic for updating task status, UI, and persistence.
 * 
 * @param {string} taskKey - The key of the task.
 * @param {string} taskId - The ID of the task.
 * @param {string} newColumn - The new column/status.
 * @param {HTMLElement} menu - The mobile menu element.
 */
async function processTaskMove(taskKey, taskId, newColumn, menu) {
  const oldColumn = currentUser.tasks[taskKey].currentStatus;

  if (oldColumn === newColumn) {
    menu.classList.add("d-none");
    return;
  }

  currentUser.tasks[taskKey].currentStatus = newColumn;
  await updateTaskColumnInDatabase(currentUser.id, taskKey, newColumn);
  renderAllColumns();
  menu.classList.add("d-none");
  showSuccessToast('Task moved successfully');
}

/**
 * Handles errors during the task move process.
 * 
 * @param {Error} error - The caught error.
 */
async function handleTaskMoveError(error) {
  console.error("Error moving task:", error);
  await getUsersData();
  currentUser = users[currentUser.id];
  renderAllColumns();
}

/**
 * Handles add task button based on screen size
 */
function handleAddTaskButtonClick() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    window.location.href = "add_task.html";
  } else {
    openAddTaskBoard();
  }
}

/**
 * Handles initialization errors
 */
function handleInitError() {
  console.error("Could not initialize board");
  window.location.href = "index.html";
}

