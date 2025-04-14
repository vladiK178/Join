/** 
 * Current task that is being dragged
 * @type {string} 
 */
let currentDraggedTaskId;

/**
 * Original column of the dragged task
 * @type {string}
 */
let originalColumnId;

/**
 * Initiates drag operation for a task
 * @param {string} taskKey - ID of the task to drag
 */
function startDragging(taskKey) {
  if (!taskKey) return;
  
  currentDraggedTaskId = taskKey;
  const taskElement = document.querySelector(`[data-task-id="${taskKey}"]`);
  
  // Store original column for possible cancelation
  if (taskElement && taskElement.parentElement) {
    originalColumnId = taskElement.parentElement.id;
  }
  
  // Add visual feedback for dragging
  if (taskElement && taskElement.classList.contains("note")) {
    taskElement.classList.add("rotated-note");
  }
}

/**
 * Ends drag operation and restores visual state
 * @param {string} taskKey - ID of the task being dragged
 */
function endDragging(taskKey) {
  if (!taskKey) return;
  
  const taskElement = document.querySelector(`[data-task-id="${taskKey}"]`);
  
  // Remove visual effect
  if (taskElement && taskElement.classList.contains("rotated-note")) {
    taskElement.classList.remove("rotated-note");
  }
}

/**
 * Allows dropping by preventing default behavior
 * @param {DragEvent} event - The drag event
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles the drop of a task element
 * @param {DragEvent} event - The drop event
 * @param {string} status - Target column status
 */
function drop(event, status) {
  event.preventDefault();
  
  const taskId = event.dataTransfer.getData("text");
  const taskElement = document.getElementById(taskId);
  
  if (!taskElement) return;
  
  // Remove rotation effect
  taskElement.classList.remove("rotated-note");
  
  // Add to target column
  const targetColumn = document.getElementById(`${status}Notes`);
  if (targetColumn) {
    targetColumn.appendChild(taskElement);
    
    // Show success notification
    showStatusChangeNotification(status);
  }
}

/**
 * Moves task to a new status column and updates database
 * @param {string} newStatus - Target status for the task
 */
async function moveTo(newStatus) {
  try {
    // Find task by ID
    const taskKey = findTaskKeyById(currentDraggedTaskId);
    if (!taskKey) {
      console.error("Task not found:", currentDraggedTaskId);
      return;
    }

    // Get task object
    const taskObj = currentUser.tasks[taskKey];
    if (!taskObj) {
      console.error("Task object not found for key:", taskKey);
      return;
    }

    // Save old status for notification
    const oldStatus = taskObj.currentStatus;
    
    // Update status
    taskObj.currentStatus = newStatus;

    // Save to Firebase
    await updateTaskInFirebase(currentUser.id, taskKey, taskObj);
    
    // Reload data and refresh UI
    await getUsersData();
    currentUser = users[currentUser.id];
    
    // Show success notification
    showStatusChangeNotification(newStatus, oldStatus);
    
    // Update board
    renderAllColumns();
    
  } catch (error) {
    console.error("Error moving task:", error);
    // Show error notification
    showErrorNotification("Fehler beim Verschieben des Tasks");
    
    // Restore original placement if possible
    if (originalColumnId) {
      const taskElement = document.querySelector(`[data-task-id="${currentDraggedTaskId}"]`);
      const originalColumn = document.getElementById(originalColumnId);
      if (taskElement && originalColumn) {
        originalColumn.appendChild(taskElement);
      }
    }
  }
}

/**
 * Finds task key by task ID
 * @param {string} taskId - Task ID to find
 * @returns {string|null} Task key if found, null if not
 */
function findTaskKeyById(taskId) {
  if (!currentUser || !currentUser.tasks) return null;
  
  return Object.keys(currentUser.tasks).find(
    key => currentUser.tasks[key].id === taskId
  ) || null;
}

/**
 * Updates a task in Firebase database
 * @param {string} userId - User ID
 * @param {string} taskKey - Task key in database
 * @param {Object} updatedTask - Updated task object
 * @returns {Promise<void>}
 */
async function updateTaskInFirebase(userId, taskKey, updatedTask) {
  const firebaseUrl = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${taskKey}.json`;

  const response = await fetch(firebaseUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  });

  if (!response.ok) {
    throw new Error(`Error updating task: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Shows a temporary notification for status changes
 * @param {string} newStatus - New task status
 * @param {string} oldStatus - Previous task status (optional)
 */
function showStatusChangeNotification(newStatus, oldStatus = null) {
  // Create status text based on column
  let statusText = "";
  switch(newStatus) {
    case "toDo": statusText = "To Do"; break;
    case "inProgress": statusText = "In Progress"; break;
    case "awaitFeedback": statusText = "Await Feedback"; break;
    case "done": statusText = "Done"; break;
    default: statusText = newStatus;
  }
  
  // Create notification element
  const notification = document.createElement("div");
  notification.classList.add("status-notification");
  
  // Different message if we have old status
  if (oldStatus && oldStatus !== newStatus) {
    notification.textContent = `Task in "${statusText}" verschoben`;
  } else {
    notification.textContent = `Task ist jetzt in "${statusText}"`;
  }
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Auto-remove after 2 seconds
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

/**
 * Shows error notification
 * @param {string} message - Error message to display
 */
function showErrorNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("error-notification");
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

/**
 * Shows a visual indicator for drop zone
 * @param {string} columnId - ID of column
 */
function showEmptyDashedNote(columnId) {
  const column = document.getElementById(columnId);
  if (!column) return;
  
  // Create only if not already present
  if (!column.querySelector(".empty-dashed-note")) {
    const dropZone = document.createElement("div");
    dropZone.classList.add("empty-dashed-note");
    dropZone.style.width = "100%";
    dropZone.style.height = "200px";
    dropZone.style.border = "2px dashed #A8A8A8";
    dropZone.style.borderRadius = "15px";
    dropZone.style.margin = "15px 0";
    dropZone.style.transition = "all 0.3s ease";
    
    column.appendChild(dropZone);
  }
}

/**
 * Removes the visual drop zone indicator
 * @param {string} columnId - ID of column
 */
function hideEmptyDashedNote(columnId) {
  const column = document.getElementById(columnId);
  if (!column) return;
  
  const dropZone = column.querySelector(".empty-dashed-note");
  if (dropZone) {
    dropZone.remove();
  }
}

/**
 * Renders all four columns of the board
 */
function renderAllColumns() {
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}
