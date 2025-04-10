function resetForm() {
  resetFormInputs();
  resetCategory();
  resetPriority();
  resetDropDowns();
  resetSubtasksUI();
  resetAssignedCheckBoxes();
  renderNameCircles();
}

function resetFormInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("subtask").value = "";
}

function resetCategory() {
  document.getElementById("selectTaskCategorySpan").innerText =
    "Select task category";
  document.getElementById("categoryDropDownSection").classList.add("d-none");
}

function resetPriority() {
  document.getElementById("prioUrgent").classList.remove("prio-urgent-chosen");
  document.getElementById("prioUrgent").classList.add("prio-urgent");
  document.getElementById("prioMedium").classList.add("prio-medium-chosen");
  document.getElementById("prioLow").classList.remove("prio-low-chosen");
  document.getElementById("prioLow").classList.add("prio-low");
}

function resetDropDowns() {
  document.getElementById("dropDownSection").classList.add("d-none");
}

function resetSubtasksUI() {
  currentSubTask = {};
  document.getElementById("subtaskSection").innerHTML = "";
}

function resetAssignedCheckBoxes() {
  const c = currentUser.contacts || {};
  for (let i = 0; i < c.length; i++) {
    let box = document.getElementById(`assignedToCheckbox${i}`);
    if (box) {
      box.checked = false;
      choseNameAndShowCircle(i);
    }
  }
}
