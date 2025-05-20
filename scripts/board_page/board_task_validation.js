/**
 * Validates if the title input field has a value
 * @returns {boolean} True if title is valid
 */
function validateBoardTitle() {
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
 * Validates if a valid due date is selected and not in the past.
 * 
 * @returns {boolean} True if the due date is valid.
 */
function validateBoardDueDate() {
  const dateInput = document.getElementById("date");
  const alert = document.getElementById("alertMessageDate");

  if (!dateInput || !alert) return false;

  if (!isDateSelected(dateInput)) {
    showDateValidationError(alert, dateInput, "Please select a date.");
    return false;
  }

  if (isDateInPast(dateInput.value)) {
    showDateValidationError(alert, dateInput, "Date cannot be in the past.");
    return false;
  }

  clearDateValidationError(alert, dateInput);
  return true;
}

/**
 * Checks if a date value is selected in the input.
 * 
 * @param {HTMLInputElement} input - The date input element.
 * @returns {boolean} True if a date is selected.
 */
function isDateSelected(input) {
  return Boolean(input.value);
}

/**
 * Checks if the selected date is in the past.
 * 
 * @param {string} dateValue - The selected date string (YYYY-MM-DD).
 * @returns {boolean} True if the date is before today.
 */
function isDateInPast(dateValue) {
  const selectedDate = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate < today;
}

/**
 * Displays a validation error message and styles the input.
 * 
 * @param {HTMLElement} alert - The alert message container.
 * @param {HTMLElement} input - The input element to mark as invalid.
 * @param {string} message - The validation error message.
 */
function showDateValidationError(alert, input, message) {
  alert.textContent = message;
  alert.classList.remove("d-none");
  input.classList.add("input-error");
}

/**
 * Clears the date validation error and resets input styling.
 * 
 * @param {HTMLElement} alert - The alert message container.
 * @param {HTMLElement} input - The input element to reset.
 */
function clearDateValidationError(alert, input) {
  alert.classList.add("d-none");
  input.classList.remove("input-error");
}

/**
 * Validates if a task category is selected
 * @returns {boolean} True if a valid category is selected
 */
function validateBoardCategory() {
  const categorySpan = document.getElementById("selectTaskCategorySpan");
  const categorySection = document.getElementById("categorySection");
  const alert = document.getElementById("alertMessageCategory");
  const validCategories = ["Technical Task", "User Story"];

  if (
    !categorySpan ||
    !validCategories.some((cat) => categorySpan.innerText.includes(cat))
  ) {
    alert.classList.remove("d-none");
    categorySection.classList.add("input-error");
    return false;
  }

  alert.classList.add("d-none");
  categorySection.classList.remove("input-error");
  return true;
}

/**
 * Runs all validations for the board form
 * @returns {boolean} True if all fields are valid
 */
function validateBoardForm() {
  const titleValid = validateBoardTitle();
  const dateValid = validateBoardDueDate();
  const categoryValid = validateBoardCategory();

  return titleValid && dateValid && categoryValid;
}

/**
 * Injects the required alert messages into the DOM if not present yet.
 */
function ensureBoardValidationAlertsExist() {
  insertAlertIfMissing("alertMessageTitle", "title", "This field is required", "afterend");
  insertAlertIfMissing("alertMessageDate", "date", "Please select a valid date", "afterend");
  insertAlertIfMissing("alertMessageCategory", "categorySection", "Please select a category", "append");
}

/**
 * Inserts an alert message element if it doesn't already exist in the DOM.
 * 
 * @param {string} alertId - The ID to assign to the alert element.
 * @param {string} targetId - The ID of the DOM element to attach the alert to.
 * @param {string} message - The message to display inside the alert.
 * @param {"afterend" | "append"} position - How to insert the alert: afterend for siblings, append for children.
 */
function insertAlertIfMissing(alertId, targetId, message, position) {
  if (document.getElementById(alertId)) return;

  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  const alertElement = createAlertElement(alertId, message);

  if (position === "append") {
    targetElement.appendChild(alertElement);
  } else {
    targetElement.insertAdjacentElement("afterend", alertElement);
  }
}

/**
 * Creates a span element to be used as an alert message.
 * 
 * @param {string} id - The ID to assign to the alert element.
 * @param {string} message - The message to display inside the alert.
 * @returns {HTMLSpanElement} The configured alert span element.
 */
function createAlertElement(id, message) {
  const span = document.createElement("span");
  span.id = id;
  span.className = "alert-message d-none";
  span.textContent = message;
  return span;
}

