let currentSubTask = {};
let currentUserAssignedToIndex;
let contacts = {}; // Global contacts object

/**
 * Sets up document click listener for dropdown management
 */
function initOutsideClickListener() {
  document.addEventListener("click", outsideClickHandler);
}

/**
 * Handles clicks outside of dropdowns and inputs
 * @param {MouseEvent} event - Click event
 */
function outsideClickHandler(event) {
  const assignedToSection = document.getElementById("assignedToSection");
  const assignedDropDown = document.getElementById("dropDownSection");
  const categorySection = document.getElementById("categorySection");
  const categoryDropDown = document.getElementById("categoryDropDownSection");
  const subtaskDiv = document.getElementById("subtaskSectionInput");

  // improved Check for Assigned-to Dropdown
  if (assignedToSection && assignedDropDown && 
      !assignedToSection.contains(event.target) && 
      !assignedDropDown.contains(event.target)) {
    closeAssignedToDropdown();
  }

  // improved Check for Category Dropdown
  if (categorySection && categoryDropDown && 
      !categorySection.contains(event.target) &&
      !categoryDropDown.classList.contains("d-none") &&
      !categoryDropDown.contains(event.target)) {
    closeCategoryDropdown();
  }

  // Check for Subtask Input
  if (subtaskDiv && !subtaskDiv.contains(event.target)) {
    closeInputSubtaskSection(event);
  }
}


/**
 * Closes assigned-to dropdown on outside clicks
 * @param {HTMLElement} section - Container element
 * @param {HTMLElement} dropDown - Dropdown element
 * @param {MouseEvent} event - Click event
 */
function closeAssignedToIfClickedOutside(section, dropDown, event) {
  if (!section.contains(event.target) && !dropDown.contains(event.target)) {
    dropDown.classList.add("d-none");
    document.getElementById("dropDownImg").src =
      "assets/img/dropDownArrowDown.svg";
    section.classList.remove("blue-border");
  }
}

/**
 * Closes category dropdown on outside clicks
 * @param {HTMLElement} section - Category section
 * @param {HTMLElement} dropDown - Dropdown element
 * @param {MouseEvent} event - Click event
 */
function closeCategoryIfClickedOutside(section, dropDown, event) {
  if (
    !section.contains(event.target) &&
    !dropDown.classList.contains("d-none")
  ) {
    dropDown.classList.add("d-none");
    document.getElementById("dropDownImgCategory").src =
      "assets/img/dropDownArrowDown.svg";
    section.classList.remove("blue-border");
  }
}

/**
 * Closes subtask input on outside clicks
 * @param {HTMLElement} subtaskDiv - Subtask input container
 * @param {MouseEvent} event - Click event
 */
function closeSubtaskIfClickedOutside(subtaskDiv, event) {
  if (!subtaskDiv.contains(event.target)) {
    closeInputSubtaskSection(event);
  }
}

/**
 * Toggles assigned-to dropdown and closes category if open
 */
function openAndCloseAssignedToSection() {
  closeCategoryIfOpen();
  toggleAssignedToDropdown();
}

/**
 * Closes category dropdown if it's open
 */
function closeCategoryIfOpen() {
  const catDrop = document.getElementById("categoryDropDownSection");
  const catSec = document.getElementById("categorySection");
  const catImg = document.getElementById("dropDownImgCategory");

  if (!catDrop.classList.contains("d-none")) {
    catDrop.classList.add("d-none");
    catImg.src = "assets/img/dropDownArrowDown.svg";
    catSec.classList.remove("blue-border");
  }
}

/**
 * Toggles category dropdown and closes assigned-to if open
 */
function openAndCloseCategorySection() {
  closeAssignedToIfOpen();
  toggleCategoryDropdown();
}

/**
 * Closes assigned-to dropdown if it's open
 */
function closeAssignedToIfOpen() {
  const dropSec = document.getElementById("dropDownSection");
  const dropImg = document.getElementById("dropDownImg");
  const assignSec = document.getElementById("assignedToSection");

  if (!dropSec.classList.contains("d-none")) {
    dropSec.classList.add("d-none");
    dropImg.src = "assets/img/dropDownArrowDown.svg";
    assignSec.classList.remove("blue-border");
  }
}

