/** 
 * Global variables for board management
 */
let currentUser;
let nextTaskId = 0;
const assignedColors = {};
let colorMap = {};
let taskColorMap = {};
let currentDraggedTaskId = null;
let originalColumnId = null;

/**
 * Gets or assigns a color for a contact from color palette
 * @param {string} contactKey - Contact identifier
 * @returns {string} Hex color code
 */
function getOrAssignColor(contactKey) {
  if (!assignedColors[contactKey]) {
    assignedColors[contactKey] = getRandomColorFromPalette();
  }
  return assignedColors[contactKey];
}

/**
 * Gets or assigns a color for specific task-contact combination
 * @param {string} taskId - Task identifier
 * @param {string} contactKey - Contact identifier
 * @returns {string} Hex color code
 */
function getOrAssignColorForTask(taskId, contactKey) {
  const uniqueKey = `${taskId}_${contactKey}`;
  if (!taskColorMap[uniqueKey]) {
    taskColorMap[uniqueKey] = getRandomColorFromPalette();
  }
  return taskColorMap[uniqueKey];
}

/**
 * Returns a random color from predefined palette
 * @returns {string} Hex color code
 */
function getRandomColorFromPalette() {
  const palette = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", 
    "#33FFF5", "#FF8C33", "#FFD433", "#A8FF33", "#8C33FF",
    "#FFB6C1", "#FF69B4", "#FF1493", "#C71585", "#DB7093", 
    "#F0E68C", "#EEE8AA", "#BDB76B", "#FFD700", "#FFA07A",
    "#20B2AA", "#87CEEB", "#4682B4", "#5F9EA0", "#00CED1"
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}

/**
 * Initializes the board page
 * Loads user data, renders UI components, sets up board columns
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
  
  // Show success toast if coming from add_task page
  checkForTaskAddSuccess();
}

/**
 * Checks for success parameter in URL and shows toast if present
 */
function checkForTaskAddSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tasksuccess') === 'true') {
    showSuccessToast('Task successfully added');
    
    // Clean up URL without reloading page
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
}

/**
 * Shows a temporary success message toast
 * @param {string} message - Message to display
 */
function showSuccessToast(message) {
  // Create toast if it doesn't exist
  if (!document.getElementById('successToast')) {
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
    
    // Remove toast after animation
    setTimeout(() => {
      toast.remove();
    }, 2250);
  }
}

/**
 * Loads user data from Firebase or local storage
 */
async function loadUserAndSetCurrent() {
  const userId = localStorage.getItem("currentUserId");
  
  if (!userId) {
    console.error("No user ID found - redirecting to login");
    window.location.href = "login.html";
    return;
  }
  
  try {
    await getUsersData();
    currentUser = users[userId];
    
    if (!currentUser) {
      console.error("User data not found - redirecting to login");
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }
    
    localStorage.setItem("currentUserId", userId);
  } catch (error) {
    console.error("Error loading user data:", error);
    window.location.href = "login.html";
  }
}

/**
 * Verifies current user is loaded properly
 * @returns {boolean} True if user data exists
 */
