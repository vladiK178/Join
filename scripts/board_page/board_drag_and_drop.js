/**
 * Variables to track drag and drop state
 */
let currentDraggedElement = null;
let draggedTaskId = null;
let originalColumn = null;

/**
 * Initiates drag operation for a task
 * @param {string} taskId - ID of the task being dragged
 * @param {Event} event - The drag event
 */
function startDragging(taskId, event) {
  // Set task references for the drag operation
  draggedTaskId = taskId;
  currentDraggedElement = event.target;
  originalColumn = event.target.parentElement.id;

  // Set data for HTML5 drag/drop API
  event.dataTransfer.setData("text", taskId);

  // Visual feedback with slight delay for animation
  setTimeout(() => {
    currentDraggedElement.classList.add("rotated-note");
  }, 10);
}

/**
 * Handles the end of drag operation
 */
function endDragging() {
  // Reset visual state
  if (currentDraggedElement) {
    currentDraggedElement.classList.remove("rotated-note");
  }

  // Clean up any drop indicators
  document.querySelectorAll(".empty-dashed-note").forEach((el) => el.remove());

  // Reset tracking variables
  currentDraggedElement = null;
  draggedTaskId = null;
}

/**
 * Shows drop indicator when hovering over column
 * @param {string} columnId - Target column ID
 */
function showEmptyDashedNote(columnId) {
  const column = document.getElementById(columnId);
  if (!column) return;

  // Avoid multiple indicators
  if (column.querySelector(".empty-dashed-note")) return;

  // Add visual placeholder
  const emptyNote = document.createElement("div");
  emptyNote.className = "empty-dashed-note";
  column.appendChild(emptyNote);
}

/**
 * Removes drop indicator when leaving column
 * @param {string} columnId - Column ID to remove indicator from
 */
function hideEmptyDashedNote(columnId) {
  const column = document.getElementById(columnId);
  if (!column) return;

  const emptyNote = column.querySelector(".empty-dashed-note");
  if (emptyNote) emptyNote.remove();
}

/**
 * Allows drops on elements during drag
 * @param {Event} event - The drag event
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles task dropping to update status
 * @param {Event} event - The drop event
 * @param {string} targetStatus - New status for the task
 */
function drop(event, targetStatus) {
  event.preventDefault();

  // Get task ID from data transfer
  const taskId = event.dataTransfer.getData("text");
  if (!taskId) return;

  // Find task element
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!taskElement) return;

  // Find task in user data
  const taskKey = findTaskKeyById(taskId);
  if (!taskKey) {
    console.error(`Task not found: ${taskId}`);
    return;
  }

  // Check if status actually changed
  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  if (originalStatus === targetStatus) return;

  // Update task status in memory
  currentUser.tasks[taskKey].currentStatus = targetStatus;

  // Save to database and update UI
  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      refreshAllColumns();
      showSuccessToast("Task moved successfully!");
    })
    .catch((error) => {
      console.error("Failed to update task:", error);

      // Revert change in memory
      currentUser.tasks[taskKey].currentStatus = originalStatus;
      refreshAllColumns();
      showSuccessToast("Failed to move task. Please try again.", true);
    });
}

/**
 * Finds task key by ID
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
 * Handles direct column selection for task movement
 * @param {string} targetStatus - Column to move task to
 */
function moveTo(targetStatus) {
  if (!draggedTaskId) return;

  const taskKey = findTaskKeyById(draggedTaskId);
  if (!taskKey) return;

  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  if (originalStatus === targetStatus) return;

  // Update status and save
  currentUser.tasks[taskKey].currentStatus = targetStatus;
  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      refreshAllColumns();
      showSuccessToast("Task moved successfully!");
    })
    .catch((error) => {
      console.error("Failed to update task:", error);
      currentUser.tasks[taskKey].currentStatus = originalStatus;
      refreshAllColumns();
      showSuccessToast("Failed to move task. Please try again.", true);
    });
}

/**
 * Shows feedback toast message
 * @param {string} message - Text to display
 * @param {boolean} isError - Whether it's an error
 */
function showSuccessToast(message, isError = false) {
  // Create or reuse toast element
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
  }

  // Set style based on message type
  toast.style.backgroundColor = isError ? "#FF3D00" : "#2A3647";
  toast.style.color = "white";
  toast.textContent = message;
  toast.style.display = "block";

  // Auto-hide after delay
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
