/** Initializes the Add Task page. */
async function initAddTaskPage() {
  await getUsersData();
  currentSubTask = {};
  setCurrentUser();
  // Removed: console.log("Current User:", currentUser);
  renderDesktopTemplate();
  highlightAddTaskSection();
  renderAddTaskContent();
  renderNameCircles();
  renderAssignedToSection();
  renderSubtasks();
  addSubtaskEnterListener();
  initOutsideClickListener();
}

/** Sets the current user from localStorage. */
function setCurrentUser() {
  let currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
}

/** Renders the main Add Task content into #newContentSection. */
function renderAddTaskContent() {
  let content = document.getElementById("newContentSection");
  content.innerHTML += getAddTaskContent();
}

/** Validates, builds, and saves a new task. */
async function saveNewTask() {
  if (!validateTitle()) return;
  if (!validateAssignedContacts()) return;
  if (!validateEndDate()) return;
  if (!validateCategory()) return;
  const newTask = buildNewTask();
  try {
    const result = await postTaskToDatabase(currentUser.id, newTask);
    // Removed: console.log("Server Response:", result);
    showSuccessMessage();
    setTimeout(() => {
      initAddTaskPage(); // Lade erst nach 5 Sekunden neu
    }, 2200);
  } catch (error) {
    console.error("Error saving task:", error);
  }
}

/** Resets the form fields and UI elements. */
function resetForm() {
  resetFormInputs();
  resetCategory();
  resetPriority();
  resetDropDowns();
  resetSubtasksUI();
  resetAssignedCheckBoxes();
  renderNameCircles();
}

/** Builds the new task object from form inputs. */
function buildNewTask() {
  let t = document.getElementById("title").value.trim();
  let d = document.getElementById("description").value.trim();
  return {
    id: `task_${Date.now()}`,
    assignedTo: collectAssignedContacts(),
    category: getSelectedCategory(),
    currentStatus: "toDo",
    dueDate: document.getElementById("date").value,
    priority: getSelectedPriority(),
    subtasks: currentSubTask,
    taskDescription: capitalizeFirstLetter(d),
    title: capitalizeFirstLetter(t),
  };
}

/** Clears text fields and date. */
function resetFormInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("subtask").value = "";
}

/** Resets category label and hides dropdown. */
function resetCategory() {
  document.getElementById("selectTaskCategorySpan").innerText =
    "Select task category";
  document.getElementById("categoryDropDownSection").classList.add("d-none");
}

/** Resets priority to Medium by default. */
function resetPriority() {
  document.getElementById("prioUrgent").classList.remove("prio-urgent-chosen");
  document.getElementById("prioUrgent").classList.add("prio-urgent");
  document.getElementById("prioMedium").classList.add("prio-medium-chosen");
  document.getElementById("prioLow").classList.remove("prio-low-chosen");
  document.getElementById("prioLow").classList.add("prio-low");
}

/** Hides the "Assigned To" dropdown. */
function resetDropDowns() {
  document.getElementById("dropDownSection").classList.add("d-none");
}

/** Clears current subtasks from the form. */
function resetSubtasksUI() {
  currentSubTask = {};
  document.getElementById("subtaskSection").innerHTML = "";
}

/** Unchecks all assigned-to checkboxes. */
function resetAssignedCheckBoxes() {
  const c = currentUser.contacts || {};
  for (let i = 0; i < c.length; i++) {
    let box = document.getElementById(`assignedToCheckbox${i}`);
    if (box) {
      box.checked = false;
      choseNameAndShowCircle(i);
    }
  }
}

/**
 * Displays a success message overlay and redirects to login.html after a delay.
 */
function showSuccessMessage() {
  let overlay = document.getElementById("successAddTaskOverlay");
  overlay.classList.remove("d-none");

  setTimeout(() => {
    overlay.classList.add("d-none");
  }, 2250);
}
