let currentSubTask = {};
let currentUserAssignedToIndex;
let contacts = {}; // Global variable as an object


/**
 * Adds an outside click listener to handle closing of open dropdowns.
 */
function initOutsideClickListener() {
  document.addEventListener('click', outsideClickHandler);
}


/**
 * Handles clicks outside specific elements to close dropdowns or inputs.
 * @param {MouseEvent} event - The click event.
 */
function outsideClickHandler(event) {
  const assignedToSection = document.getElementById('assignedToSection');
  const assignedDropDownSection = document.getElementById('dropDownSection');
  const categorySection = document.getElementById('categorySection');
  const categoryDropDownSection = document.getElementById('categoryDropDownSection');
  const subtaskDiv = document.getElementById('subtaskSectionInput');

  closeAssignedToIfClickedOutside(assignedToSection, assignedDropDownSection, event);
  closeCategoryIfClickedOutside(categorySection, categoryDropDownSection, event);
  closeSubtaskIfClickedOutside(subtaskDiv, event);
}


/**
 * Closes the "Assigned To" dropdown if a click happens outside its area.
 * @param {HTMLElement} section - The main section (assignedToSection).
 * @param {HTMLElement} dropDown - The dropdown element.
 * @param {MouseEvent} event - The click event.
 */
function closeAssignedToIfClickedOutside(section, dropDown, event) {
  if (!section.contains(event.target) && !dropDown.contains(event.target)) {
    dropDown.classList.add('d-none');
    document.getElementById('dropDownImg').src = "assets/img/dropDownArrowDown.svg";
    section.classList.remove('blue-border');
  }
}


/**
 * Closes the category dropdown if a click happens outside its area.
 * @param {HTMLElement} section - The category section.
 * @param {HTMLElement} dropDown - The dropdown element.
 * @param {MouseEvent} event - The click event.
 */
function closeCategoryIfClickedOutside(section, dropDown, event) {
  if (!section.contains(event.target) && !dropDown.classList.contains('d-none')) {
    dropDown.classList.add('d-none');
    document.getElementById('dropDownImgCategory').src = "assets/img/dropDownArrowDown.svg";
    section.classList.remove('blue-border');
  }
}


/**
 * Closes the subtask input if a click happens outside its area.
 * @param {HTMLElement} subtaskDiv - The subtask input container.
 * @param {MouseEvent} event - The click event.
 */
function closeSubtaskIfClickedOutside(subtaskDiv, event) {
  if (!subtaskDiv.contains(event.target)) {
    closeInputSubtaskSection(event);
  }
}


/**
 * Toggles the "Assigned To" section open/close, closing the category if open.
 */
function openAndCloseAssignedToSection() {
  closeCategoryIfOpen();
  toggleAssignedToDropdown();
}


/**
 * Closes the category dropdown if it's open.
 */
function closeCategoryIfOpen() {
  const catDrop = document.getElementById('categoryDropDownSection');
  const catSec = document.getElementById('categorySection');
  const catImg = document.getElementById('dropDownImgCategory');

  if (!catDrop.classList.contains('d-none')) {
    catDrop.classList.add('d-none');
    catImg.src = "assets/img/dropDownArrowDown.svg";
    catSec.classList.remove('blue-border');
  }
}


/**
 * Toggles the category section open/close, closing the "Assigned To" if open.
 */
function openAndCloseCategorySection() {
  closeAssignedToIfOpen();
  toggleCategoryDropdown();
}


/**
 * Closes the "Assigned To" dropdown if it's open.
 */
function closeAssignedToIfOpen() {
  const dropSec = document.getElementById('dropDownSection');
  const dropImg = document.getElementById('dropDownImg');
  const assignSec = document.getElementById('assignedToSection');

  if (!dropSec.classList.contains('d-none')) {
    dropSec.classList.add('d-none');
    dropImg.src = "assets/img/dropDownArrowDown.svg";
    assignSec.classList.remove('blue-border');
  }
}


