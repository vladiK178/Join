let currentUser;

/**
 * Initializes the Add Task page with user data and UI elements
 */
async function initAddTaskPage() {
  await getUsersData();
  currentSubTask = {};
  setCurrentUser();
  renderDesktopTemplate();
  highlightAddTaskSection();
  renderAddTaskContent();
  renderNameCircles();
  renderAssignedToSection();
  renderSubtasks();
  addSubtaskEnterListener();
  initOutsideClickListener();
}

/**
 * Gets current user from local storage
 */
function setCurrentUser() {
  const currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
  if (!currentUser) {
    window.location.href = "index.html";
  }
}

/**
 * Renders the Add Task form in the content section
 */
function renderAddTaskContent() {
  const content = document.getElementById("newContentSection");
  content.innerHTML += getAddTaskContent();
}

/**
 * Saves a new task after validation
 */
async function saveNewTask() {
  // Validate all form fields
  if (!validateForm()) return;
  
  const newTask = buildNewTask();
  try {
    await postTaskToDatabase(currentUser.id, newTask);
    showSuccessMessage();
    setTimeout(() => {
      window.location.href = "board.html";
    }, 2200);
  } catch (error) {
    console.error("Error saving task:", error);
  }
}

/**
 * Builds a task object from form values
 * @returns {Object} The task object
 */
function buildNewTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  return {
    id: `task_${Date.now()}`,
    assignedTo: collectAssignedContacts(),
    category: getSelectedCategory(),
    currentStatus: "toDo",
    dueDate: document.getElementById("date").value,
    priority: getSelectedPriority(),
    subtasks: currentSubTask,
    taskDescription: capitalizeFirstLetter(description),
    title: capitalizeFirstLetter(title),
  };
}

/**
 * Shows success message after saving task
 */
function showSuccessMessage() {
  let overlay = document.getElementById("successAddTaskOverlay");
  overlay.classList.remove("d-none");

  setTimeout(() => {
    overlay.classList.add("d-none");
  }, 2250);
}
