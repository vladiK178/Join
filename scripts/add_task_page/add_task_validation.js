function validateTitle() {
  const titleInput = document.getElementById("title");
  const alert = document.getElementById("alertMessageTitle");

  if (!titleInput || titleInput.value.trim() === "") {
    alert.classList.remove("hide-alert-message");
    rotateMessage();
    return false;
  }

  alert.classList.add("hide-alert-message");
  return true;
}

function validateAssignedContacts() {
  const contacts = currentUser.contacts || {};
  let atLeastOneChecked = false;

  for (const key in contacts) {
    const checkbox = document.getElementById(`assignedToCheckbox${key}`);
    if (checkbox?.checked) {
      atLeastOneChecked = true;
      break;
    }
  }

  if (!atLeastOneChecked) rotateMessage();
  return atLeastOneChecked;
}

function validateEndDate() {
  const dateInput = document.getElementById("date");
  const alert = document.getElementById("alertMessageDate");

  if (!dateInput || !dateInput.value) {
    alert.classList.remove("hide-alert-message");
    rotateMessage();
    return false;
  }

  alert.classList.add("hide-alert-message");
  return true;
}

function validateCategory() {
  const categorySpan = document.getElementById("selectTaskCategorySpan");
  const validCategories = ["Technical Task", "User Story"];

  if (
    !categorySpan ||
    !validCategories.some((cat) => categorySpan.innerText.includes(cat))
  ) {
    rotateMessage();
    return false;
  }

  return true;
}

function collectAssignedContacts() {
  const contacts = currentUser.contacts || {};
  const selectedContacts = {};

  for (const key in contacts) {
    const checkbox = document.getElementById(`assignedToCheckbox${key}`);
    if (checkbox?.checked) {
      selectedContacts[`contact_${key}`] = {
        firstName: contacts[key].firstNameContact,
        lastName: contacts[key].lastNameContact,
      };
    }
  }

  return selectedContacts;
}

function getSelectedCategory() {
  const categorySpan = document.getElementById("selectTaskCategorySpan");
  return categorySpan.innerText.includes("Technical Task")
    ? "Technical Task"
    : "User Story";
}

function getSelectedPriority() {
  if (
    document
      .getElementById("prioUrgent")
      .classList.contains("prio-urgent-chosen")
  )
    return "Urgent";
  if (
    document
      .getElementById("prioMedium")
      .classList.contains("prio-medium-chosen")
  )
    return "Medium";
  return "Low";
}