/**
 * Chooses "Technical Task" as category and closes the dropdown.
 */
function choseTechnicalTask() {
  const field = document.getElementById('selectTaskCategorySpan');
  const dropSec = document.getElementById('categoryDropDownSection');
  const dropImg = document.getElementById('dropDownImgCategory');

  field.innerHTML = "Technical Task";
  toggleCategory(dropSec, dropImg);
}


/**
 * Chooses "User Story" as category and closes the dropdown.
 */
function choseUserStory() {
  const field = document.getElementById('selectTaskCategorySpan');
  const dropSec = document.getElementById('categoryDropDownSection');
  const dropImg = document.getElementById('dropDownImgCategory');

  field.innerHTML = "User Story";
  toggleCategory(dropSec, dropImg);
}


/**
 * Creates and returns a color map for each contact if not already assigned.
 * @returns {Object} A map of contact key to color.
 */
function createAssignedToColorMap() {
  const map = {};
  for (const key in contacts) {
    if (!map[key]) {
      // Assuming getRandomColorFromPalette() exists in your code base
      map[key] = getRandomColorFromPalette();
    }
  }
  return map;
}


/**
 * Handles rendering logic for a single contact by checking if it's the current user.
 * @param {string} key - Contact key.
 * @param {Object} contact - The contact object.
 * @param {Object} colorMap - Mapping from contact key to color.
 * @param {boolean} userProcessed - Flag indicating if current user was already processed.
 * @returns {boolean} Updated userProcessed flag.
 */
function handleContactRendering(key, contact, colorMap, userProcessed) {
  const color = colorMap[key];
  if (isCurrentUserContact(contact) && !userProcessed) {
    renderCurrentUserAssigned(key, contact, color);
    return true;
  } else {
    renderOtherContactAssigned(key, contact, color);
    return userProcessed;
  }
}


/**
 * Ensures the current user is included in the global contacts object.
 */