/**
 * Sets category to "Technical Task"
 */
function choseTechnicalTask() {
  const field = document.getElementById("selectTaskCategorySpan");
  const dropSec = document.getElementById("categoryDropDownSection");
  const dropImg = document.getElementById("dropDownImgCategory");

  field.innerHTML = "Technical Task";
  toggleCategory(dropSec, dropImg);
}

/**
 * Sets category to "User Story"
 */
function choseUserStory() {
  const field = document.getElementById("selectTaskCategorySpan");
  const dropSec = document.getElementById("categoryDropDownSection");
  const dropImg = document.getElementById("dropDownImgCategory");

  field.innerHTML = "User Story";
  toggleCategory(dropSec, dropImg);
}

/**
 * Creates color mapping for contacts
 * @returns {Object} Contact key to color mapping
 */
function createAssignedToColorMap() {
  const map = {};
  for (const key in contacts) {
    if (!map[key]) {
      map[key] = getRandomColorFromPalette();
    }
  }
  return map;
}

/**
 * Handles contact rendering based on current user status
 * @param {string} key - Contact key
 * @param {Object} contact - Contact object
 * @param {Object} colorMap - Color mapping
 * @param {boolean} userProcessed - Whether current user is processed
 * @returns {boolean} Updated processed status
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
 * Makes sure current user is in contacts list
 */
