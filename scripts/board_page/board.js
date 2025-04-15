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
 * Gets or assigns color for task-contact combination
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
    
    // Clean URL without page reload
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
  window.location.href = "login.html";
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

/**
 * Loads desktop template
 */
function renderDesktopTemplate() {
  const container = document.getElementById("templateSection");
  if (container) {
    container.innerHTML = getDesktopTemplate(currentUser);
  }
}

/**
 * Adds board content to page
 */
function renderBoardContent() {
  const container = document.getElementById("newContentSection");
  if (container) {
    container.innerHTML += getBoardContent();
  }
}

/**
 * Highlights board section in menu
 */
function changeToChosenBoardSection() {
  // Reset summary section
  const summarySection = document.getElementById("summary-section");
  const summaryImg = document.getElementById("summary-img");
  
  if (summarySection && summaryImg) {
    summarySection.classList.remove("chosen-section");
    summaryImg.classList.remove("summary-img-chosen");
    summaryImg.classList.add("summary-img");
  }

  // Highlight board section
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
 * Renders filtered tasks by status
 * @param {Array} tasks - Filtered tasks
 */
function renderFilteredTasks(tasks) {
  const byStatus = {
    toDo: tasks.filter(t => t.currentStatus === "toDo"),
    inProgress: tasks.filter(t => t.currentStatus === "inProgress"),
    awaitFeedback: tasks.filter(t => t.currentStatus === "awaitFeedback"),
    done: tasks.filter(t => t.currentStatus === "done")
  };

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
 * Moves task to new column from mobile menu
 * @param {string} taskId - Task to move
 * @param {string} newColumn - Target column
 */
async function moveTaskToNewColumn(taskId, newColumn) {
  // Find mobile menu
  const menu = document.getElementById(`menuSectionMobile${taskId}`);
  if (!menu) return;

  // Find task in data
  const taskKey = Object.keys(currentUser.tasks).find(
    key => currentUser.tasks[key].id === taskId
  );
  
  if (!taskKey) return;

  try {
    const oldColumn = currentUser.tasks[taskKey].currentStatus;
    
    // Skip if column unchanged
    if (oldColumn === newColumn) {
      menu.classList.add("d-none");
      return;
    }
    
    // Update data
    currentUser.tasks[taskKey].currentStatus = newColumn;
    await updateTaskColumnInDatabase(currentUser.id, taskKey, newColumn);
    
    // Update UI
    renderAllColumns();
    menu.classList.add("d-none");
    showSuccessToast('Task moved successfully');
    
  } catch (error) {
    console.error("Error moving task:", error);
    
    // Reload data on error
    await getUsersData();
    currentUser = users[currentUser.id];
    renderAllColumns();
  }
}

/**
 * Handles add task button based on screen size
 */
function handleAddTaskButtonClick() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    // Mobile - navigate to add task page
    window.location.href = "add_task.html";
  } else {
    // Desktop - open overlay
    openAddTaskBoard();
  }
}

/**
 * Handles initialization errors
 */
function handleInitError() {
  console.error("Could not initialize board");
  window.location.href = "login.html";
}