function checkCurrentUser() {
  if (!currentUser) {
    console.error("User not found - redirecting to login");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/**
 * Sets up main UI components for the board
 */
function renderBoardUI() {
  renderDesktopTemplate();
  renderBoardContent();
  changeToChosenBoardSection();
  renderNameCircles();
  renderAssignedToSection();
}

/**
 * Creates all board columns with tasks
 */
function setUpBoardColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}

/**
 * Sets up keyboard event handler for subtasks
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
 * Loads desktop UI template into DOM
 */
function renderDesktopTemplate() {
  const templateContainer = document.getElementById("templateSection");
  if (templateContainer) {
    templateContainer.innerHTML = getDesktopTemplate(currentUser);
  }
}

/**
 * Adds board content to the page
 */
function renderBoardContent() {
  const contentContainer = document.getElementById("newContentSection");
  if (contentContainer) {
    contentContainer.innerHTML += getBoardContent();
  }
}

/**
 * Highlights board section in navigation menu
 */
function changeToChosenBoardSection() {
  // Remove highlight from summary section
  const summarySection = document.getElementById("summary-section");
  const summaryImg = document.getElementById("summary-img");
  
  if (summarySection && summaryImg) {
    summarySection.classList.remove("chosen-section");
    summaryImg.classList.remove("summary-img-chosen");
    summaryImg.classList.add("summary-img");
  }

  // Add highlight to board section
  const boardSection = document.getElementById("board-section");
  const boardImg = document.getElementById("board-img");
  
  if (boardSection && boardImg) {
    boardSection.classList.add("chosen-section");
    boardImg.classList.remove("board-img");
    boardImg.classList.add("board-img-chosen");
  }
}

/**
 * Filters tasks based on search input
 * @param {Event} event - Input event from search field
 */
function filterTasks(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  
  // If search is empty, show all tasks
  if (!searchTerm) {
    renderAllColumns();
    return;
  }

  // Find tasks matching search term in title or description
  const filteredTasks = Object.values(currentUser.tasks || {}).filter(task => {
    const titleMatch = task.title && task.title.toLowerCase().includes(searchTerm);
    const descMatch = task.taskDescription && task.taskDescription.toLowerCase().includes(searchTerm);
    return titleMatch || descMatch;
  });

  // Update columns with filtered tasks
  clearAllColumns();
  renderFilteredTasks(filteredTasks);
}

/**
 * Clears all task columns
 */
function clearAllColumns() {
  const columns = ["toDoNotes", "inProgressNotes", "awaitFeedbackNotes", "doneNotes"];
  columns.forEach(columnId => {
    const column = document.getElementById(columnId);
    if (column) column.innerHTML = "";
  });
}

/**
 * Displays filtered tasks in their respective columns
 * @param {Array} tasks - List of filtered tasks
 */
function renderFilteredTasks(tasks) {
  // Group tasks by their status
  const tasksByStatus = {
    toDo: tasks.filter(t => t.currentStatus === "toDo"),
    inProgress: tasks.filter(t => t.currentStatus === "inProgress"),
    awaitFeedback: tasks.filter(t => t.currentStatus === "awaitFeedback"),
    done: tasks.filter(t => t.currentStatus === "done")
  };

  // Render each status group in its column
  renderFilteredColumn(tasksByStatus.toDo, "toDo", "toDoNotes");
  renderFilteredColumn(tasksByStatus.inProgress, "inProgress", "inProgressNotes");
  renderFilteredColumn(tasksByStatus.awaitFeedback, "awaitFeedback", "awaitFeedbackNotes");
  renderFilteredColumn(tasksByStatus.done, "done", "doneNotes");
}

/**
 * Renders all columns with the complete task list
 */
function renderAllColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}

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
      
      if (taskId && newCol) {
        moveTaskToNewColumn(taskId, newCol);
      }
    });
  });
}

/**
 * Moves a task to a different column
 * @param {string} taskId - Task to move
 * @param {string} newColumn - Target column
 */
async function moveTaskToNewColumn(taskId, newColumn) {
  // Find mobile menu for this task
  const menu = document.getElementById(`menuSectionMobile${taskId}`);
  if (!menu) {
    console.error(`Menu not found for task ${taskId}`);
    return;
  }

  // Find task in user data
  const taskKey = Object.keys(currentUser.tasks).find(
    key => currentUser.tasks[key].id === taskId
  );
  
  if (!taskKey) {
    console.error(`Task not found: ${taskId}`);
    return;
  }

  try {
    // Only proceed if column actually changed
    const oldColumn = currentUser.tasks[taskKey].currentStatus;
    if (oldColumn === newColumn) {
      menu.classList.add("d-none");
      return;
    }
    
    // Update task data
    currentUser.tasks[taskKey].currentStatus = newColumn;
    
    // Save to Firebase
    await updateTaskColumnInDatabase(currentUser.id, taskKey, newColumn);
    
    // Update UI
    renderAllColumns();
    menu.classList.add("d-none");
    
    // Show success feedback
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
 * Renders filtered tasks in a column
 * @param {Array} tasks - Tasks to render
 * @param {string} status - Column status
 * @param {string} columnId - DOM element ID
 */
function renderFilteredColumn(tasks, status, columnId) {
  const column = document.getElementById(columnId);
  if (!column) {
    console.error(`Column ${columnId} not found`);
    return;
  }

  if (tasks.length === 0) {
    column.innerHTML = `<div class="empty-notification"><span>No tasks found</span></div>`;
    return;
  }
  
  // Generate HTML for each task
  let columnHtml = '';
  tasks.forEach(task => {
    columnHtml += getColumnTaskHtml(task, status);
  });
  
  column.innerHTML = columnHtml;
  
  // Render task details after adding HTML
  tasks.forEach(task => {
    renderTaskCategory(task.id, task, status);
    renderNameCircleSection(task.id, task, status);
    renderSubtaskProgress(task.id, task, status);
    renderPrioImg(task.id, task, status);
  });
}

/**
 * Handles add task button click based on screen size
 */
function handleAddTaskButtonClick() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    // Mobile view - navigate to full add task page
    window.location.href = "add_task.html";
  } else {
    // Desktop view - open overlay
    openAddTaskBoard();
  }
}