function ensureCurrentUserInContacts() {
  let userFound = false;
  for (let key in contacts) {
    if (isCurrentUserContact(contacts[key])) {
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    const selfKey = `self_${currentUser.id}`;
    contacts[selfKey] = {
      firstNameContact: currentUser.firstName,
      lastNameContact: currentUser.lastName,
    };
  }
}

/**
 * Clears assigned-to sections before redrawing
 */
function clearAssignedToHTML() {
  document.getElementById("dropDownSection").innerHTML = "";
  document.getElementById("choosenNamesSection").innerHTML = "";
}

/**
 * Checks if contact is current user
 * @param {Object} contact - Contact to check
 * @returns {boolean} True if current user
 */
function isCurrentUserContact(contact) {
  return (
    currentUser.firstName.toLowerCase() ===
      contact.firstNameContact.toLowerCase() &&
    currentUser.lastName.toLowerCase() === contact.lastNameContact.toLowerCase()
  );
}

/**
 * Renders current user contact as selected
 * @param {string} key - Contact key
 * @param {Object} contact - Contact data
 * @param {string} color - Circle color
 */
function renderCurrentUserAssigned(key, contact, color) {
  document.getElementById("dropDownSection").innerHTML += `
    <div onclick="toggleAssignedToBackground('${key}', '${color}')"
         id="assignedToName${key}" class="checked-assigned-to">
      <div class="name-section">
        <div class="name-circle-add-section" style="background-color: ${color}">
          <span>${contact.firstNameContact.charAt(
            0
          )}${contact.lastNameContact.charAt(0)}</span>
        </div>
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
      </div>
      <input class="custom-checkbox" id="assignedToCheckbox${key}" type="checkbox" checked style="pointer-events: none;">
    </div>`;

  document.getElementById("choosenNamesSection").innerHTML += `
    <div id="chosenName${key}" class="name-circle-add-section" style="background-color: ${color}">
      <span>${contact.firstNameContact.charAt(
        0
      )}${contact.lastNameContact.charAt(0)}</span>
    </div>`;
}

/**
 * Renders other contacts as unselected
 * @param {string} key - Contact key
 * @param {Object} contact - Contact data
 * @param {string} color - Circle color
 */
function renderOtherContactAssigned(key, contact, color) {
  document.getElementById("dropDownSection").innerHTML += `
    <div onclick="toggleAssignedToBackground('${key}', '${color}')"
         id="assignedToName${key}" class="assigned-to-name">
      <div class="name-section">
        <div class="name-circle-add-section" style="background-color: ${color}">
          <span>${contact.firstNameContact.charAt(
            0
          )}${contact.lastNameContact.charAt(0)}</span>
        </div>
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
      </div>
      <input class="custom-checkbox" id="assignedToCheckbox${key}" type="checkbox" style="pointer-events: none;">
    </div>`;
}

/**
 * Updates name circle visibility based on checkbox
 * @param {string} key - Contact key
 * @param {string} color - Circle color
 */
function choseNameAndShowCircle(key, color) {
  const checkbox = document.getElementById(`assignedToCheckbox${key}`);
  if (checkbox.checked) {
    document.getElementById("choosenNamesSection").innerHTML += `
      <div id="chosenName${key}" class="name-circle-add-section" style="background-color: ${color}">
        <span>${contacts[key].firstNameContact.charAt(0)}${contacts[
      key
    ].lastNameContact.charAt(0)}</span>
      </div>`;
  } else {
    const chosenName = document.getElementById(`chosenName${key}`);
    if (chosenName) chosenName.remove();
  }
}

/**
 * Toggles contact selection state
 * @param {string} key - Contact key
 * @param {string} color - Circle color
 */
function toggleAssignedToBackground(key, color) {
  const div = document.getElementById(`assignedToName${key}`);
  const checkbox = document.getElementById(`assignedToCheckbox${key}`);

  checkbox.checked = !checkbox.checked;
  if (checkbox.checked) {
    div.classList.remove("assigned-to-name");
    div.classList.add("checked-assigned-to");
    addChosenNameCircle(key, color);
  } else {
    div.classList.remove("checked-assigned-to");
    div.classList.add("assigned-to-name");
    removeChosenNameCircle(key);
  }
}

/**
 * Adds contact circle if not already exists
 * @param {string} key - Contact key
 * @param {string} color - Circle color
 */
function addChosenNameCircle(key, color) {
  if (!document.getElementById(`chosenName${key}`)) {
    document.getElementById("choosenNamesSection").innerHTML += `
      <div id="chosenName${key}" class="name-circle-add-section" style="background-color: ${color}">
        <span>${contacts[key].firstNameContact.charAt(0)}${contacts[
      key
    ].lastNameContact.charAt(0)}</span>
      </div>`;
  }
}

/**
 * Removes contact circle if exists
 * @param {string} key - Contact key
 */
function removeChosenNameCircle(key) {
  const elem = document.getElementById(`chosenName${key}`);
  if (elem) elem.remove();
}

/**
 * Creates initial hidden name circles
 */
function renderNameCircles() {
  const allContacts = Object.values(currentUser.contacts || {});
  const chosenSec = document.getElementById("choosenNamesSection");
  chosenSec.innerHTML = "";

  for (let i = 0; i < allContacts.length; i++) {
    const c = allContacts[i];
    chosenSec.innerHTML += `
      <div id="chosenName${i}" class="d-none name-circle-add-section">
        <span>${c.firstNameContact.charAt(0)}${c.lastNameContact.charAt(
      0
    )}</span>
      </div>`;
  }
}

/**
 * Closes assigned dropdown for UI reset
 */
function closeAssignedToDropdown() {
  const dropDownSection = document.getElementById("dropDownSection");
  const dropDownImg = document.getElementById("dropDownImg");
  const assignedToSection = document.getElementById("assignedToSection");
  
  if (dropDownSection && !dropDownSection.classList.contains("d-none")) {
    dropDownSection.classList.add("d-none");
    
    if (dropDownImg) {
      dropDownImg.src = "assets/img/dropDownArrowDown.svg";
    }
    
    if (assignedToSection) {
      assignedToSection.classList.remove("blue-border");
    }
  }
}

/**
 * Closes category dropdown for UI reset
 */
function closeCategoryDropdown() {
  const dropDownSection = document.getElementById("categoryDropDownSection");
  const dropDownImg = document.getElementById("dropDownImgCategory");
  const categorySection = document.getElementById("categorySection");
  
  if (dropDownSection && !dropDownSection.classList.contains("d-none")) {
    dropDownSection.classList.add("d-none");
    
    if (dropDownImg) {
      dropDownImg.src = "assets/img/dropDownArrowDown.svg";
    }
    
    if (categorySection) {
      categorySection.classList.remove("blue-border");
    }
  }
}
