/**
 * Variables to track drag and drop state
 */
let currentDraggedElement = null;
let draggedTaskId = null;
let originalColumn = null;

/**
 * Initiates drag operation and sets up data transfer
 * @param {DragEvent} event - The drag event
 * @param {string} taskId - ID of the task to drag
 */
function startDrag(event, taskId) {
  // Save a reference to the dragged element
  currentDraggedElement = event.target;
  draggedTaskId = taskId;

  // Remember original column
  originalColumn = event.target.parentElement;

  // Set data transfer
  event.dataTransfer.setData("text/plain", taskId);

  // Add visual feedback
  setTimeout(() => {
    event.target.classList.add("rotated-note");
  }, 10);
}

/**
 * Allows drop targets to accept the dragged element
 * @param {DragEvent} event - The dragover event
 */
function allowDrop(event) {
  event.preventDefault();

  // Visual feedback for drop zone
  if (event.target.classList.contains("to-do-notes")) {
    if (!event.target.querySelector(".drop-preview")) {
      const preview = document.createElement("div");
      preview.className = "drop-preview";
      preview.style.height = "100px";
      preview.style.border = "2px dashed #ccc";
      preview.style.borderRadius = "8px";
      preview.style.margin = "10px 0";
      event.target.appendChild(preview);
    }
  }
}

/**
 * Removes drop preview when dragging leaves a column
 * @param {DragEvent} event - The dragleave event
 */
function handleDragLeave(event) {
  // Only process if leaving a column
  if (event.target.classList.contains("to-do-notes")) {
    const preview = event.target.querySelector(".drop-preview");
    if (preview) {
      preview.remove();
    }
  }
}

/**
 * Handles what happens when drag ends (regardless of successful drop)
 * @param {DragEvent} event - The dragend event
 */
function endDrag(event) {
  // Remove visual effects from dragged item
  if (currentDraggedElement) {
    currentDraggedElement.classList.remove("rotated-note");
  }

  // Clean up any lingering preview elements
  document.querySelectorAll(".drop-preview").forEach((preview) => {
    preview.remove();
  });

  // Reset variables
  currentDraggedElement = null;
}

/**
 * Processes the drop action when task is dropped on a column
 * @param {DragEvent} event - The drop event
 * @param {string} columnStatus - Status of target column (to-do, in-progress, etc)
 */
function handleDrop(event, columnStatus) {
  event.preventDefault();

  // Get the dragged task ID
  const taskId = event.dataTransfer.getData("text/plain");

  // Clean up preview
  const preview = event.target.querySelector(".drop-preview");
  if (preview) {
    preview.remove();
  }

  // Find the dragged element
  const draggedElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!draggedElement) return;

  // Add to new column
  event.target.appendChild(draggedElement);

  // Update task status in database
  updateTaskStatus(taskId, columnStatus);

  // End drag cleanly
  endDrag(event);
}

/**
 * Updates a task's status in the database
 * @param {string} taskId - ID of the dragged task
 * @param {string} newStatus - New status (column) for the task
 */
async function updateTaskStatus(taskId, newStatus) {
  try {
    // Find the task in our data
    const taskKey = Object.keys(currentUser.tasks || {}).find(
      (key) => currentUser.tasks[key].id === taskId
    );

    if (!taskKey) return;

    // Update status in memory
    currentUser.tasks[taskKey].currentStatus = newStatus;

    // Update in database
    await updateTaskColumnInDatabase(currentUser.id, taskKey, newStatus);

    // Show success message
    showToastMessage("Task status updated!");
  } catch (error) {
    console.error("Failed to update task status:", error);

    // Show error message
    showToastMessage("Failed to update task. Please try again.", true);
  }
}

/**
 * Shows a toast message to the user
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showToastMessage(message, isError = false) {
  // Create toast if it doesn't exist
  let toast = document.getElementById("toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-message";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "4px";
    toast.style.backgroundColor = isError ? "#ff4d4f" : "#2a3647";
    toast.style.color = "white";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
  }

  // Set message
  toast.textContent = message;
  toast.style.backgroundColor = isError ? "#ff4d4f" : "#2a3647";

  // Show toast
  toast.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
