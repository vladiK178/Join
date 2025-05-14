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

  // Skip if status not changed
  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  if (originalStatus === targetStatus) return;

  // Update task status in memory
  currentUser.tasks[taskKey].currentStatus = targetStatus;

  // Save to database and update UI
  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      refreshAllColumns();
      showToastMessage("Task moved successfully!");
    })
    .catch((error) => {
      console.error("Failed to update task:", error);

      // Revert change on error
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
 * Handles column selection for task movement
 * @param {string} targetStatus - Column to move task to
 */
function moveTo(targetStatus) {
  if (!draggedTaskId) return;

  const taskKey = findTaskKeyById(draggedTaskId);
  if (!taskKey) return;

  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  if (originalStatus === targetStatus) return;

  // Update status in memory
  currentUser.tasks[taskKey].currentStatus = targetStatus;

  // Save to database
  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      refreshAllColumns();
      showToastMessage("Task moved successfully!");
    })
    .catch((error) => {
      console.error("Failed to update task:", error);

      // Revert on error
      currentUser.tasks[taskKey].currentStatus = originalStatus;
      refreshAllColumns();
      showToastMessage("Failed to move task. Please try again.", true);
    });
}

/**
 * Shows feedback message to user
 * @param {string} message - Text to display
 * @param {boolean} isError - Whether message is an error
 */
function showToastMessage(message, isError = false) {
  // Create toast element
  let toast = document.getElementById("toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-message";
    toast.style.position = "fixed";
    toast.style.bottom = "100px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
  }

  // Set style and content
  toast.style.backgroundColor = isError ? "#FF3D00" : "#2A3647";
  toast.style.color = "white";
  toast.textContent = message;
  toast.style.display = "block";

  // Auto-hide after delay
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
