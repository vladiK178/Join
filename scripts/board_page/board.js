/** Shared App State and Configuration */
let currentUser;
let nextTaskId = 0;
const userColorCache = {};
let taskSpecificColors = {};

/** Color Utility Helpers */
/**
 * Get a consistent color for a contact or generate a new one if not exists
 * @param {string} contactIdentifier - Unique key for contact
 * @returns {string} Assigned color hex code
 */
function assignContactColor(contactIdentifier) {
  if (!userColorCache[contactIdentifier]) {
    userColorCache[contactIdentifier] = pickRandomColor();
  }
  return userColorCache[contactIdentifier];
}

/**
 * Generate a unique color for a specific task-contact combination
 * @param {string} taskId - Unique task identifier
 * @param {string} contactKey - Contact identifier
 * @returns {string} Color hex code
 */
function generateTaskContactColor(taskId, contactKey) {
  const uniqueTaskContactKey = `${taskId}_${contactKey}`;
  if (!taskSpecificColors[uniqueTaskContactKey]) {
    taskSpecificColors[uniqueTaskContactKey] = pickRandomColor();
  }
  return taskSpecificColors[uniqueTaskContactKey];
}

/**
 * Select a random color from a predefined palette
 * @returns {string} Random color hex code
 */
function pickRandomColor() {
  const colorPalette = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", 
    "#33FFF5", "#FF8C33", "#FFD433", "#A8FF33", "#8C33FF",
    "#FFB6C1", "#FF69B4", "#FF1493", "#C71585", "#DB7093", 
    "#F0E68C", "#EEE8AA", "#BDB76B", "#FFD700", "#FFA07A",
    "#20B2AA", "#87CEEB", "#4682B4", "#5F9EA0", "#00CED1", 
    "#40E0D0", "#48D1CC", "#AFEEEE", "#7FFFD4", "#B0E0E6",
    "#9370DB", "#8A2BE2", "#4B0082", "#6A5ACD", "#483D8B", 
    "#1E90FF", "#6495ED", "#ADD8E6", "#87CEFA", "#B0C4DE",
    "#E9967A", "#FA8072", "#FFA07A", "#FF7F50", "#FF6347", 
    "#FF4500", "#DC143C", "#B22222", "#CD5C5C", "#F08080",
    "#98FB98", "#00FA9A", "#32CD32", "#3CB371", "#2E8B57", 
    "#90EE90", "#8FBC8F", "#66CDAA", "#7FFF00", "#7CFC00",
    "#FFDAB9", "#FFE4B5", "#F5DEB3", "#FFDEAD", "#F0E68C", 
    "#EEE8AA", "#BDB76B", "#FFEFD5", "#FFDAB9", "#FAFAD2"
  ];
  return colorPalette[Math.floor(Math.random() * colorPalette.length)];
}

/** Board Initialization Flow */
/**
 * Primary setup method for board page
 * Handles user authentication and UI rendering
 */
async function initializeBoardPage() {
  await loadCurrentUserData();
  if (!validateCurrentUser()) return;

  renderPageComponents();
  setupBoardInteractions();
}

/**
 * Fetch and set current user data from local storage
 */
async function loadCurrentUserData() {
  await getUsersData();
  const currentUserId = localStorage.getItem("currentUserId");
  currentUser = users.users[currentUserId];
}

/**
 * Validate that a valid user is logged in
 * @returns {boolean} User validation status
 */
function validateCurrentUser() {
  if (!currentUser) {
    console.error("Authentication failed: No user found");
    return false;
  }
  return true;
}

/** UI Rendering and Setup */
function renderPageComponents() {
  renderDesktopLayout();
  renderBoardContent();
  highlightActiveBoardSection();
  renderUserProfileVisuals();
  setupAssignmentSection();
}

/**
 * Configure board column rendering
 */
function setupBoardInteractions() {
  renderBoardColumns();
  attachSubtaskInputHandler();
  initializeOutsideClickTracking();
  setupMobileMenuEvents();
}

/**
 * Render all task columns with their respective content
 */
function renderBoardColumns() {
  renderColumn("done", "doneNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
}

/** Filtering and Search Functionality */
/**
 * Handle task filtering based on user input
 * @param {Event} event - Search input event
 */
function filterTasksBySearchTerm(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  if (!searchTerm) return renderAllColumns();

  const matchingTasks = Object.values(currentUser.tasks || {}).filter(task =>
    (task.title && task.title.toLowerCase().includes(searchTerm)) ||
    (task.taskDescription && task.taskDescription.toLowerCase().includes(searchTerm))
  );

  resetColumnDisplay();
  renderFilteredTaskColumns(matchingTasks);
}

/**
 * Clear all column contents before rendering filtered tasks
 */
function resetColumnDisplay() {
  ["toDoNotes", "inProgressNotes", "awaitFeedbackNotes", "doneNotes"]
    .forEach(columnId => document.getElementById(columnId).innerHTML = "");
}

/**
 * Distribute filtered tasks across columns
 * @param {Array} filteredTasks - Tasks matching search criteria
 */
function renderFilteredTaskColumns(filteredTasks) {
  const columnMapping = {
    "toDo": filteredTasks.filter(t => t.currentStatus === "toDo"),
    "inProgress": filteredTasks.filter(t => t.currentStatus === "inProgress"),
    "awaitFeedback": filteredTasks.filter(t => t.currentStatus === "awaitFeedback"),
    "done": filteredTasks.filter(t => t.currentStatus === "done")
  };

  Object.entries(columnMapping).forEach(([status, tasks]) => 
    renderFilteredColumn(tasks, status, `${status}Notes`)
  );
}

/** Mobile Task Movement Handlers */
/**
 * Setup click events for mobile task movement menu
 */
function setupMobileMenuEvents() {
  document.querySelectorAll('.menu-mobile .menu-option').forEach(option => {
    option.addEventListener('click', handleMobileTaskMove);
  });
}

/**
 * Process task column change from mobile menu
 * @param {Event} event - Click event
 */
function handleMobileTaskMove(event) {
  event.preventDefault();
  event.stopPropagation();

  const taskId = event.target.getAttribute('data-task-id');
  const newColumn = event.target.getAttribute('data-column');
  moveTaskBetweenColumns(taskId, newColumn);
}

/**
 * Update task status and re-render columns
 * @param {string} taskId - Task unique identifier
 * @param {string} targetColumn - Destination column name
 */
function moveTaskBetweenColumns(taskId, targetColumn) {
  const taskKey = Object.keys(currentUser.tasks).find(
    key => currentUser.tasks[key].id === taskId
  );
  
  if (!taskKey) {
    console.error(`Task ${taskId} not found`);
    return;
  }

  currentUser.tasks[taskKey].currentStatus = targetColumn;
  updateTaskColumnInDatabase(taskKey, targetColumn);

  document.querySelector(`[data-task-id="${taskId}"]`)?.remove();
  renderAllColumns();
}

/**
 * Handle "Add Task" button logic across device sizes
 */
function handleAddTaskButtonClick() {
  const isMobileView = window.matchMedia("(max-width: 1200px)").matches;
  isMobileView 
    ? window.location.href = "add_task.html"
    : openAddTaskBoard();
}

export { 
  initializeBoardPage, 
  filterTasksBySearchTerm, 
  handleAddTaskButtonClick 
};