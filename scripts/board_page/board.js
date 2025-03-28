/** ---------------------- Global Variables ---------------------- */
let currentUser;
let nextTaskId = 0;
const assignedColors = {};
let colorMap = {};
let taskColorMap = {};


/** ---------------------- Color Management ---------------------- */
/** Retrieves or assigns a color for a specific contact key. */
function getOrAssignColor(contactKey) {
  if (!assignedColors[contactKey]) {
    assignedColors[contactKey] = getRandomColorFromPalette();
  }
  return assignedColors[contactKey];
}


/** Retrieves or assigns a color for a specific task-contact combination. */
function getOrAssignColorForTask(taskId, contactKey) {
  const uniqueKey = `${taskId}_${contactKey}`;
  if (!taskColorMap[uniqueKey]) {
    taskColorMap[uniqueKey] = getRandomColorFromPalette();
  }
  return taskColorMap[uniqueKey];
}


/** Returns a random color from the predefined color palette. */
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


/** ---------------------- Board Initialization ---------------------- */
/** Main initializer for the board page. */
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


/** Loads user data and sets the current user. */
async function loadUserAndSetCurrent() {
  await getUsersData();
  const currentUserId = localStorage.getItem("currentUserId");
  currentUser = users.users[currentUserId];
}


/** Checks if currentUser is defined. */
function checkCurrentUser() {
  if (!currentUser) {
    console.error("No user found or invalid user ID.");
    return false;
  }
  return true;
}


/** Renders essential UI parts of the board. */
function renderBoardUI() {
  renderDesktopTemplate();
  renderBoardContent();
  changeToChosenBoardSection();
  renderNameCircles();
  renderAssignedToSection();
}


/** Renders the four task columns (toDo, inProgress, awaitFeedback, done). */
function setUpBoardColumns() {
  renderColumn("done", "doneNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
}


/** Adds an event listener for 'Enter' key on subtask input. */
function addSubtaskEnterListener() {
  document.getElementById('subtask').addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      addSubtask();
      evt.preventDefault();
    }
  });
}


/** ---------------------- Render/Template ---------------------- */
/** Renders the desktop template into #templateSection. */
function renderDesktopTemplate() {
  let content = document.getElementById("templateSection");
  content.innerHTML = getDesktopTemplate(currentUser);
}


/** Renders the main board content into #newContentSection. */
function renderBoardContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getBoardContent();
}


/** Highlights the board icon/section in the sidebar. */
function changeToChosenBoardSection() {
  document.getElementById("summary-section").classList.remove("chosen-section");
  document.getElementById("summary-img").classList.remove("summary-img-chosen");
  document.getElementById("summary-img").classList.add("summary-img");

  document.getElementById("board-section").classList.add("chosen-section");
  document.getElementById("board-img").classList.remove("board-img");
  document.getElementById("board-img").classList.add("board-img-chosen");
}


/** ---------------------- Searching / Filtering ---------------------- */
/** Filters tasks by search term and re-renders columns. */
function filterTasks(event) {
  const term = event.target.value.toLowerCase().trim();
  if (!term) return renderAllColumns();

  const filteredTasks = Object.values(currentUser.tasks || {}).filter(task =>
    (task.title && task.title.toLowerCase().includes(term)) ||
    (task.taskDescription && task.taskDescription.toLowerCase().includes(term))
  );

  clearAllColumns();
  renderFilteredTasks(filteredTasks);
}


/** Clears all task columns in the DOM. */
function clearAllColumns() {
  document.getElementById("toDoNotes").innerHTML = "";
  document.getElementById("inProgressNotes").innerHTML = "";
  document.getElementById("awaitFeedbackNotes").innerHTML = "";
  document.getElementById("doneNotes").innerHTML = "";
}


/** Renders filtered tasks into the correct columns. */
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


/** Renders unfiltered columns if no search term is provided. */
function renderAllColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}


/** ---------------------- Mobile Menu & Task Movement ---------------------- */
/** Attaches event listeners to each mobile menu option. */
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


/** Moves task to a new column, updates DB, and re-renders columns. */
function moveTaskToNewColumn(taskId, newColumn) {
  let menu = document.getElementById(`menuSectionMobile${taskId}`);
  if (!menu) return console.error(`Menu for Task ${taskId} not found.`);

  const taskKey = Object.keys(currentUser.tasks).find(
    key => currentUser.tasks[key].id === taskId
  );
  if (!taskKey) return console.error(`Task ${taskId} not found.`);

  currentUser.tasks[taskKey].currentStatus = newColumn;
  updateTaskColumnInDatabase(taskKey, newColumn);

  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) taskElement.remove();

  renderAllColumns();
  menu.classList.add("d-none");
}


/** ---------------------- UI Helpers ---------------------- */
/** Called within renderFilteredTasks to display tasks in a column. */
function renderFilteredColumn(tasks, status, columnId) {
  const column = document.getElementById(columnId);
  if (!column) return console.error(`Column "${columnId}" not found.`);

  if (tasks.length === 0) {
    column.innerHTML = `<div class="empty-notification"><span>No tasks in this section</span></div>`;
    return;
  }
  tasks.forEach(task => column.innerHTML += getColumnTaskHtml(task, status));
}


/** ---------------------- Button Handlers ---------------------- */
/** Handles the "Add Task" button click for desktop/mobile. */
function handleAddTaskButtonClick() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    window.location.href = "add_task.html";
  } else {
    openAddTaskBoard();
  }
}