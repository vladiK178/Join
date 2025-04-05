/**
 * Opens the Add Task panel and prevents background scrolling
 */
function openAddTaskBoard() {
  // Get the elements we need to modify
  const taskPanel = document.getElementById("addTaskBoardSection");
  const bodyElement = document.getElementById("body");

  // Show the task panel
  taskPanel.classList.remove("d-none");

  // Prevent scrolling on the body
  bodyElement.classList.add("overflow-hidden");
}

/**
 * Shows or hides the assigned contacts dropdown
 */
function toggleAssignedToDropdown() {
  // Get all required elements
  const dropdownElement = document.getElementById("dropDownSection");
  const arrowIcon = document.getElementById("dropDownImg");
  const sectionElement = document.getElementById("assignedToSection");

  // Toggle the visibility of the dropdown
  dropdownElement.classList.toggle("d-none");

  // Update arrow direction and border based on dropdown state
  if (dropdownElement.classList.contains("d-none")) {
    // Dropdown is closed - point arrow down, remove border
    arrowIcon.src = "assets/img/dropDownArrowDown.svg";
    sectionElement.classList.remove("blue-border");
  } else {
    // Dropdown is open - point arrow up, add blue border
    arrowIcon.src = "assets/img/dropDownArrowUp.svg";
    sectionElement.classList.add("blue-border");
  }
}

/**
 * Shows or hides the category dropdown menu
 */
function toggleCategoryDropdown() {
  // Get references to the necessary elements
  const dropdownSection = document.getElementById("categoryDropDownSection");
  const arrowImage = document.getElementById("dropDownImgCategory");
  const categorySection = document.getElementById("categorySection");

  // Toggle visibility of dropdown
  dropdownSection.classList.toggle("d-none");

  // Adjust the UI based on whether dropdown is visible
  if (dropdownSection.classList.contains("d-none")) {
    // Dropdown is hidden - arrow points down, no border
    arrowImage.src = "assets/img/dropDownArrowDown.svg";
    categorySection.classList.remove("blue-border");
  } else {
    // Dropdown is visible - arrow points up, blue border
    arrowImage.src = "assets/img/dropDownArrowUp.svg";
    categorySection.classList.add("blue-border");
  }
}

/**
 * Populates the assigned contacts dropdown and circles
 */
function renderAssignedToSection() {
  // Get current user's contacts or empty object if none
  contacts = currentUser.contacts || {};

  // Make sure current user is in the contacts list
  ensureCurrentUserInContacts();

  // Clear existing content before rendering
  clearAssignedToHTML();

  // Generate consistent colors for contacts
  const contactColors = createAssignedToColorMap();

  // Track if current user has been processed
  let currentUserFound = false;

  // Loop through all contacts and render them
  for (const contactKey in contacts) {
    // Handle rendering logic for each contact
    currentUserFound = handleContactRendering(
      contactKey,
      contacts[contactKey],
      contactColors,
      currentUserFound
    );
  }
}
