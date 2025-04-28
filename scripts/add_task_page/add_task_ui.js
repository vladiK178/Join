let userCircle;

function renderCurrentUserCircle() {
  const currentUserFirstName = localStorage.getItem("firstName");
  const currentUserLastName = localStorage.getItem("lastName");
  const userCircle =
    currentUserFirstName[0].toUpperCase() +
    currentUserLastName[0].toUpperCase();
  return userCircle;
}

function renderDesktopTemplate() {
  document.getElementById("templateSection").innerHTML =
    getDesktopTemplate(renderCurrentUserCircle());
}

function highlightAddTaskSection() {
  toggleSectionHighlight("summary", false);
  toggleSectionHighlight("addTask", true);
}

function toggleSectionHighlight(section, isActive) {
  const sectionElem = document.getElementById(`${section}-section`);
  const img = document.getElementById(`${section}-img`);

  sectionElem.classList.toggle("chosen-section", isActive);
  img.classList.toggle(`${section}-img-chosen`, isActive);
  img.classList.toggle(`${section}-img`, !isActive);
}

function renderAssignedToSection() {
  contacts = currentUser.contacts || {};
  const dropDown = document.getElementById("dropDownSection");
  const chosenSec = document.getElementById("choosenNamesSection");
  dropDown.innerHTML = chosenSec.innerHTML = "";

  if (!Object.values(contacts).some(isCurrentUserContact)) addSelfContact();

  renderContacts(contacts, dropDown, chosenSec);
}

function isCurrentUserContact(contact) {
  return (
    currentUser.firstName.toLowerCase() ===
      contact.firstNameContact.toLowerCase() &&
    currentUser.lastName.toLowerCase() === contact.lastNameContact.toLowerCase()
  );
}

function addSelfContact() {
  contacts[`self_${currentUser.id}`] = {
    firstNameContact: currentUser.firstName,
    lastNameContact: currentUser.lastName,
  };
}

function renderContacts(contacts, dropDown, chosenSec) {
  const colorMap = {};
  for (let key in contacts) {
    const contact = contacts[key];
    const color = (colorMap[key] = getRandomColorFromPalette());
    const isUser = isCurrentUserContact(contact);

    renderContactItem({ key, contact, color, isUser, dropDown, chosenSec });
  }
}

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

  dropDown.innerHTML += `
    <div onclick="toggleAssignedToBackground('${key}', '${color}')" id="assignedToName${key}" class="${assignedClass}">
      <div class="name-section">
        <div class="name-circle" style="background-color: ${color}"><span>${initials}</span></div>
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
      </div>
      <input class="custom-checkbox checkbox-width-zero" id="assignedToCheckbox${key}" type="checkbox" ${isChecked} style="pointer-events: none;">
    </div>`;

  if (isUser) {
    chosenSec.innerHTML += `
      <div id="chosenName${key}" class="name-circle" style="background-color: ${color}">
        <span>${initials}</span>
      </div>`;
  }
}

function toggleAssignedToBackground(key, color) {
  const box = document.getElementById(`assignedToCheckbox${key}`);
  const div = document.getElementById(`assignedToName${key}`);
  box.checked = !box.checked;

  div.classList.toggle("assigned-to-name", !box.checked);
  div.classList.toggle("checked-assigned-to", box.checked);

  box.checked ? addChosenNameCircle(key, color) : removeChosenNameCircle(key);
}

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

function removeChosenNameCircle(key) {
  const el = document.getElementById(`chosenName${key}`);
  if (el) el.remove();
}

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

function renderSubtasks() {
  const section = document.getElementById("subtaskSection");
  section.innerHTML = "";

  for (let key in currentSubTask) {
    const { subTaskDescription } = currentSubTask[key];
    section.innerHTML += `
      <div id="taskBulletPoint${key}" class="task-bullet-point">
        <li>${subTaskDescription}</li>
        <div class="edit-trash-section">
          <img onclick="subtaskEdit('${key}')" src="./assets/img/subtaskPen.svg" alt="">
          <div class="seperator-edit-trash"></div>
          <img onclick="deleteSubTasks('${key}')" src="./assets/img/trashImg.svg" alt="">
        </div>
      </div>`;
  }
}

function addSubtaskEnterListener() {
  document.getElementById("subtask").addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
      addSubtask();
      evt.preventDefault();
    }
  });
}

function initOutsideClickListener() {
  document.addEventListener("click", (evt) => {
    closeAssignedToOnOutsideClick(evt);
    closeCategoryOnOutsideClick(evt);
    closeSubtaskOnOutsideClick(evt);
  });
}

function choseTechnicalTask() {
  selectCategory("Technical Task");
}

function choseUserStory() {
  selectCategory("User Story");
}

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
