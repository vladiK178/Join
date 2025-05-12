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
 * Validates if a valid due date is selected and not in the past
 * @returns {boolean} True if due date is valid
 */
function validateBoardDueDate() {
  const dateInput = document.getElementById("date");
  const alert = document.getElementById("alertMessageDate");

  if (!dateInput || !dateInput.value) {
    alert.textContent = "Please select a date.";
    alert.classList.remove("d-none");
    dateInput.classList.add("input-error");
    return false;
  }

  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert.textContent = "Date cannot be in the past.";
    alert.classList.remove("d-none");
    dateInput.classList.add("input-error");
    return false;
  }

  alert.classList.add("d-none");
  dateInput.classList.remove("input-error");
  return true;
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
 * Injects the required alert messages into the DOM if not present yet
 */
function ensureBoardValidationAlertsExist() {
  if (!document.getElementById("alertMessageTitle")) {
    const title = document.getElementById("title");
    const msg = document.createElement("span");
    msg.id = "alertMessageTitle";
    msg.className = "alert-message d-none";
    msg.textContent = "This field is required";
    title.insertAdjacentElement("afterend", msg);
  }

  if (!document.getElementById("alertMessageDate")) {
    const date = document.getElementById("date");
    const msg = document.createElement("span");
    msg.id = "alertMessageDate";
    msg.className = "alert-message d-none";
    msg.textContent = "Please select a valid date";
    date.insertAdjacentElement("afterend", msg);
  }

  if (!document.getElementById("alertMessageCategory")) {
    const section = document.getElementById("categorySection");
    const msg = document.createElement("span");
    msg.id = "alertMessageCategory";
    msg.className = "alert-message d-none";
    msg.textContent = "Please select a category";
    section.appendChild(msg);
  }
}
