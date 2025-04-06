/** ---------------------- App Variables ---------------------- */
let currentUser;
let nextTaskId = 0;
const assignedColors = {};
let colorMap = {};
let taskColorMap = {};

/** ---------------------- Color Functions ---------------------- */
/**
 * Gets or creates a color for a contact
 * @param {string} contactKey - Contact identifier
 */
function getOrAssignColor(contactKey) {
  if (!assignedColors[contactKey]) {
    assignedColors[contactKey] = getRandomColorFromPalette();
  }
  return assignedColors[contactKey];
}

/**
 * Manages colors for task-contact combinations
 * @param {string} taskId - Task identifier
 * @param {string} contactKey - Contact identifier
 */
function getOrAssignColorForTask(taskId, contactKey) {
  const uniqueKey = `${taskId}_${contactKey}`;
  if (!taskColorMap[uniqueKey]) {
    taskColorMap[uniqueKey] = getRandomColorFromPalette();
  }
  return taskColorMap[uniqueKey];
}

/**
 * Picks a random color from predefined options
 */
function getRandomColorFromPalette() {
  const palette = [
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
  return palette[Math.floor(Math.random() * palette.length)];
}

/** ---------------------- Board Setup ---------------------- */
/**
 * Main function to initialize the board page
 */
async function initBoardPage() {
  await loadUserAndSetCurrent();
  if (!checkCurrentUser()) return;
  renderAddTaskContent();
  renderBoardUI();
  setUpBoardColumns();
  addSubtaskEnterListener();
  initOutsideClickListener();
  attachMobileMenuEventListeners();
}

/**
 * Loads user data from Firebase
 */
async function loadUserAndSetCurrent() {
  const userId = localStorage.getItem("userId");
  
  if (!userId) {
    console.error("No user ID found in localStorage - login required");
    window.location.href = "login.html";
    return;
  }
  
  try {
    // Load directly from Firebase instead of from localStorage
    await getUsersData();
    currentUser = users.users[userId];
    
    // If no user data was found, redirect to login
    if (!currentUser) {
      console.error("User not found in database");
      localStorage.clear(); // Alte Daten löschen
      window.location.href = "login.html";
      return;
    }
    
    // Update current user ID in localStorage
    localStorage.setItem("currentUserId", userId);
  } catch (error) {
    console.error("Error loading user data from Firebase:", error);
    window.location.href = "login.html";
  }
}

/**
 * Validates if user data exists
 */
function checkCurrentUser() {
  if (!currentUser) {
    console.error("User not found - please log in again");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/**
 * Sets up main UI components
 */
function renderBoardUI() {
  renderDesktopTemplate();
  renderBoardContent();
  changeToChosenBoardSection();
  renderNameCircles();
  renderAssignedToSection();
}

/**
 * Creates the task columns structure
 */
function setUpBoardColumns() {
  renderColumn("done", "doneNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
}

/**
 * Adds keyboard event handler for subtasks
 */
function addSubtaskEnterListener() {
  document.getElementById('subtask').addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      addSubtask();
      evt.preventDefault();
    }
  });
}

/** ---------------------- HTML Generation ---------------------- */
/**
 * Loads desktop UI template
 */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = getDesktopTemplate(currentUser);
}

/**
 * Generates board main content
 */
function renderBoardContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getBoardContent();
}

/**
 * Highlights current section in sidebar
 */
function changeToChosenBoardSection() {
  // Remove highlight from summary section
  document.getElementById("summary-section").classList.remove("chosen-section");
  document.getElementById("summary-img").classList.remove("summary-img-chosen");
  document.getElementById("summary-img").classList.add("summary-img");

  // Add highlight to board section
  document.getElementById("board-section").classList.add("chosen-section");
  document.getElementById("board-img").classList.remove("board-img");
  document.getElementById("board-img").classList.add("board-img-chosen");
}

/** ---------------------- Search Functions ---------------------- */
/**
 * Filters tasks based on search input
 * @param {Event} event - Input event
 */
