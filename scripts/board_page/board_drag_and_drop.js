/**
 * Variables to track drag and drop state
 */
let currentDraggedTaskId = null;
let originalColumnId = null;

/**
 * Starts the drag operation for a task
 * @param {string} taskId - ID of the task being dragged
 */
function startDragging(taskId) {
  // Store task ID for later use
  currentDraggedTaskId = taskId;

  // Find the task element
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

  // Store original column ID for potential cancelation
  if (taskElement && taskElement.parentElement) {
    originalColumnId = taskElement.parentElement.id;
  }

  // Add visual feedback for dragging
  if (taskElement && taskElement.classList.contains("note")) {
    taskElement.classList.add("rotated-note");
  }
}

/**
 * Ends the drag operation and resets visual styles
 * @param {string} taskId - ID of the task being dragged
 */
function endDragging(taskId) {
  if (!taskId) return;

  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

  // Remove rotation effect
  if (taskElement && taskElement.classList.contains("rotated-note")) {
    taskElement.classList.remove("rotated-note");
  }
}

/**
 * Allows dropping by preventing default behavior
 * @param {DragEvent} event - The drag event object
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles dropping a task in a column
 * @param {DragEvent} event - The drop event
 * @param {string} status - Target column status
 */
function drop(event, status) {
  // Prevent default browser action
  event.preventDefault();

  // Get the dragged task ID from transfer data
  const noteId = event.dataTransfer.getData("text");

  // Find task element
  const noteElement = document.getElementById(noteId);
  if (!noteElement) {
    return;
  }

  // Remove rotation effect
  noteElement.classList.remove("rotated-note");

  // Find target column and append task
  const columnElement = document.getElementById(`${status}Notes`);
  if (columnElement) {
    columnElement.appendChild(noteElement);
  }
}

/**
 * Moves the currently dragged task to a new status column and updates the database
 * @param {string} newStatus - Target status column
 */
async function moveTo(newStatus) {
  // Find task key by ID
  const taskKey = Object.keys(currentUser.tasks).find(
    (key) => currentUser.tasks[key].id === currentDraggedTaskId
  );

  // Get task object
  const taskObj = currentUser.tasks[taskKey];

  // If task not found, abort
  if (!taskKey || !taskObj) {
    return;
  }

  // Update status
  taskObj.currentStatus = newStatus;

  try {
    // Update in Firebase
    await updateTaskInFirebase(currentUser.id, taskKey, taskObj);

    // Reload data from Firebase
    await getUsersData();

    // Update current user data
    currentUser = users[currentUser.id];
  } catch (error) {
    console.error("Error moving task:", error);
    return;
  }

  // Re-render board
  renderAllColumns();
}

/**
 * Re-renders all columns of the board
 */
function renderAllColumns() {
  // Check if user and tasks exist
  if (!currentUser || !currentUser.tasks) {
    return;
  }

  // Render all columns
  renderColumn("toDo", "toDoNotes");
  renderColumn("inProgress", "inProgressNotes");
  renderColumn("awaitFeedback", "awaitFeedbackNotes");
  renderColumn("done", "doneNotes");
}

/**
 * Updates a task in the Firebase database
 * @param {string} userId - The user ID
 * @param {string} taskKey - The key of the task
 * @param {object} updatedTask - The updated task object
 */
async function updateTaskInFirebase(userId, taskKey, updatedTask) {
  // Create Firebase URL
  const firebaseUrl = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${taskKey}.json`;

  try {
    // Send PUT request
    const response = await fetch(firebaseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    // Check response status
    if (!response.ok) {
      throw new Error(`Error updating task in Firebase: ${response.status}`);
    }
  } catch (error) {
    console.error("Firebase update failed:", error);
    throw error;
  }
}

/**
 * Finds a task by its ID and returns key and object
 * @param {string} taskId - Task ID to find
 * @returns {[string, object]|null} Array with key and task or null if not found
 */
function findTaskById(taskId) {
  // Check if tasks exist
  if (!currentUser || !currentUser.tasks) {
    return null;
  }

  // Find task key
  const key = Object.keys(currentUser.tasks).find(
    (k) => currentUser.tasks[k].id === taskId
  );

  // Return key and task or null
  return key ? [key, currentUser.tasks[key]] : null;
}

/**
 * Shows a dashed placeholder in a column when dragging over
 * @param {string} columnId - ID of the column
 */
function showEmptyDashedNote(columnId) {
  // Get column element
  const column = document.getElementById(columnId);
  if (!column) {
    return;
  }

  // Check if placeholder already exists
  if (!column.querySelector(".empty-dashed-note")) {
    // Create placeholder element
    const dashedNote = document.createElement("div");
    dashedNote.classList.add("empty-dashed-note");

    // Add styling
    dashedNote.style.width = "100%";
    dashedNote.style.height = "250px";
    dashedNote.style.border = "1px dashed #A8A8A8";
    dashedNote.style.borderRadius = "32px";

    // Add to column
    column.appendChild(dashedNote);
  }
}

/**
 * Removes the dashed placeholder from a column
 * @param {string} columnId - ID of the column
 */
function hideEmptyDashedNote(columnId) {
  // Get column element
  const column = document.getElementById(columnId);
  if (!column) {
    return;
  }

  // Find and remove placeholder
  const dashedNote = column.querySelector(".empty-dashed-note");
  if (dashedNote) {
    dashedNote.remove();
  }
}
