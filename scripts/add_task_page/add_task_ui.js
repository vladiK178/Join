/** @type {string} */
let userCircle;

/**
 * Renders the current user's initials based on their first and last name from localStorage.
 * @returns {string} The uppercase initials.
 */
function renderCurrentUserCircle() {
  const currentUserFirstName = localStorage.getItem("firstName");
  const currentUserLastName = localStorage.getItem("lastName");
  const userCircle =
    currentUserFirstName[0].toUpperCase() +
    currentUserLastName[0].toUpperCase();
  return userCircle;
}

/**
 * Renders the desktop template with the user's initials.
 */
function renderDesktopTemplate() {
  document.getElementById("templateSection").innerHTML = getDesktopTemplate(
    renderCurrentUserCircle()
  );
}

/**
 * Highlights the "Add Task" section and removes highlight from "Summary".
 */
function highlightAddTaskSection() {
  toggleSectionHighlight("summary", false);
  toggleSectionHighlight("addTask", true);
}

/**
 * Adds or removes highlight classes for a given section.
 * @param {string} section - Section name.
 * @param {boolean} isActive - Whether the section is active.
 */
function toggleSectionHighlight(section, isActive) {
  const sectionElem = document.getElementById(`${section}-section`);
  const img = document.getElementById(`${section}-img`);

  sectionElem.classList.toggle("chosen-section", isActive);
  img.classList.toggle(`${section}-img-chosen`, isActive);
  img.classList.toggle(`${section}-img`, !isActive);
}

/**
 * Renders the list of assignable contacts and ensures the current user is included.
 */
function renderAssignedToSection() {
  contacts = currentUser.contacts || {};
  const dropDown = document.getElementById("dropDownSection");
  const chosenSec = document.getElementById("choosenNamesSection");
  dropDown.innerHTML = chosenSec.innerHTML = "";

  if (!Object.values(contacts).some(isCurrentUserContact)) addSelfContact();

  renderContacts(contacts, dropDown, chosenSec);
}

/**
 * Checks if a contact object represents the current user.
 * @param {Object} contact
 * @returns {boolean}
 */
function isCurrentUserContact(contact) {
  return (
    currentUser.firstName.toLowerCase() ===
      contact.firstNameContact.toLowerCase() &&
    currentUser.lastName.toLowerCase() === contact.lastNameContact.toLowerCase()
  );
}

/**
 * Adds the current user to the contacts list if not already present.
 */
function addSelfContact() {
  contacts[`self_${currentUser.id}`] = {
    firstNameContact: currentUser.firstName,
    lastNameContact: currentUser.lastName,
  };
}

/**
 * Renders all contacts to the dropdown and the chosen list if already selected.
 * @param {Object} contacts
 * @param {HTMLElement} dropDown
 * @param {HTMLElement} chosenSec
 */
function renderContacts(contacts, dropDown, chosenSec) {
  const colorMap = {};
  for (let key in contacts) {
    const contact = contacts[key];
    const color = (colorMap[key] = getRandomColorFromPalette());
    const isUser = isCurrentUserContact(contact);

    renderContactItem({ key, contact, color, isUser, dropDown, chosenSec });
  }
}

/**
 * Renders a single contact item with selection state and initials.
 * @param {Object} params
 */
function renderContactItem({
  key,
  contact,
  color,
  isUser,
  dropDown,
  chosenSec,
}) {
  const initials = `${contact.firstNameContact[0]}${contact.lastNameContact[0]}`;
  const isChecked = isUser ? "checked" : "";
  const assignedClass = isUser ? "checked-assigned-to" : "assigned-to-name";

  dropDown.innerHTML += assignedToBackgroundTemplate(
    key,
    color,
    assignedClass,
    initials,
    contact,
    isChecked
  );

  if (isUser) {
    chosenSec.innerHTML += chosenNameTemplate(key, color, initials);
  }
}

/**
 * Returns the HTML template for a chosen name circle.
 * @param {string} key
 * @param {string} color
 * @param {string} initials
 * @returns {string}
 */
function chosenNameTemplate(key, color, initials) {
  return `
      <div id="chosenName${key}" class="name-circle" style="background-color: ${color}">
        <span>${initials}</span>
      </div>`;
}

/**
 * Returns the HTML for an assignable contact item.
 * @param {string} key
 * @param {string} color
 * @param {string} assignedClass
 * @param {string} initials
 * @param {Object} contact
 * @param {string} isChecked
 * @returns {string}
 */
