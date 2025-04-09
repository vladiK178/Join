/** Renders the desktop template into #templateSection. */
function renderDesktopTemplate() {
  let content = document.getElementById('templateSection');
  content.innerHTML = getDesktopTemplate(currentUser);
}


/** Highlights the "Add Task" section and un-highlights "Summary". */
function highlightAddTaskSection() {
  document.getElementById('summary-section').classList.remove('chosen-section');
  document.getElementById('summary-img').classList.remove('summary-img-chosen');
  document.getElementById('summary-img').classList.add('summary-img');

  document.getElementById('addTask-section').classList.add('chosen-section');
  document.getElementById('addTask-img').classList.remove('add-task-img');
  document.getElementById('addTask-img').classList.add('add-task-img-chosen');
}


/**
 * Renders the "Assigned To" section by processing contacts.
 */
function renderAssignedToSection() {
  contacts = currentUser.contacts || {};
  const dropDown = document.getElementById('dropDownSection');
  const chosenSec = document.getElementById('choosenNamesSection');
  dropDown.innerHTML = "";
  chosenSec.innerHTML = "";
  if (!isUserInContacts(contacts)) addSelfContact(contacts);
  renderContactsWithColors(contacts, dropDown, chosenSec);
}


/**
 * Checks if the current user is present within the contacts.
 * @param {Object} contacts - The contacts object.
 * @returns {boolean} True if the current user is found in contacts.
 */
function isUserInContacts(contacts) {
  for (let key in contacts) {
    if (isCurrentUserContact(contacts[key])) return true;
  }
  return false;
}


/**
 * Adds the current user as a contact if not already present.
 * @param {Object} contacts - The contacts object.
 */
function addSelfContact(contacts) {
  const selfKey = `self_${currentUser.id}`;
  contacts[selfKey] = {
    firstNameContact: currentUser.firstName,
    lastNameContact: currentUser.lastName
  };
}


/**
 * Renders all contacts with a random color. 
 * Distinguishes the current user from others.
 * @param {Object} contacts - The contacts object.
 * @param {HTMLElement} dropDown - The dropdown element where contacts are rendered.
 * @param {HTMLElement} chosenSec - The section element for chosen name circles.
 */
function renderContactsWithColors(contacts, dropDown, chosenSec) {
  const colorMap = {};
  let currentUserProcessed = false;
  for (let key in contacts) {
    const contact = contacts[key];
    colorMap[key] = colorMap[key] || getRandomColorFromPalette();
    if (isCurrentUserContact(contact) && !currentUserProcessed) {
      currentUserProcessed = true;
      renderCurrentUserAssigned(key, contact, colorMap[key], dropDown, chosenSec);
    } else {
      renderOtherContactAssigned(key, contact, colorMap[key], dropDown);
    }
  }
}


/** Checks if a contact belongs to the currently logged-in user. */
function isCurrentUserContact(contact) {
  return (
    currentUser.firstName.toLowerCase() === contact.firstNameContact.toLowerCase() &&
    currentUser.lastName.toLowerCase() === contact.lastNameContact.toLowerCase()
  );
}


/** Pre-renders name circles (initially hidden) for each contact. */
function renderNameCircles() {
  let allContacts = Object.values(currentUser.contacts || {});
  let chosenSec = document.getElementById('choosenNamesSection');
  chosenSec.innerHTML = "";
  for (let i = 0; i < allContacts.length; i++) {
    const c = allContacts[i];
    chosenSec.innerHTML += `
      <div id="chosenName${i}" class="d-none name-circle">
        <span>${c.firstNameContact.charAt(0)}${c.lastNameContact.charAt(0)}</span>
      </div>`;
  }
}


