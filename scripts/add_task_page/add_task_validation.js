/**
 * Validates if the title input field has a value.
 * @returns {boolean} True if title is valid.
 */
function validateTitle() {
  const titleInput = document.getElementById("title");
  const alert = document.getElementById("alertMessageTitle");

  if (!titleInput || titleInput.value.trim() === "") {
    alert.classList.remove("d-none");
    titleInput.classList.add("input-error");
    return false;
  }

  alert.classList.add("d-none");
  titleInput.classList.remove("input-error");
  return true;
}

/**
 * Checks if any contact checkbox is checked.
 * @param {Object} contacts - Contacts object.
 * @returns {boolean} True if any contact is checked.
 */
function isAnyContactChecked(contacts) {
  for (const key in contacts) {
    const checkbox = document.getElementById(`assignedToCheckbox${key}`);
    if (checkbox?.checked) return true;
  }
  return false;
}

/**
 * Validates if at least one assigned contact is selected.
 * Shows error if none selected.
 * @returns {boolean} True if valid (at least one checked).
 */
function validateAssignedContacts() {
  const contacts = currentUser.contacts || {};
  const assignedToId = document.getElementById("alertMessageAssignedTo");
  const assignedToSection = document.getElementById("assignedToSection");
  const atLeastOneChecked = isAnyContactChecked(contacts);

  if (!atLeastOneChecked) {
    assignedToId.classList.remove("d-none");
    assignedToSection.classList.add("input-error");
    return false;
  }

  assignedToId.classList.add("d-none");
  assignedToSection.classList.remove("input-error");
  return true;
}

/**
 * Checks if the given date string is invalid.
 * Returns an error message or empty string if valid.
 * @param {string} dateValue - Date string in YYYY-MM-DD format.
 * @returns {string} Error message or empty string.
 */
function isDateInvalid(dateValue) {
  if (!dateValue) return "Please select a date.";
  const selected = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) return "Date cannot be in the past.";
  return "";
}

/**
 * Validates the due date input.
 * Shows error if invalid or missing.
 * @returns {boolean} True if date is valid.
 */
function validateEndDate() {
  const dateInput = document.getElementById("date");
  const alert = document.getElementById("alertMessageDate");
  const errorMessage = isDateInvalid(dateInput?.value);

  if (errorMessage) {
    alert.textContent = errorMessage;
    alert.classList.remove("d-none");
    dateInput.classList.add("input-error");
    return false;
  }

  alert.classList.add("d-none");
  dateInput.classList.remove("input-error");
  return true;
}

/**
 * Gets today's date as a string in YYYY-MM-DD format.
 * @returns {string} Today's date string.
 */
function getLocalTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Sets the minimum selectable date for the date input to today.
 */
function setMinDateToday() {
  const today = getLocalTodayDateString();
  document.getElementById("date").setAttribute("min", today);
}

/**
 * Sets the minimum date for the date input and focuses the input.
 */
function focusDateInput() {
  setMinDateToday();
  document.getElementById("date").focus();
}

/**
 * Validates if a valid category is selected.
 * Shows error if none or invalid.
 * @returns {boolean} True if a valid category is selected.
 */
function validateCategory() {
  const categorySpan = document.getElementById("selectTaskCategorySpan");
  const categorySection = document.getElementById("categorySection");
  const validCategories = ["Technical Task", "User Story"];
  const categorySelectionId = document.getElementById("alertMessageCategory");

  if (
    !categorySpan ||
    !validCategories.some((cat) => categorySpan.innerText.includes(cat))
  ) {
    categorySelectionId.classList.remove("d-none");
    categorySection.classList.add("input-error");
    return false;
  }

  categorySelectionId.classList.add("d-none");
  categorySection.classList.remove("input-error");
  return true;
}

/**
 * Collects selected assigned contacts from checkboxes.
 * @returns {Object} Object of selected contacts keyed by contact ID.
 */
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

/**
 * Gets the currently selected category from the UI.
 * @returns {string} The selected category.
 */
function getSelectedCategory() {
  const categorySpan = document.getElementById("selectTaskCategorySpan");
  return categorySpan.innerText.includes("Technical Task")
    ? "Technical Task"
    : "User Story";
}

/**
 * Gets the selected priority from the UI.
 * @returns {string} Selected priority ("Urgent", "Medium", or "Low").
 */
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

/**
 * Validates all required form fields and displays error messages.
 * @returns {boolean} True if all validations pass.
 */
function validateForm() {
  const titleValid = validateTitle();
  const assignedValid = validateAssignedContacts();
  const dateValid = validateEndDate();
  const categoryValid = validateCategory();

  if (!titleValid || !assignedValid || !dateValid || !categoryValid) {
    rotateMessage();
  }

  return titleValid && assignedValid && dateValid && categoryValid;
}
