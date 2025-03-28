/**
 * Starts the dragging process for a specific task.
 * @param {string} taskKey - The key of the task to be dragged.
 */
function startDragging(taskKey) {
    if (!taskKey) { return; }
    currentDraggedTaskId = taskKey;
    const note = document.querySelector(`[data-task-id="${taskKey}"]`);
    if (note && note.parentElement) {
      originalColumnId = note.parentElement.id;
    }
    if (note && note.classList.contains('note')) {
      note.classList.add('rotated-note');
    }
  }
  
  
  /**
   * Ends the dragging process for a specific task.
   * @param {string} taskKey - The key of the task for which dragging is ended.
   */
  function endDragging(taskKey) {
    if (!taskKey) { return; }
    const note = document.querySelector(`[data-task-id="${taskKey}"]`);
    if (note && note.classList.contains('rotated-note')) {
      note.classList.remove('rotated-note');
    }
  }
  
  
  /**
   * Allows the drop event to occur on an element.
   * @param {DragEvent} event - The drop event.
   */
  function allowDrop(event) {
    event.preventDefault();
  }
  
  
  /**
   * Handles the drop event and moves the dragged item to the target column.
   * @param {DragEvent} event - The drop event.
   * @param {string} status - The status of the target column.
   */
  function drop(event, status) {
    event.preventDefault();
    const noteId = event.dataTransfer.getData('text');
    const note = document.getElementById(noteId);
    if (!note) { return; }
    note.classList.remove('rotated-note');
    const column = document.getElementById(`${status}Notes`);
    if (column) {
      column.appendChild(note);
    }
  }
  
  
  /**
   * Moves the currently dragged task to a new status.
   * @async
   * @param {string} newStatus - The new status for the task.
   * @returns {Promise<void>}
   */
  async function moveTo(newStatus) {
    const tK = Object.keys(currentUser.tasks).find(k => currentUser.tasks[k].id === currentDraggedTaskId);
    const t = currentUser.tasks[tK];
    if (!tK || !t) { return; }
  
    t.currentStatus = newStatus;
  
    try {
      await updateTaskInFirebase(currentUser.id, tK, t);
      await getUsersData();
      currentUser = users.users[currentUser.id];
    } catch (e) {
      return;
    }
  
    renderColumns();
  }
  
  
  /**
   * Renders all columns for the current user.
   */
  function renderColumns() {
    if (!currentUser || !currentUser.tasks) { return; }
    renderColumn("toDo", "toDoNotes");
    renderColumn("inProgress", "inProgressNotes");
    renderColumn("awaitFeedback", "awaitFeedbackNotes");
    renderColumn("done", "doneNotes");
  }
  
  
  /**
   * Updates a specific task in Firebase.
   * @async
   * @param {string} uId - The user ID.
   * @param {string} tK - The task key.
   * @param {Object} uT - The task object to be updated.
   * @returns {Promise<void>}
   */
  async function updateTaskInFirebase(uId, tK, uT) {
    const url = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${uId}/tasks/${tK}.json`;
    try {
      const r = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uT),
      });
      if (!r.ok) {
        throw new Error(`Error updating task in Firebase, status: ${r.status}`);
      }
    } catch (e) {
      // Handle error if needed
    }
  }
  
  
  /**
   * Finds a task by its ID within the current user's tasks.
   * @param {string} taskId - The ID of the task to find.
   * @returns {[string, Object] | null} - Returns an array containing the task key and task object, or null if not found.
   */
  function findTaskById(taskId) {
    const key = Object.keys(currentUser.tasks || {}).find(k => currentUser.tasks[k].id === taskId);
    return key ? [key, currentUser.tasks[key]] : null;
  }
  
  
  /**
   * Shows a dashed placeholder note in the specified column.
   * @param {string} columnId - The ID of the column to which the dashed note will be added.
   */
  function showEmptyDashedNote(columnId) {
    const col = document.getElementById(columnId);
    if (!col) { return; }
    if (!col.querySelector('.empty-dashed-note')) {
      const d = document.createElement('div');
      d.classList.add('empty-dashed-note');
      d.style.width = "100%";
      d.style.height = "250px";
      d.style.border = "1px dashed #A8A8A8";
      d.style.borderRadius = "32px";
      col.appendChild(d);
    }
  }
  
  
  /**
   * Hides the dashed placeholder note in the specified column.
   * @param {string} cId - The ID of the column from which the dashed note will be removed.
   */
  function hideEmptyDashedNote(cId) {
    const col = document.getElementById(cId);
    if (!col) { return; }
    const d = col.querySelector('.empty-dashed-note');
    if (d) {
      d.remove();
    }
  }
  