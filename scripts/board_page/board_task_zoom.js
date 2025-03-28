/** ------------------ Opens and Closes Task Zoom ------------------ */
/** Opens the Task Zoom section by removing .d-none and hiding body overflow. */
function openTaskZoomSection() {
    const zoomSec = document.getElementById("taskZoomSection");
    document.getElementById("body").classList.add("overflow-hidden");
    zoomSec.classList.remove("d-none");
  }
  
  /** Closes the Task Zoom section by adding .d-none and restoring body overflow. */
  function closeTaskZoomSection() {
    document.getElementById("body").classList.remove("overflow-hidden");
    document.getElementById("taskZoomSection").classList.add("d-none");
  }
  
  
  /** ------------------ Task Retrieval ------------------ */
  /** Finds a task by its ID in currentUser.tasks. */
  function findTaskById(taskId) {
    return Object.values(currentUser.tasks || {}).find(t => t.id === taskId);
  }
  
  
  /** ------------------ Rendering Category & Close ------------------ */
  /** Renders the task's category and close button in the zoom section. */
  function renderTaskCategoryAndCloseSection(task) {
    let el = document.getElementById("taskCategoryAndCloseSection");
    if (!task.category) return renderCategoryError(el);
  
    let categoryClass = getTaskCategoryClass(task);
    el.innerHTML = `
      <div class="${categoryClass}">
        <span>${task.category}</span>
      </div>
      <div onclick="closeTaskZoomSection()" class="close-subtask-container">
        <img src="./assets/img/closeSubtask.svg" alt="">
      </div>`;
  }
  
  /** Returns a CSS class for the task category. */
  function getTaskCategoryClass(task) {
    return task.category.includes("User Story")
      ? "user-story-container-zoom"
      : "technical-task-container-zoom";
  }
  
  /** Renders a fallback if category is missing. */
  function renderCategoryError(container) {
    container.innerHTML = `<div class="error-message"><span>No category found</span></div>`;
  }
  
  
  /** ------------------ Rendering Subtasks ------------------ */
  /** Renders the subtasks in the zoom section. */
  function renderSubtaskZoomSection(task) {
    let subSec = document.getElementById("subtaskZoomSection");
    subSec.innerHTML = "";
    if (!task.subtasks || typeof task.subtasks !== "object") {
      return subSec.innerHTML = `<span>No subtasks</span>`;
    }
    Object.entries(task.subtasks).forEach(([id, st]) => {
      let checkImg = st.checked ? "checkboxChecked" : "checkboxEmpty";
      subSec.innerHTML += `
        <div class="subtask-zoom">
          <img onclick="checkOrUncheckSubtask('${task.id}','${id}')"
               src="./assets/img/${checkImg}.svg" alt="checkbox">
          <span>${st.subTaskDescription}</span>
        </div>`;
    });
  }
  
  
  /** ------------------ Toggling Subtasks ------------------ */
  /** Toggles the checked state of a subtask and updates Firebase/UI. */
  async function checkOrUncheckSubtask(taskId, subtaskId) {
    try {
      const key = getTaskKeyById(taskId);
      let st = getSubtaskByKey(key, subtaskId);
      st.checked = !st.checked;
      await updateSpecificSubtask(currentUser.id, key, subtaskId, st);
      let task = currentUser.tasks[key];
      renderSubtaskProgress(taskId, task, task.currentStatus);
      refreshTaskColumnAndZoom(taskId, task);
    } catch (err) {
    }
  }
  
  /** Retrieves the task's Firebase key by its ID. */
  function getTaskKeyById(taskId) {
    let k = Object.keys(currentUser.tasks).find(i => currentUser.tasks[i].id === taskId);
    if (!k) throw new Error(`Task not found: ${taskId}`);
    return k;
  }
  
  /** Retrieves a specific subtask from a task. */
  function getSubtaskByKey(taskKey, subtaskId) {
    let st = currentUser.tasks[taskKey].subtasks[subtaskId];
    if (!st) throw new Error(`Subtask not found: ${subtaskId}`);
    return st;
  }
  
  /** Re-renders column and zoom section for a given task. */
  function refreshTaskColumnAndZoom(taskId, task) {
    renderColumn(task.currentStatus, `${task.currentStatus}Notes`);
    renderTaskZoomSection(taskId);
  }
  
  
  /** ------------------ Assigned To & Priority ------------------ */
  /** Renders assigned contacts' circles and names. */
  function renderAssignedToAndCircleNames(task) {
    let sec = document.getElementById("circleAndNameSection");
    sec.innerHTML = "";
    Object.entries(task.assignedTo || {}).forEach(([k, contact]) => {
      let init = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
      let color = getOrAssignColorForTask(task.id, k);
      sec.innerHTML += `
        <div class="name-section">
          <div class="name-circle-add-section" style="background-color: ${color}">
            <span>${init}</span>
          </div>
          <span>${contact.firstName} ${contact.lastName}</span>
        </div>`;
    });
  }
  
  /** Renders the priority icon based on the task's priority. */
  function renderPrioIconImg(priority) {
    let el = document.getElementById("prioIconZoomImg");
    if (priority === "Urgent") el.src = "assets/img/urgentArrowRed.svg";
    else if (priority === "Medium") el.src = "assets/img/Prio media (1).svg";
    else el.src = "assets/img/lowArrowGreeen.svg";
  }
  
  
  /** ------------------ Firebase Updates ------------------ */
  /** Updates a specific subtask in Firebase using PUT. */
  async function updateSpecificSubtask(userId, tKey, sKey, subtask) {
    let url = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${tKey}/subtasks/${sKey}.json`;
    let resp = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subtask)
    });
    if (!resp.ok) throw new Error(`Failed subtask update, status: ${resp.status}`);
  }
  
  
  /** ------------------ Deleting a Task ------------------ */
  /** Deletes a task from Firebase and updates the UI. */
  async function deleteTask(taskId) {
    try {
      let key = getTaskKeyById(taskId);
      await fetchDeleteTaskFromFirebase(key);
      delete currentUser.tasks[key];
      refreshBoardAfterDeletion();
    } catch (err) {
    }
  }
  
  /** Sends a DELETE request to remove a task from Firebase. */
  async function fetchDeleteTaskFromFirebase(taskKey) {
    let url = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${currentUser.id}/tasks/${taskKey}.json`;
    let resp = await fetch(url, { method: "DELETE" });
    if (!resp.ok) throw new Error(`Failed to delete task, status: ${resp.status}`);
  }
  
  /** Re-renders columns and closes the zoom section. */
  function refreshBoardAfterDeletion() {
    renderColumn("done", "doneNotes");
    renderColumn("awaitFeedback", "awaitFeedbackNotes");
    renderColumn("toDo", "toDoNotes");
    renderColumn("inProgress", "inProgressNotes");
    closeTaskZoomSection();
  }
  
  
  /** ------------------ Main Zoom Rendering ------------------ */
  /** Renders the Task Zoom section for a given task ID. */
  function renderTaskZoomSection(taskId) {
    let task = findTaskById(taskId);
    setZoomSectionInnerHTML(task, taskId);
    renderTaskCategoryAndCloseSection(task);
    renderPrioIconImg(task.priority);
    renderAssignedToAndCircleNames(task);
    renderSubtaskZoomSection(task);
  }
  
  /** Sets the innerHTML of #taskZoomSection using the given task and ID. */
  function setZoomSectionInnerHTML(task, taskId) {
    document.getElementById("taskZoomSection").innerHTML = getZoomTaskSection(task, taskId);
  }
  