/**
 * Starts the drag process for a specific task
 * @param {string} taskKey - The ID of the task to drag
 */
function startDragging(taskKey) {
  // No action if no taskKey provided
  if (!taskKey) {
    return;
  }

  // Store current dragged task ID for later use
  currentDraggedTaskId = taskKey;

  // Find the note/card in DOM
  const noteElement = document.querySelector(`[data-task-id="${taskKey}"]`);

  // Save original column for possible return
  if (noteElement && noteElement.parentElement) {
    originalColumnId = noteElement.parentElement.id;
  }

  // Add visual feedback with CSS class
  if (noteElement && noteElement.classList.contains("note")) {
    noteElement.classList.add("rotated-note");
  }
}

/**
 * Ends the drag process and resets visual appearance
 * @param {string} taskKey - The ID of the task for which dragging is ended
 */
function endDragging(taskKey) {
  // Early return if no taskKey
  if (!taskKey) {
    return;
  }

  // Find the element in DOM
  const noteElement = document.querySelector(`[data-task-id="${taskKey}"]`);

  // Remove rotation class if present
  if (noteElement && noteElement.classList.contains("rotated-note")) {
    noteElement.classList.remove("rotated-note");
  }
}

/**
 * Allows dropping on an element by preventing default behavior
 * @param {DragEvent} event - The drop event
 */
function allowDrop(event) {
  // Prevent default behavior to enable drop
  event.preventDefault();
}

/**
 * Processes dropping a dragged element in a target column
 * @param {DragEvent} event - The drop event
 * @param {string} status - The status/name of the target column
 */
function drop(event, status) {
  // Prevent default behavior
  event.preventDefault();

  // Get ID of dragged element from transfer data
  const noteId = event.dataTransfer.getData("text");

  // Find element in DOM
  const noteElement = document.getElementById(noteId);
  if (!noteElement) {
    return;
  }

  // Remove rotation effect
  noteElement.classList.remove("rotated-note");

  // Find target column and append element
  const columnElement = document.getElementById(`${status}Notes`);
  if (columnElement) {
    columnElement.appendChild(noteElement);
  }
}

/**
 * Moves the currently dragged task to a new status and updates the database
 * @param {string} newStatus - The new status for the task
 */
async function moveTo(newStatus) {
  // Find the task key by ID
  const taskKey = Object.keys(currentUser.tasks).find(
    (key) => currentUser.tasks[key].id === currentDraggedTaskId
  );

  // Get the task object
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

    // Reload current data
    await getUsersData();

    // Update current user
    currentUser = users.users[currentUser.id];
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
 * @param {Object} updatedTask - The updated task object
 */
async function updateTaskInFirebase(userId, taskKey, updatedTask) {
  // Construct Firebase URL
  const firebaseUrl = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${taskKey}.json`;

  try {
    // Send PUT request
    const response = await fetch(firebaseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    // Error handling if response not OK
    if (!response.ok) {
      throw new Error(`Error updating task in Firebase: ${response.status}`);
    }
  } catch (error) {
    console.error("Firebase update failed:", error);
    // Possibly more error handling here
  }
}

/**
 * Finds a task by its ID and returns key and object
 * @param {string} taskId - The ID of the task to search for
 * @returns {[string, Object] | null} - Array with key and task object or null if not found
 */
function findTaskById(taskId) {
  // Early exit if no tasks exist
  if (!currentUser || !currentUser.tasks) {
    return null;
  }

  // Search for the matching task key
  const key = Object.keys(currentUser.tasks).find(
    (k) => currentUser.tasks[k].id === taskId
  );

  // If key found, return key and task object, otherwise null
  return key ? [key, currentUser.tasks[key]] : null;
}

/**
 * Shows a dashed placeholder note in the specified column
 * @param {string} columnId - The ID of the column
 */
function showEmptyDashedNote(columnId) {
  // Find column
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
 * Removes the dashed placeholder note from the specified column
 * @param {string} columnId - The ID of the column
 */
function hideEmptyDashedNote(columnId) {
  // Find column
  const column = document.getElementById(columnId);
  if (!column) {
    return;
  }

  // Find placeholder
  const dashedNote = column.querySelector(".empty-dashed-note");

  // If found, remove it
  if (dashedNote) {
    dashedNote.remove();
  }
}
