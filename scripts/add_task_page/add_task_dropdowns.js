/** Toggles the "Assigned To" dropdown and closes Category if open. */
function openAndCloseAssignedToSection() {
    closeCategoryDropdownIfOpen();
    toggleAssignedToDropdown();
  }
  
  
  /** Toggles the "Assigned To" dropdown visibility. */
  function toggleAssignedToDropdown() {
    let dropDown = document.getElementById('dropDownSection');
    let dropDownImg = document.getElementById('dropDownImg');
    let assignedSec = document.getElementById('assignedToSection');
  
    dropDown.classList.toggle('d-none');
    if (dropDown.classList.contains('d-none')) {
      dropDownImg.src = "assets/img/dropDownArrowDown.svg";
      assignedSec.classList.remove('blue-border');
    } else {
      dropDownImg.src = "assets/img/dropDownArrowUp.svg";
      assignedSec.classList.add('blue-border');
    }
  }


  /** Toggles the Category dropdown and closes "Assigned To" if open. */
function openAndCloseCategorySection() {
    closeAssignedToDropdownIfOpen();
    toggleCategoryDropdown();
  }
  
  /** Closes the "Assigned To" dropdown if it's open. */
  function closeAssignedToDropdownIfOpen() {
    const dropSec = document.getElementById('dropDownSection');
    const dropImg = document.getElementById('dropDownImg');
    const assignSec = document.getElementById('assignedToSection');
    if (!dropSec.classList.contains('d-none')) {
      dropSec.classList.add('d-none');
      dropImg.src = "assets/img/dropDownArrowDown.svg";
      assignSec.classList.remove('blue-border');
    }
  }
  
  /** Toggles the Category dropdown visibility. */
  function toggleCategoryDropdown() {
    let dropSec = document.getElementById('categoryDropDownSection');
    let dropImg = document.getElementById('dropDownImgCategory');
    let catSec = document.getElementById('categorySection');
  
    dropSec.classList.toggle('d-none');
    if (dropSec.classList.contains('d-none')) {
      dropImg.src = "assets/img/dropDownArrowDown.svg";
      catSec.classList.remove('blue-border');
    } else {
      dropImg.src = "assets/img/dropDownArrowUp.svg";
      catSec.classList.add('blue-border');
    }
  }


  /** Closes "Assigned To" dropdown if outside click detected. */
function closeAssignedToIfClickedOutside(evt) {
  const section = document.getElementById('assignedToSection');
  const dropDown = document.getElementById('dropDownSection');
  if (!section.contains(evt.target) && !dropDown.contains(evt.target)) {
    dropDown.classList.add('d-none');
    document.getElementById('dropDownImg').src = "assets/img/dropDownArrowDown.svg";
    section.classList.remove('blue-border');
  }
}

/** Closes category dropdown if outside click detected. */
function closeCategoryIfClickedOutside(evt) {
  const categorySec = document.getElementById('categorySection');
  const categoryDrop = document.getElementById('categoryDropDownSection');
  if (!categorySec.contains(evt.target) && !categoryDrop.classList.contains('d-none')) {
    categoryDrop.classList.add('d-none');
    document.getElementById('dropDownImgCategory').src = "assets/img/dropDownArrowDown.svg";
    categorySec.classList.remove('blue-border');
  }
}

/** Closes subtask input if outside click detected. */
function closeSubtaskIfClickedOutside(evt) {
  const subtaskDiv = document.getElementById('subtaskSectionInput');
  if (!subtaskDiv.contains(evt.target)) closeInputSubtaskSection(evt);
}


/** Sets the category text and toggles its dropdown. */
function selectCategory(name) {
  let field = document.getElementById('selectTaskCategorySpan');
  let dropSec = document.getElementById('categoryDropDownSection');
  let dropImg = document.getElementById('dropDownImgCategory');

  field.innerHTML = name;
  dropSec.classList.toggle('d-none');
  dropImg.src = dropImg.src.includes("ArrowDown")
    ? "assets/img/dropDownArrowUp.svg"
    : "assets/img/dropDownArrowDown.svg";
}