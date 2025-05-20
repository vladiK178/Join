/**
 * Variables to track drag and drop state
 */
let currentDraggedElement = null;
let draggedTaskId = null;
let originalColumn = null;

/**
 * Starts the drag operation for a task
 * @param {string} taskId - ID of task being dragged
 * @param {Event} event - The drag event
 */
function startDragging(taskId, event) {
  // Set task references
  draggedTaskId = taskId;
  currentDraggedElement = event.target.closest("[data-task-id]");
  originalColumn = event.target.parentElement.id;

  event.dataTransfer.setData("text", taskId);

  setTimeout(() => {
    currentDraggedElement.classList.add("rotated-note");

    // Add transparent drag image to avoid distortion
    const img = new Image();
    img.src = "./assets/img/transparent.png";
    event.dataTransfer.setDragImage(img, 0, 0);
  }, 10);
}

/**
 * Handles end of drag operation and resets visual styles
 */
function endDragging() {
  // Reset visual state
  if (currentDraggedElement) {
    currentDraggedElement.classList.remove("rotated-note");
  }

  // Remove drop indicators
  const emptyNotes = document.querySelectorAll(".empty-dashed-note");
  emptyNotes.forEach((note) => note.remove());

  // Reset tracking variables
  currentDraggedElement = null;
  draggedTaskId = null;
}

/**
 * Shows visual drop zone indicator when hovering over column
 * @param {string} columnId - Target column ID
 */
function showEmptyDashedNote(columnId) {
  const column = document.getElementById(columnId);
  if (!column) return;

  // Prevent duplicates
  if (column.querySelector(".empty-dashed-note")) return;

  // Create visual drop placeholder
  const emptyNote = document.createElement("div");
  emptyNote.className = "empty-dashed-note";
  column.appendChild(emptyNote);
}

/**
 * Removes drop zone indicator when leaving column
 * @param {string} columnId - Column to remove indicator from
 */
function hideEmptyDashedNote(columnId) {
  const column = document.getElementById(columnId);
  if (!column) return;

  const emptyNote = column.querySelector(".empty-dashed-note");
  if (emptyNote) emptyNote.remove();
}

/**
 * Allows drop operation on valid targets
 * @param {Event} event - The dragover event
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles task dropping to update its status.
 * 
 * @param {DragEvent} event - The drop event.
 * @param {string} targetStatus - The new status to assign to the task.
 */
function drop(event, targetStatus) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text");
  if (!taskId) return;

  const taskKey = findTaskKeyById(taskId);
  if (!isValidDrop(taskId, taskKey, targetStatus)) return;

  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  currentUser.tasks[taskKey].currentStatus = targetStatus;

  updateTaskStatus(taskKey, originalStatus, targetStatus);
}

/**
 * Checks whether the drop is valid (task exists, taskKey is valid, status is different).
 * 
 * @param {string} taskId - The ID of the dropped task.
 * @param {string|null} taskKey - The key of the task in the user's task object.
 * @param {string} targetStatus - The status the task is being moved to.
 * @returns {boolean} True if drop is valid.
 */
function isValidDrop(taskId, taskKey, targetStatus) {
  if (!taskKey) {
    console.error(`Task not found: ${taskId}`);
    return false;
  }

  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  if (originalStatus === targetStatus) return false;

  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  return !!taskElement;
}

/**
 * Updates the task's status in the database and handles UI refresh or error recovery.
 * 
 * @param {string} taskKey - The key of the task to update.
 * @param {string} originalStatus - The original status of the task before drop.
 * @param {string} targetStatus - The new status after drop.
 */
function updateTaskStatus(taskKey, originalStatus, targetStatus) {
  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      refreshAllColumns();
      showToastMessage("Task moved successfully!");
    })
    .catch((error) => {
      console.error("Failed to update task:", error);
      currentUser.tasks[taskKey].currentStatus = originalStatus;
      refreshAllColumns();
      showToastMessage("Failed to move task. Please try again.", true);
    });
}

/**
 * Finds task key by ID in current user's tasks
 * @param {string} taskId - Task ID to find
 * @returns {string|undefined} Task key if found
 */
function findTaskKeyById(taskId) {
  return Object.keys(currentUser.tasks || {}).find(
    (key) => currentUser.tasks[key].id === taskId
  );
}

/**
 * Refreshes all column content
 */
function refreshAllColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}

/**
 * Handles column selection for task movement.
 * 
 * @param {string} targetStatus - Column to move task to.
 */
function moveTo(targetStatus) {
  if (!draggedTaskId) return;

  const taskKey = findTaskKeyById(draggedTaskId);
  if (!taskKey) return;

  if (!shouldUpdateStatus(taskKey, targetStatus)) return;

  updateTaskStatusWithUI(taskKey, targetStatus);
}

/**
 * Checks if the task status needs to be updated.
 * 
 * @param {string} taskKey - The key of the task.
 * @param {string} targetStatus - The target status to move the task to.
 * @returns {boolean} True if status update is needed.
 */
function shouldUpdateStatus(taskKey, targetStatus) {
  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  return originalStatus !== targetStatus;
}

/**
 * Updates task status in memory, saves to database, and updates UI with error handling.
 * 
 * @param {string} taskKey - The key of the task to update.
 * @param {string} targetStatus - The new status for the task.
 */
function updateTaskStatusWithUI(taskKey, targetStatus) {
  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  currentUser.tasks[taskKey].currentStatus = targetStatus;

  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      refreshAllColumns();
      showToastMessage("Task moved successfully!");
    })
    .catch((error) => {
      console.error("Failed to update task:", error);
      currentUser.tasks[taskKey].currentStatus = originalStatus;
      refreshAllColumns();
      showToastMessage("Failed to move task. Please try again.", true);
    });
}

/**
 * Shows feedback message to user.
 * 
 * @param {string} message - Text to display.
 * @param {boolean} [isError=false] - Whether message is an error.
 */
function showToastMessage(message, isError = false) {
  const toast = getOrCreateToastElement();
  styleAndShowToast(toast, message, isError);
  autoHideToast(toast, 3000);
}

/**
 * Gets the toast element or creates it if it doesn't exist.
 * 
 * @returns {HTMLDivElement} The toast element.
 */
function getOrCreateToastElement() {
  let toast = document.getElementById("toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-message";
    applyToastBaseStyles(toast);
    document.body.appendChild(toast);
  }
  return toast;
}

/**
 * Applies the base styles to the toast element.
 * 
 * @param {HTMLDivElement} toast - The toast element.
 */
function applyToastBaseStyles(toast) {
  toast.style.position = "fixed";
  toast.style.bottom = "100px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "4px";
  toast.style.zIndex = "1000";
}

/**
 * Styles the toast according to message type and shows it.
 * 
 * @param {HTMLDivElement} toast - The toast element.
 * @param {string} message - Message to display.
 * @param {boolean} isError - Whether the message is an error.
 */
function styleAndShowToast(toast, message, isError) {
  toast.style.backgroundColor = isError ? "#FF3D00" : "#2A3647";
  toast.style.color = "white";
  toast.textContent = message;
  toast.style.display = "block";
}

/**
 * Hides the toast element after a delay.
 * 
 * @param {HTMLDivElement} toast - The toast element.
 * @param {number} delay - Delay in milliseconds before hiding.
 */
function autoHideToast(toast, delay) {
  setTimeout(() => {
    toast.style.display = "none";
  }, delay);
}

