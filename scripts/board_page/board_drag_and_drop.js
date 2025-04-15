/**
 * Variables to track drag and drop state
 */
let currentDraggedElement = null;
let draggedTaskId = null;
let originalColumn = null;

/**
 * Begins the drag operation when a task is being dragged
 * @param {string} taskId - ID of the task being dragged
 * @param {Event} event - The drag event
 */
function startDragging(taskId, event) {
  // Store reference to current task
  draggedTaskId = taskId;
  currentDraggedElement = event.target;
  originalColumn = event.target.parentElement.id;

  // Set data transfer for HTML5 drag and drop
  event.dataTransfer.setData("text", taskId);

  // Visual feedback
  setTimeout(() => {
    currentDraggedElement.classList.add("rotated-note");
  }, 10);
}

/**
 * Handles the end of a drag operation
 */
function endDragging() {
  // Reset task appearance when drag operation ends
  if (currentDraggedElement) {
    currentDraggedElement.classList.remove("rotated-note");
  }

  // Remove any drop indicators
  document.querySelectorAll(".empty-dashed-note").forEach((element) => {
    element.remove();
  });

  // Reset tracking variables
  currentDraggedElement = null;
  draggedTaskId = null;
}

/**
 * Shows a dashed outline when dragging over a column
 * @param {string} columnId - ID of the column
 */
function showEmptyDashedNote(columnId) {
  // Get column element
  const column = document.getElementById(columnId);
  if (!column) return;

  // Don't add another placeholder if one already exists
  if (column.querySelector(".empty-dashed-note")) return;

  // Create and append placeholder element
  const emptyNote = document.createElement("div");
  emptyNote.className = "empty-dashed-note";
  column.appendChild(emptyNote);
}

/**
 * Removes the dashed outline when not dragging over a column
 * @param {string} columnId - ID of the column
 */
function hideEmptyDashedNote(columnId) {
  // Get column element
  const column = document.getElementById(columnId);
  if (!column) return;

  // Find and remove any placeholders
  const emptyNote = column.querySelector(".empty-dashed-note");
  if (emptyNote) {
    emptyNote.remove();
  }
}

/**
 * Handles the drop event when a task is dropped into a column
 * @param {Event} event - The drop event
 * @param {string} targetStatus - Status of the target column
 */
function drop(event, targetStatus) {
  event.preventDefault();

  // Get the task ID from the data transfer
  const taskId = event.dataTransfer.getData("text");
  if (!taskId) return;

  // Find task element
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!taskElement) return;

  // Find the task key in the user's data
  const taskKey = Object.keys(currentUser.tasks || {}).find(
    (key) => currentUser.tasks[key].id === taskId
  );

  if (!taskKey) {
    console.error(`Task not found with ID: ${taskId}`);
    return;
  }

  // Update the task status in memory
  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  if (originalStatus === targetStatus) {
    // If dropping in the same column, do nothing
    return;
  }

  // Update task status in memory and database
  currentUser.tasks[taskKey].currentStatus = targetStatus;
  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      // Successfully updated in database
      // Reload columns to reflect the new state
      renderColumn("toDo", "toDoNotes");
      renderColumn("inProgress", "inProgressNotes");
      renderColumn("awaitFeedback", "awaitFeedbackNotes");
      renderColumn("done", "doneNotes");

      // Show success message
      showSuccessToast("Task moved successfully!");
    })
    .catch((error) => {
      // Error handling
      console.error("Failed to update task status:", error);

      // Revert the change in memory
      currentUser.tasks[taskKey].currentStatus = originalStatus;

      // Show error message
      showSuccessToast("Failed to move task. Please try again.", true);

      // Reload columns to reflect original state
      renderColumn("toDo", "toDoNotes");
      renderColumn("inProgress", "inProgressNotes");
      renderColumn("awaitFeedback", "awaitFeedbackNotes");
      renderColumn("done", "doneNotes");
    });
}

/**
 * Handles dropping a task to a specific column
 * @param {string} targetStatus - Name of the target column/status
 */
function moveTo(targetStatus) {
  // Check if we have a task being dragged
  if (!draggedTaskId) return;

  // Find the task in the data
  const taskKey = Object.keys(currentUser.tasks || {}).find(
    (key) => currentUser.tasks[key].id === draggedTaskId
  );

  if (!taskKey) {
    console.error(`Task not found with ID: ${draggedTaskId}`);
    return;
  }

  // Update task status in memory and database
  const originalStatus = currentUser.tasks[taskKey].currentStatus;
  if (originalStatus === targetStatus) return;

  currentUser.tasks[taskKey].currentStatus = targetStatus;

  // Send update to database
  updateTaskColumnInDatabase(currentUser.id, taskKey, targetStatus)
    .then(() => {
      // Re-render all columns to reflect changes
      renderColumn("toDo", "toDoNotes");
      renderColumn("inProgress", "inProgressNotes");
      renderColumn("awaitFeedback", "awaitFeedbackNotes");
      renderColumn("done", "doneNotes");

      // Success feedback
      showSuccessToast("Task moved successfully!");
    })
    .catch((error) => {
      // Error handling
      console.error("Failed to update task:", error);

      // Revert the memory change
      currentUser.tasks[taskKey].currentStatus = originalStatus;

      // Error feedback
      showSuccessToast("Failed to move task. Please try again.", true);

      // Reload to original state
      renderColumn("toDo", "toDoNotes");
      renderColumn("inProgress", "inProgressNotes");
      renderColumn("awaitFeedback", "awaitFeedbackNotes");
      renderColumn("done", "doneNotes");
    });
}

/**
 * Displays a toast notification to the user
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether it's an error message
 */
function showSuccessToast(message, isError = false) {
  // Create toast element if it doesn't exist
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

  // Set toast styles based on message type
  toast.style.backgroundColor = isError ? "#FF3D00" : "#2A3647";
  toast.style.color = "white";
  toast.textContent = message;

  // Show toast
  toast.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
