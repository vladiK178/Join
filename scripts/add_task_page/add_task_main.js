let currentUser;

/**
 * Initializes the Add Task page with user data and UI elements.
 */
async function initAddTaskPage() {
  await getUsersData();
  currentSubTask = {};
  setCurrentUser();
  renderPage();
  highlightAddTaskSection();
  addSubtaskEnterListener();
  initOutsideClickListener();
  initializeErrorHiding();
  setMinDateToday();
}

/**
 * Renders the entire Add Task page content including templates and UI elements.
 */
function renderPage() {
  renderDesktopTemplate();
  renderAddTaskContent();
  renderNameCircles();
  renderAssignedToSection();
  renderSubtasks();
}

/**
 * Gets current user from local storage and redirects if not found.
 */
function setCurrentUser() {
  const currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
  if (!currentUser) {
    window.location.href = "index.html";
  }
}

/**
 * Renders the Add Task form inside the content section.
 */
function renderAddTaskContent() {
  const content = document.getElementById("newContentSection");
  content.innerHTML += getAddTaskContent();
}

/**
 * Saves a new task after validating the form inputs.
 * Disables the add task button and redirects to board on success.
 */
async function saveNewTask() {
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
 * Builds a task object from form input values.
 * @returns {Object} The constructed task object.
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
 * Shows a success message overlay after task is saved.
 * Automatically hides the overlay after a delay.
 */
function showSuccessMessage() {
  let overlay = document.getElementById("successAddTaskOverlay");
  overlay.classList.remove("d-none");

  setTimeout(() => {
    overlay.classList.add("d-none");
  }, 2250);
}

/**
 * Adds an event listener to an input element to hide associated error alerts.
 * @param {string} inputId - The ID of the input element.
 * @param {string} alertId - The ID of the alert element.
 * @param {string} [eventType="input"] - The type of event to listen for.
 */
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

/**
 * Initializes error hiding behavior for inputs and dropdowns by adding listeners.
 */
function initializeErrorHiding() {
  addInputListener("title", "alertMessageTitle");
  addInputListener("description", "alertMessageTitle");
  addInputListener("date", "alertMessageDate");
  addInputListener("dropDownSection", "alertMessageAssignedTo", "click");
  addInputListener("categoryDropDownSection", "alertMessageCategory", "click");
}

/**
 * Hides the assigned contacts alert when any assigned contact checkbox is checked.
 */
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
 * Sets the minimum selectable due date in the date picker to today's date.
 */
function setMinDateToday() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").setAttribute("min", today);
}

/**
 * Event listener triggered when the DOM content is fully loaded.
 * Starts the Add Task page initialization.
 */
document.addEventListener("DOMContentLoaded", () => {
  initAddTaskPage();
});
