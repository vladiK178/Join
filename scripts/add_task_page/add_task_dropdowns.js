
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
  dropdown.classList.toggle("d-none");
  icon.src = dropdown.classList.contains("d-none")
  ? "assets/img/dropDownArrowDown.svg"
  : "assets/img/dropDownArrowUp.svg";
}

function toggleDropdown(type) {
  const dropdown = document.getElementById(
    `${type === "assignedTo" ? "dropDownSection" : "categoryDropDownSection"}`
  );
  const icon = document.getElementById(
    `${type === "assignedTo" ? "dropDownImg" : "dropDownImgCategory"}`
  );
  const section = document.getElementById(
    `${type === "assignedTo" ? "assignedToSection" : "categorySection"}`
  );

  dropdown.classList.toggle("d-none");
  const isOpen = !dropdown.classList.contains("d-none");

  icon.src = isOpen
    ? "assets/img/dropDownArrowUp.svg"
    : "assets/img/dropDownArrowDown.svg";
  section.classList.toggle("blue-border", isOpen);
}

function closeDropdownIfOpen(type) {
  const dropdown = document.getElementById(
    `${type === "assignedTo" ? "dropDownSection" : "categoryDropDownSection"}`
  );
  const icon = document.getElementById(
    `${type === "assignedTo" ? "dropDownImg" : "dropDownImgCategory"}`
  );
  const section = document.getElementById(
    `${type === "assignedTo" ? "assignedToSection" : "categorySection"}`
  );

  if (!dropdown.classList.contains("d-none")) {
    dropdown.classList.add("d-none");
    icon.src = "assets/img/dropDownArrowDown.svg";
    section.classList.remove("blue-border");
  }
}