function ensureCurrentUserInContacts() {
  let userFound = false;
  for (let key in contacts) {
    const c = contacts[key];
    if (isCurrentUserContact(c)) {
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    const selfKey = `self_${currentUser.id}`;
    contacts[selfKey] = {
      firstNameContact: currentUser.firstName,
      lastNameContact: currentUser.lastName
    };
  }
}


/**
 * Clears the "Assigned To" HTML sections before re-rendering.
 */
function clearAssignedToHTML() {
  document.getElementById('dropDownSection').innerHTML = "";
  document.getElementById('choosenNamesSection').innerHTML = "";
}


/**
 * Checks if the given contact object matches the current user.
 * @param {Object} contact - The contact to check.
 * @returns {boolean} True if it's the current user, otherwise false.
 */
function isCurrentUserContact(contact) {
  return (
    currentUser.firstName.toLowerCase() === contact.firstNameContact.toLowerCase() &&
    currentUser.lastName.toLowerCase() === contact.lastNameContact.toLowerCase()
  );
}


/**
 * Renders the current user in the dropdown and as a chosen name.
 * @param {string} key - Contact key.
 * @param {Object} contact - The contact object.
 * @param {string} color - The assigned color for this contact.
 */
function renderCurrentUserAssigned(key, contact, color) {
  document.getElementById('dropDownSection').innerHTML += `
    <div onclick="toggleAssignedToBackground('${key}', '${color}')"
         id="assignedToName${key}" class="checked-assigned-to">
      <div class="name-section">
        <div class="name-circle-add-section" style="background-color: ${color}">
          <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
        </div>
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
      </div>
      <input class="custom-checkbox" id="assignedToCheckbox${key}" type="checkbox" checked style="pointer-events: none;">
    </div>`;

  document.getElementById('choosenNamesSection').innerHTML += `
    <div id="chosenName${key}" class="name-circle-add-section" style="background-color: ${color}">
      <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
    </div>`;
}


/**
 * Renders a non-current-user contact in the dropdown (unchecked by default).
 * @param {string} key - Contact key.
 * @param {Object} contact - The contact object.
 * @param {string} color - The assigned color for this contact.
 */
function renderOtherContactAssigned(key, contact, color) {
  document.getElementById('dropDownSection').innerHTML += `
    <div onclick="toggleAssignedToBackground('${key}', '${color}')"
         id="assignedToName${key}" class="assigned-to-name">
      <div class="name-section">
        <div class="name-circle-add-section" style="background-color: ${color}">
          <span>${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}</span>
        </div>
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
      </div>
      <input class="custom-checkbox" id="assignedToCheckbox${key}" type="checkbox" style="pointer-events: none;">
    </div>`;
}


/**
 * Chooses a name and displays a circle if checkbox is checked.
 * @param {string} key - Contact key.
 * @param {string} color - The assigned color for this contact.
 */
function choseNameAndShowCircle(key, color) {
  const checkbox = document.getElementById(`assignedToCheckbox${key}`);
  if (checkbox.checked) {
    document.getElementById('choosenNamesSection').innerHTML += `
      <div id="chosenName${key}" class="name-circle-add-section" style="background-color: ${color}">
        <span>${contacts[key].firstNameContact.charAt(0)}${contacts[key].lastNameContact.charAt(0)}</span>
      </div>`;
  } else {
    const chosenName = document.getElementById(`chosenName${key}`);
    if (chosenName) chosenName.remove();
  }
}


/**
 * Toggles background (selected/unselected) for an "Assigned To" contact.
 * @param {string} key - Contact key.
 * @param {string} color - The color for the contact circle.
 */
function toggleAssignedToBackground(key, color) {
  const div = document.getElementById(`assignedToName${key}`);
  const checkbox = document.getElementById(`assignedToCheckbox${key}`);

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


/**
 * Adds a chosen contact circle if it doesn't already exist.
 * @param {string} key - Contact key.
 * @param {string} color - Circle color.
 */
function addChosenNameCircle(key, color) {
  if (!document.getElementById(`chosenName${key}`)) {
    document.getElementById('choosenNamesSection').innerHTML += `
      <div id="chosenName${key}" class="name-circle-add-section" style="background-color: ${color}">
        <span>${contacts[key].firstNameContact.charAt(0)}${contacts[key].lastNameContact.charAt(0)}</span>
      </div>`;
  }
}


/**
 * Removes the chosen contact circle if it exists.
 * @param {string} key - Contact key.
 */
function removeChosenNameCircle(key) {
  const elem = document.getElementById(`chosenName${key}`);
  if (elem) elem.remove();
}


/**
 * Renders circles for all user contacts (initially hidden by default).
 */
function renderNameCircles() {
  const allContacts = Object.values(currentUser.contacts || {});
  const chosenSec = document.getElementById('choosenNamesSection');
  chosenSec.innerHTML = "";

  for (let i = 0; i < allContacts.length; i++) {
    const c = allContacts[i];
    chosenSec.innerHTML += `
      <div id="chosenName${i}" class="d-none name-circle-add-section">
        <span>${c.firstNameContact.charAt(0)}${c.lastNameContact.charAt(0)}</span>
      </div>`;
  }
}


/**
 * Closes the "Assigned To" dropdown if open (visual reset).
 */
function closeAssignedToDropdown() {
  const dropDownSection = document.getElementById("dropDownSection");
  const dropDownImg = document.getElementById("dropDownImg");
  if (dropDownSection) dropDownSection.classList.add("d-none");
  if (dropDownImg) dropDownImg.src = "assets/img/dropDownArrowDown.svg";
}


/**
 * Closes the category dropdown if open (visual reset).
 */
function closeCategoryDropdown() {
  const dropDownSection = document.getElementById("categoryDropDownSection");
  const dropDownImg = document.getElementById("dropDownImgCategory");
  if (dropDownSection) dropDownSection.classList.add("d-none");
  if (dropDownImg) dropDownImg.src = "assets/img/dropDownArrowDown.svg";
}























