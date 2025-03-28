/**
 * Opens the "Add Task" board and disables page scrolling.
 */
function openAddTaskBoard() {
    const addTaskSection = document.getElementById("addTaskBoardSection");
    const body = document.getElementById("body");
    addTaskSection.classList.remove("d-none");
    body.classList.add("overflow-hidden");
  }


  /**
 * Toggles the "Assigned To" dropdown's visibility.
 */
function toggleAssignedToDropdown() {
    const dropDown = document.getElementById('dropDownSection');
    const dropDownImg = document.getElementById('dropDownImg');
    const assignedSec = document.getElementById('assignedToSection');
  
    dropDown.classList.toggle('d-none');
    if (dropDown.classList.contains('d-none')) {
      dropDownImg.src = "assets/img/dropDownArrowDown.svg";
      assignedSec.classList.remove('blue-border');
    } else {
      dropDownImg.src = "assets/img/dropDownArrowUp.svg";
      assignedSec.classList.add('blue-border');
    }
  }


  /**
 * Toggles the category dropdown's visibility.
 */
function toggleCategoryDropdown() {
    const dropSec = document.getElementById('categoryDropDownSection');
    const dropImg = document.getElementById('dropDownImgCategory');
    const catSec = document.getElementById('categorySection');
  
    dropSec.classList.toggle('d-none');
    if (dropSec.classList.contains('d-none')) {
      dropImg.src = "assets/img/dropDownArrowDown.svg";
      catSec.classList.remove('blue-border');
    } else {
      dropImg.src = "assets/img/dropDownArrowUp.svg";
      catSec.classList.add('blue-border');
    }
  }


  /**
 * Renders the "Assigned To" section by ensuring the current user is included,
 * clearing existing HTML, and then iterating through contacts.
 */
function renderAssignedToSection() {
    contacts = currentUser.contacts || {};
    ensureCurrentUserInContacts();
    clearAssignedToHTML();
  
    const colorMap = createAssignedToColorMap();
    let userProcessed = false;
  
    for (const key in contacts) {
      userProcessed = handleContactRendering(key, contacts[key], colorMap, userProcessed);
    }
  }