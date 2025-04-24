let currentUser;

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

function setCurrentUser() {
  const currentUserId = localStorage.getItem("currentUserId");
  currentUser = users[currentUserId];
  if (!currentUser) {
    window.location.href = "index.html";
  }
}

function renderAddTaskContent() {
  const content = document.getElementById("newContentSection");
  content.innerHTML += getAddTaskContent();
}

async function saveNewTask() {
  if (!validateTitle()) return;
  if (!validateAssignedContacts()) return;
  if (!validateEndDate()) return;
  if (!validateCategory()) return;
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

function showSuccessMessage() {
  let overlay = document.getElementById("successAddTaskOverlay");
  overlay.classList.remove("d-none");

  setTimeout(() => {
    overlay.classList.add("d-none");
  }, 2250);
}