function filterTasks(event) {
  const term = event.target.value.toLowerCase().trim();
  if (!term) return renderAllColumns();

  // Find tasks matching search term
  const filteredTasks = Object.values(currentUser.tasks || {}).filter(task =>
    (task.title && task.title.toLowerCase().includes(term)) ||
    (task.taskDescription && task.taskDescription.toLowerCase().includes(term))
  );

  clearAllColumns();
  renderFilteredTasks(filteredTasks);
}

/**
 * Clears all task columns
 */
function clearAllColumns() {
  document.getElementById("toDoNotes").innerHTML = "";
  document.getElementById("inProgressNotes").innerHTML = "";
  document.getElementById("awaitFeedbackNotes").innerHTML = "";
  document.getElementById("doneNotes").innerHTML = "";
}

/**
 * Displays filtered tasks in correct columns
 */
function renderFilteredTasks(tasks) {
  const toDo = tasks.filter(t => t.currentStatus === "toDo");
  const inProgress = tasks.filter(t => t.currentStatus === "inProgress");
  const awaitFb = tasks.filter(t => t.currentStatus === "awaitFeedback");
  const done = tasks.filter(t => t.currentStatus === "done");

  renderFilteredColumn(toDo, "toDo", "toDoNotes");
  renderFilteredColumn(inProgress, "inProgress", "inProgressNotes");
  renderFilteredColumn(awaitFb, "awaitFeedback", "awaitFeedbackNotes");
  renderFilteredColumn(done, "done", "doneNotes");
}

/**
 * Renders all columns with full task list
 */
function renderAllColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}

/** ---------------------- Mobile Menu Handlers ---------------------- */
/**
 * Sets up mobile menu click handlers
 */
function attachMobileMenuEventListeners() {
  const menuOptions = document.querySelectorAll('.menu-mobile .menu-option');
  menuOptions.forEach(option => {
    option.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const taskId = option.getAttribute('data-task-id');
      const newCol = option.getAttribute('data-column');
      moveTaskToNewColumn(taskId, newCol);
    });
  });
}

/**
 * Handles task movement between columns
 * @param {string} taskId - Task identifier
 * @param {string} newColumn - Target column
 */
async function moveTaskToNewColumn(taskId, newColumn) {
  let menu = document.getElementById(`menuSectionMobile${taskId}`);
  if (!menu) return console.error(`Menu not found for task ${taskId}`);

  const taskKey = Object.keys(currentUser.tasks).find(
    key => currentUser.tasks[key].id === taskId
  );
  if (!taskKey) return console.error(`Could not find task ${taskId}`);

  try {
    // Update task status
    currentUser.tasks[taskKey].currentStatus = newColumn;
    
    // In Firebase speichern
    await updateTaskColumnInDatabase(currentUser.id, taskKey, newColumn);
    
    // UI aktualisieren
    renderAllColumns();
    menu.classList.add("d-none");
  } catch (error) {
    console.error("Error moving task to new column:", error);
    // Bei Fehler Daten neu laden
    await getUsersData();
    currentUser = users.users[currentUser.id];
    renderAllColumns();
  }
}

/** ---------------------- Column Helpers ---------------------- */
/**
 * Renders filtered tasks in a column
 * @param {Array} tasks - Tasks to render
 * @param {string} status - Column status
 * @param {string} columnId - DOM element ID
 */
function renderFilteredColumn(tasks, status, columnId) {
  const column = document.getElementById(columnId);
  if (!column) return console.error(`Column ${columnId} not found`);

  if (tasks.length === 0) {
    column.innerHTML = `<div class="empty-notification"><span>No tasks in this section</span></div>`;
    return;
  }
  tasks.forEach(task => column.innerHTML += getColumnTaskHtml(task, status));
}

/** ---------------------- Button Actions ---------------------- */
/**
 * Handles add task button click
 */
function handleAddTaskButtonClick() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    window.location.href = "add_task.html";
  } else {
    openAddTaskBoard();
  }
}