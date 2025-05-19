/**
 * Resets the entire form by clearing inputs, selections, and UI elements.
 */
function resetForm() {
  resetFormInputs();
  resetCategory();
  resetPriority();
  resetDropDowns();
  resetSubtasksUI();
  resetAssignedCheckBoxes();
  renderNameCircles();
}

/**
 * Clears all text input fields in the form.
 */
function resetFormInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("subtask").value = "";
}

/**
 * Resets the task category selection to the default placeholder.
 */
function resetCategory() {
  document.getElementById("selectTaskCategorySpan").innerText =
    "Select task category";
  document.getElementById("categoryDropDownSection").classList.add("d-none");
}

/**
 * Resets the priority buttons to their default states.
 * Sets "Medium" as chosen by default and clears other selections.
 */
function resetPriority() {
  document.getElementById("prioUrgent").classList.remove("prio-urgent-chosen");
  document.getElementById("prioUrgent").classList.add("prio-urgent");
  document.getElementById("prioMedium").classList.add("prio-medium-chosen");
  document.getElementById("prioLow").classList.remove("prio-low-chosen");
  document.getElementById("prioLow").classList.add("prio-low");
}

/**
 * Hides all dropdown sections in the form.
 */
function resetDropDowns() {
  document.getElementById("dropDownSection").classList.add("d-none");
}

/**
 * Clears all subtasks from the UI and resets the subtasks data structure.
 */
function resetSubtasksUI() {
  currentSubTask = {};
  document.getElementById("subtaskSection").innerHTML = "";
}

/**
 * Unchecks all assigned-to checkboxes and updates their UI accordingly.
 * Iterates through all current user contacts.
 */
function resetAssignedCheckBoxes() {
  const contacts = currentUser.contacts || {};
  for (let i = 0; i < contacts.length; i++) {
    const box = document.getElementById(`assignedToCheckbox${i}`);
    if (box) {
      box.checked = false;
      choseNameAndShowCircle(i);
    }
  }
}