function assignedToBackgroundTemplate(
  key,
  color,
  assignedClass,
  initials,
  contact,
  isChecked
) {
  return `
    <div onclick="toggleAssignedToBackground('${key}', '${color}')" id="assignedToName${key}" class="${assignedClass}">
      <div class="name-section">
        <div class="name-circle" style="background-color: ${color}"><span>${initials}</span></div>
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
      </div>
      <input class="custom-checkbox checkbox-width-zero" id="assignedToCheckbox${key}" type="checkbox" ${isChecked} style="pointer-events: none;">
    </div>`;
}

/**
 * Toggles selection of a contact and updates UI accordingly.
 * @param {string} key
 * @param {string} color
 */
function toggleAssignedToBackground(key, color) {
  const box = document.getElementById(`assignedToCheckbox${key}`);
  const div = document.getElementById(`assignedToName${key}`);
  box.checked = !box.checked;

  div.classList.toggle("assigned-to-name", !box.checked);
  div.classList.toggle("checked-assigned-to", box.checked);

  box.checked ? addChosenNameCircle(key, color) : removeChosenNameCircle(key);
}

/**
 * Adds the selected contact's circle to the chosen section.
 * @param {string} key
 * @param {string} color
 */
function addChosenNameCircle(key, color) {
  if (!document.getElementById(`chosenName${key}`)) {
    const contact = contacts[key];
    const initials = `${contact.firstNameContact[0]}${contact.lastNameContact[0]}`;
    document.getElementById("choosenNamesSection").innerHTML += `
      <div id="chosenName${key}" class="name-circle" style="background-color: ${color}">
        <span>${initials}</span>
      </div>`;
  }
}

/**
 * Removes the contact's circle from the chosen section.
 * @param {string} key
 */
function removeChosenNameCircle(key) {
  const el = document.getElementById(`chosenName${key}`);
  if (el) el.remove();
}

/**
 * Renders invisible name circles for all contacts (used elsewhere).
 */
function renderNameCircles() {
  const chosenSec = document.getElementById("choosenNamesSection");
  chosenSec.innerHTML = "";

  Object.values(currentUser.contacts || {}).forEach((contact, i) => {
    const initials = `${contact.firstNameContact[0]}${contact.lastNameContact[0]}`;
    chosenSec.innerHTML += `
      <div id="chosenName${i}" class="d-none name-circle">
        <span>${initials}</span>
      </div>`;
  });
}

/**
 * Renders the list of current subtasks.
 */
function renderSubtasks() {
  const section = document.getElementById("subtaskSection");
  section.innerHTML = "";

  for (let key in currentSubTask) {
    const { subTaskDescription } = currentSubTask[key];
    section.innerHTML += subtaskTemplate(key, subTaskDescription);
  }
}

/**
 * Returns the HTML for a single subtask.
 * @param {string} key
 * @param {string} subTaskDescription
 * @returns {string}
 */
function subtaskTemplate(key, subTaskDescription) {
  return `
      <div id="taskBulletPoint${key}" class="task-bullet-point">
        <li>${subTaskDescription}</li>
        <div class="edit-trash-section">
          <img onclick="subtaskEdit('${key}')" src="./assets/img/subtaskPen.svg" alt="">
          <div class="seperator-edit-trash"></div>
          <img onclick="deleteSubTasks('${key}')" src="./assets/img/trashImg.svg" alt="">
        </div>
      </div>`;
}

/**
 * Adds an "Enter" key listener to the subtask input to trigger subtask creation.
 */
function addSubtaskEnterListener() {
  document.getElementById("subtask").addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
      addSubtask();
      evt.preventDefault();
    }
  });
}

/**
 * Initializes outside click listener to close various dropdowns when clicked outside.
 */
function initOutsideClickListener() {
  document.addEventListener("click", (evt) => {
    closeAssignedToOnOutsideClick(evt);
    closeCategoryOnOutsideClick(evt);
    closeSubtaskOnOutsideClick(evt);
  });
}

/**
 * Pre-selects the "Technical Task" category.
 */
function choseTechnicalTask() {
  selectCategory("Technical Task");
}

/**
 * Pre-selects the "User Story" category.
 */
function choseUserStory() {
  selectCategory("User Story");
}

/**
 * Closes the category dropdown if it is currently open.
 */
function closeCategoryDropdownIfOpen() {
  const catDrop = document.getElementById("categoryDropDownSection");
  const catSec = document.getElementById("categorySection");
  const catImg = document.getElementById("dropDownImgCategory");

  if (!catDrop.classList.contains("d-none")) {
    catDrop.classList.add("d-none");
    catSec.classList.remove("blue-border");
    catImg.src = "assets/img/dropDownArrowDown.svg";
  }
}
