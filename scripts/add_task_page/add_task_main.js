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
  initializeErrorHiding();
  setMinDateToday();
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
  const addTaskButton = document.getElementById("addtask-button");
  if (!validateForm()) return;
  
  const newTask = buildNewTask();
  try {
    await postTaskToDatabase(currentUser.id, newTask);
    showSuccessMessage();
    addTaskButton.disabled = true;
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

function addInputListener(inputId, alertId, eventType = "input") {
  const input = document.getElementById(inputId);
  const alert = document.getElementById(alertId);
  if (input && alert) {
    input.addEventListener(eventType, () => {
      alert.classList.add("d-none");
      input.classList.remove("input-error");
    });
  }
}

function initializeErrorHiding() {
  addInputListener("title", "alertMessageTitle");
  addInputListener("description", "alertMessageTitle");
  addInputListener("date", "alertMessageDate");
  addInputListener("dropDownSection", "alertMessageAssignedTo", "click");
  addInputListener("categoryDropDownSection", "alertMessageCategory", "click");
}

function hideAssignedContactsAlertOnChange() {
  const contacts = currentUser.contacts;
  const alert = document.getElementById("alertMessageAssignedTo");

  if (!contacts || !alert) return;

  for (const key in contacts) {
    const checkbox = document.getElementById(`assignedToCheckbox${key}`);
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          alert.classList.add("d-none");
        }
      });
    }
  }
}

/**
 * Sets minimum selectable date to today
 */
function setMinDateToday() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("date").setAttribute("min", today);
}

/**
 * Event listener when page is fully loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  initAddTaskPage();
});