/** Renders all subtasks in #subtaskSection. */
function renderSubtasks() {
  let subSec = document.getElementById('subtaskSection');
  subSec.innerHTML = "";
  for (let key in currentSubTask) {
    let st = currentSubTask[key];
    subSec.innerHTML += `
      <div id="taskBulletPoint${key}" class="task-bullet-point">
        <li>${st.subTaskDescription}</li>
        <div id="edit-trash-section" class="edit-trash-section">
          <img onclick="subtaskEdit('${key}')" src="./assets/img/subtaskPen.svg" alt="">
          <div class="seperator-edit-trash"></div>
          <img onclick="deleteSubTasks('${key}')" id="deleteSubTask${key}" src="./assets/img/trashImg.svg" alt="">
        </div>
      </div>`;
  }
}


/** Adds 'Enter' key listener for creating a subtask. */
function addSubtaskEnterListener() {
document.getElementById('subtask').addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    addSubtask();
    evt.preventDefault();
  }
});
}


/** Initializes the outside-click listener for closing UI sections. */
function initOutsideClickListener() {
document.addEventListener('click', (evt) => {
  closeAssignedToOnOutsideClick(evt);
  closeCategoryOnOutsideClick(evt);
  closeSubtaskOnOutsideClick(evt);
});
}


function renderCurrentUserAssigned(key, contact, color, dropDown, chosenSec) {
dropDown.innerHTML += `
  <div onclick="toggleAssignedToBackground('${key}', '${color}')"
    id="assignedToName${key}" class="checked-assigned-to">
    <div class="name-section">
      <div class="name-circle" style="background-color: ${color}">
        <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
      </div>
      <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
    </div>
    <input class="custom-checkbox" id="assignedToCheckbox${key}" type="checkbox" checked style="pointer-events: none;">
  </div>`;

chosenSec.innerHTML += `
  <div id="chosenName${key}" class="name-circle" style="background-color: ${color}">
    <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
  </div>`;
}


function renderOtherContactAssigned(key, contact, color, dropDown) {
dropDown.innerHTML += `
  <div onclick="toggleAssignedToBackground('${key}', '${color}')"
    id="assignedToName${key}" class="assigned-to-name">
    <div class="name-section">
      <div class="name-circle" style="background-color: ${color}">
        <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
      </div>
      <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
    </div>
    <input class="custom-checkbox" id="assignedToCheckbox${key}"
      type="checkbox" style="pointer-events: none;">
  </div>`;
}


function toggleAssignedToBackground(key, color) {
let div = document.getElementById(`assignedToName${key}`);
let checkbox = document.getElementById(`assignedToCheckbox${key}`);
checkbox.checked = !checkbox.checked;

if (checkbox.checked) {
  div.classList.remove('assigned-to-name');
  div.classList.add('checked-assigned-to');
  addChosenNameCircle(key, color);
} else {
  div.classList.remove('checked-assigned-to');
  div.classList.add('assigned-to-name');
  removeChosenNameCircle(key);
}
}


/** Adds the chosen name circle to #choosenNamesSection. */
function addChosenNameCircle(key, color) {
if (!document.getElementById(`chosenName${key}`)) {
  document.getElementById('choosenNamesSection').innerHTML += `
    <div id="chosenName${key}" class="name-circle" style="background-color: ${color}">
      <span>${contacts[key].firstNameContact.charAt(0)}${contacts[key].lastNameContact.charAt(0)}</span>
    </div>`;
}
}


/** Removes the chosen name circle from #choosenNamesSection. */
function removeChosenNameCircle(key) {
const elem = document.getElementById(`chosenName${key}`);
if (elem) elem.remove();
}


/** Chooses "Technical Task" category. */
function choseTechnicalTask() {
selectCategory("Technical Task");
}


/** Chooses "User Story" category. */
function choseUserStory() {
selectCategory("User Story");
}


/** Closes the Category dropdown if it's open. */
function closeCategoryDropdownIfOpen() {
const catDrop = document.getElementById('categoryDropDownSection');
const catSec = document.getElementById('categorySection');
const catImg = document.getElementById('dropDownImgCategory');
if (!catDrop.classList.contains('d-none')) {
  catDrop.classList.add('d-none');
  catImg.src = "assets/img/dropDownArrowDown.svg";
  catSec.classList.remove('blue-border');
}
}