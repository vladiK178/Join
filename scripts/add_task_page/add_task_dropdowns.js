/**
 * Toggles the visibility of the "Assigned To" dropdown section.
 * Closes the "Category" dropdown if it is open.
 */
function toggleAssignedToSection() {
  closeDropdownIfOpen("category");
  toggleDropdown("assignedTo");
}

/**
 * Toggles the visibility of the "Category" dropdown section.
 * Closes the "Assigned To" dropdown if it is open.
 */
function toggleCategorySection() {
  closeDropdownIfOpen("assignedTo");
  toggleDropdown("category");
}

/**
 * Closes the "Assigned To" dropdown if the click was outside of it.
 * @param {MouseEvent} evt - The click event.
 */
function closeAssignedToOnOutsideClick(evt) {
  const section = document.getElementById("assignedToSection");
  const dropdown = document.getElementById("dropDownSection");

  if (!section.contains(evt.target) && !dropdown.contains(evt.target)) {
    closeDropdownIfOpen("assignedTo");
  }
}

/**
 * Closes the "Category" dropdown if the click was outside of it and it is open.
 * @param {MouseEvent} evt - The click event.
 */
function closeCategoryOnOutsideClick(evt) {
  const section = document.getElementById("categorySection");
  const dropdown = document.getElementById("categoryDropDownSection");

  if (
    !section.contains(evt.target) &&
    !dropdown.classList.contains("d-none") &&
    !dropdown.contains(evt.target)
  ) {
    closeDropdownIfOpen("category");
  }
}

/**
 * Closes the subtask input section if the click was outside of it.
 * @param {MouseEvent} evt - The click event.
 */
function closeSubtaskOnOutsideClick(evt) {
  const subtaskDiv = document.getElementById("subtaskSectionInput");
  if (!subtaskDiv.contains(evt.target)) closeInputSubtaskSection(evt);
}

/**
 * Sets the selected category and closes the dropdown.
 * @param {string} name - The name of the selected category.
 */
function selectCategory(name) {
  const field = document.getElementById("selectTaskCategorySpan");
  const dropdown = document.getElementById("categoryDropDownSection");
  const icon = document.getElementById("dropDownImgCategory");

  field.innerHTML = name;
  dropdown.classList.remove("open");
  dropdown.style.maxHeight = "0px";
  icon.src = "assets/img/dropDownArrowDown.svg";
}

/**
 * Toggles the dropdown visibility and icon state for "assignedTo" or "category".
 * @param {string} type - The type of dropdown to toggle ("assignedTo" or "category").
 */
function toggleDropdown(type) {
  const dropdown = document.getElementById(
    type === "assignedTo" ? "dropDownSection" : "categoryDropDownSection"
  );
  const icon = document.getElementById(
    type === "assignedTo" ? "dropDownImg" : "dropDownImgCategory"
  );
  const section = document.getElementById(
    type === "assignedTo" ? "assignedToSection" : "categorySection"
  );

  const isOpen = dropdown.classList.contains("open");
  isDropdownOpen(dropdown, icon, section, isOpen);
}

/**
 * Applies the open/close toggle effect to a dropdown.
 * @param {HTMLElement} dropdown - The dropdown element.
 * @param {HTMLElement} icon - The arrow icon element.
 * @param {HTMLElement} section - The surrounding section element.
 * @param {boolean} isOpen - Whether the dropdown is currently open.
 */
function isDropdownOpen(dropdown, icon, section, isOpen) {
  if (isOpen) {
    dropdown.classList.remove("open");
    dropdown.style.maxHeight = "0px";
    icon.src = "assets/img/dropDownArrowDown.svg";
    section.classList.remove("blue-border");
  } else {
    dropdown.classList.add("open");
    dropdown.style.maxHeight = "300px";
    icon.src = "assets/img/dropDownArrowUp.svg";
    section.classList.add("blue-border");
  }
}

/**
 * Closes the dropdown if it is open.
 * @param {string} type - The type of dropdown to close ("assignedTo" or "category").
 */
function closeDropdownIfOpen(type) {
  const dropdown = document.getElementById(
    type === "assignedTo" ? "dropDownSection" : "categoryDropDownSection"
  );
  const icon = document.getElementById(
    type === "assignedTo" ? "dropDownImg" : "dropDownImgCategory"
  );
  const section = document.getElementById(
    type === "assignedTo" ? "assignedToSection" : "categorySection"
  );

  dropdownContainsOpen(dropdown, icon, section);
}

/**
 * Closes a dropdown if it currently has the "open" class.
 * @param {HTMLElement} dropdown - The dropdown element.
 * @param {HTMLElement} icon - The arrow icon element.
 * @param {HTMLElement} section - The surrounding section element.
 */
function dropdownContainsOpen(dropdown, icon, section) {
  if (dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
    dropdown.style.maxHeight = "0px";
    icon.src = "assets/img/dropDownArrowDown.svg";
    section.classList.remove("blue-border");
  }
}
