
function toggleAssignedToSection() {
  closeDropdownIfOpen("category");
  toggleDropdown("assignedTo");
}

function toggleCategorySection() {
  closeDropdownIfOpen("assignedTo");
  toggleDropdown("category");
}

function closeAssignedToOnOutsideClick(evt) {
  const section = document.getElementById("assignedToSection");
  const dropdown = document.getElementById("dropDownSection");
  
  if (!section.contains(evt.target) && !dropdown.contains(evt.target)) {
    closeDropdownIfOpen("assignedTo");
  }
}

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

function closeSubtaskOnOutsideClick(evt) {
  const subtaskDiv = document.getElementById("subtaskSectionInput");
  if (!subtaskDiv.contains(evt.target)) closeInputSubtaskSection(evt);
}

function selectCategory(name) {
  const field = document.getElementById("selectTaskCategorySpan");
  const dropdown = document.getElementById("categoryDropDownSection");
  const icon = document.getElementById("dropDownImgCategory");

  field.innerHTML = name;

  dropdown.classList.remove("open");
  dropdown.style.maxHeight = "0px";

  icon.src = "assets/img/dropDownArrowDown.svg";
}

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

  if (dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
    dropdown.style.maxHeight = "0px";
    icon.src = "assets/img/dropDownArrowDown.svg";
    section.classList.remove("blue-border");
  }
}