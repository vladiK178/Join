let currentUser;
const contactColors = {};
let currentlyOpenMenu = null; // Stores the currently open menu


/**
 * Initializes the contact page:
 */
async function initContactPage() {
  await getUsersData();
  const currentUserId = localStorage.getItem('currentUserId');
  currentUser = users.users[currentUserId];
  renderDesktopTemplate();
  renderContactsContent();
  changeToChosenContactsSection();
  renderSpacerAndContactSection();
}


/**
 * Renders the desktop template inside the 'templateSection' element.
 */
function renderDesktopTemplate() {
  const content = document.getElementById('templateSection');
  content.innerHTML = "";
  content.innerHTML += getDesktopTemplate(currentUser);
}


/**
 * Highlights the "Contacts" section in the navigation bar.
 */
function changeToChosenContactsSection() {
  document.getElementById('summary-section').classList.remove('chosen-section');
  document.getElementById('summary-img').classList.remove('summary-img-chosen');
  document.getElementById('summary-img').classList.add('summary-img');
  document.getElementById('contacts-section').classList.add('chosen-section');
  document.getElementById('contacts-img').classList.remove('contacts-img');
  document.getElementById('contacts-img').classList.add('contacts-img-chosen');
}


/**
 * Sorts contacts by their first name.
 * @param {Object} contacts - The contacts object.
 * @returns {Array} An array of sorted contact keys.
 */
function sortContactsByFirstName(contacts) {
  const entries = Object.entries(contacts);
  const sorted = entries.sort(([_, a], [__, b]) =>
    a.firstNameContact.toLowerCase().localeCompare(b.firstNameContact.toLowerCase())
  );
  return sorted.map(([key]) => key);
}


/**
 * Handles the selection of a contact by key (mobile or desktop).
 * @param {string} key - The contact's unique key.
 */
function chooseContact(key) {
  const contactElement = getContactElement(key);
  if (!contactElement) return;
  if (isContactAlreadyChosen(contactElement)) return resetToDefaultState();
  if (isMobileView()) return handleMobileContactSelection(key);
  resetAllContacts();
  contactElement.classList.add("contact-chosen");
  renderContactDetails(key);
}


/**
 * Removes the "contact-chosen" class from all contact elements.
 */
function resetAllContacts() {
  document
    .querySelectorAll(".contact-chosen")
    .forEach(contact => contact.classList.remove("contact-chosen"));
}


/**
 * Resets the contact view to a default state (nothing selected).
 */
function resetToDefaultState() {
  resetAllContacts();
  const details = document.getElementById("contactDetails");
  if (details) details.innerHTML = "";
}


/**
 * Opens the "Add Contact" overlay and renders its content.
 */
function openAddContactSection() {
  const overlay = document.getElementById("addContactContainerOverlay");
  overlay.classList.remove("d-none");
  renderAddContactSection();
}


/**
 * Closes the "Add Contact" overlay.
 */
function closeAddContactSection() {
  const overlay = document.getElementById("addContactContainerOverlay");
  overlay.classList.add("d-none");
}


/**
 * Saves a new contact with validation and updates the database.
 * @returns {Promise<void>}
 */
async function saveNewContact() {
  let name = document.getElementById("contactName").value.trim();
  let email = document.getElementById("contactEmail").value.trim();
  let phone = document.getElementById("contactNumber").value.trim();
  if (!validateNewContact(name, email, phone)) return;

  let [fName, lName] = formatContactName(name);
  try {
    initializeContactsObjectIfNeeded();
    let newContact = { firstNameContact: fName, lastNameContact: lName, email, phone };
    let newContactKey = await addContactToDatabase(currentUser.id, newContact);
    currentUser.contacts[newContactKey] = newContact;

    showSuccessMessage();
    setTimeout(() => { closeAddContactSection(); renderSpacerAndContactSection(); }, 2000);
  } catch (error) {
    console.error("Error saving new contact:", error);
  }
}


/**
 * Validates name, email, and phone for a new contact.
 * @param {string} name - The full name (must have at least 2 parts).
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateNewContact(name, email, phone) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s]{10,15}$/;
  if (!validateNameParts(name, 'alertMessageTitle')) return false;
  if (!validateEmail(email, emailRegex, 'alertMessageEmail')) return false;
  if (isEmailExisting(email)) {
    showEmailAlreadyExists('alertMessageEmail');
    return false;
  }
  if (!validatePhone(phone, phoneRegex, 'alertMessageNumber')) return false;
  return true;
}


/**
 * Renders the "Add Contact" overlay by setting the innerHTML.
 */
function renderAddContactSection() {
  const overlay = document.getElementById("addContactContainerOverlay");
  overlay.innerHTML = getAddContactSectionHtml();
}


/**
 * Renders the main contacts content area (list + details).
 */
function renderContactsContent() {
  const content = document.getElementById('newContentSection');
  content.innerHTML = getContactsContentHtml();
}


/**
 * Renders the list of contacts, grouped by first-letter spacers.
 */
function renderSpacerAndContactSection() {
  const container = document.getElementById("spacerAndContactsSection");
  if (!container) return;
  container.innerHTML = "";

  if (!currentUser.contacts || Object.keys(currentUser.contacts).length === 0) {
    container.innerHTML = "<div>No contacts available.</div>";
    return;
  }
  const sortedKeys = Object.keys(currentUser.contacts).sort((a, b) => {
    const cA = currentUser.contacts[a].firstNameContact.toLowerCase();
    const cB = currentUser.contacts[b].firstNameContact.toLowerCase();
    return cA.localeCompare(cB);
  });

  let currentSpacerLetter = "";
  sortedKeys.forEach(key => {
    const contact = currentUser.contacts[key];
    const firstLetter = contact.firstNameContact.charAt(0).toUpperCase();
    if (firstLetter !== currentSpacerLetter) {
      currentSpacerLetter = firstLetter;
      container.innerHTML += `<div class="spacer">${currentSpacerLetter}</div>`;
    }
    container.innerHTML += getContactListItemHtml(key, contact);
  });
}


/**
 * Returns the HTML string for a single contact list item.
 * @param {string} key - Contact key.
 * @param {Object} contact - Contact object.
 * @returns {string} The HTML for a contact list item.
 */
function getContactListItemHtml(key, contact) {
  const color = getOrAssignColorForContact(key);
  const initials = `${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}`;
  const email = contact.email || 'No email';
  return `
    <div id="contact-${key}" class="contact" onclick="chooseContact('${key}')">
      <span class="name-circle" style="background-color: ${color};">${initials}</span>
      <div class="name-and-email">
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
        <span class="email-span">${email}</span>
      </div>
    </div>`;
}


/**
 * Opens the edit overlay for the given contact key.
 * @param {string} contactKey - The contact's unique key.
 */
function openEditContactSection(contactKey) {
  const contactToEdit = currentUser.contacts[contactKey];
  if (!contactToEdit) {
    console.error("Contact not found:", contactKey);
    return;
  }
  createEditOverlayIfMissing();
  renderEditContactSection(contactToEdit, contactKey);
  document.querySelector(".edit-contact-container-overlay").classList.remove("d-none");
}


/**
 * Creates the edit overlay container if it doesn't exist.
 */
function createEditOverlayIfMissing() {
  const overlay = document.querySelector(".edit-contact-container-overlay");
  if (!overlay) {
    const body = document.querySelector("body");
    body.insertAdjacentHTML('beforeend', '<div class="edit-contact-container-overlay d-none"></div>');
  }
}


/**
 * Renders the edit contact overlay content.
 * @param {Object} contact - The contact object to edit.
 * @param {string} contactKey - The contact's unique key.
 */
function renderEditContactSection(contact, contactKey) {
  const overlay = document.querySelector(".edit-contact-container-overlay");
  if (!overlay) {
    console.error("Edit overlay not found!");
    return;
  }
  const color = getOrAssignColorForContact(contactKey);
  overlay.innerHTML = getEditContactSectionHtml(contact, contactKey, color);
}


/**
 * Closes the edit contact overlay.
 */
function closeEditContactSection() {
  const overlay = document.querySelector(".edit-contact-container-overlay");
  if (overlay) overlay.classList.add("d-none");
}


/**
 * Saves an edited contact, updates the database, and re-renders.
 * @param {string} contactKey - The key of the contact to update.
 */
async function saveEditedContact(contactKey) {
  const name = document.getElementById("editContactName").value.trim();
  const email = document.getElementById("editContactEmail").value.trim();
  const phone = document.getElementById("editContactNumber").value.trim();
  if (!validateEditedContact(name, email, phone)) return;
  const [fName, lName] = formatContactName(name);
  const updatedContact = { 
    firstNameContact: fName,
    lastNameContact: lName,
    email: email,
    phone: phone 
  };
  try {
    await updateContactInDatabase(currentUser.id, contactKey, updatedContact);
    currentUser.contacts[contactKey] = updatedContact;
    renderSpacerAndContactSection();
    closeEditContactSection();
    renderContactDetails(contactKey);
  } catch (error) {
    console.error("Error saving edited contact:", error);
  }
}


/**
 * Validates the edited contact data (name, email, phone).
 * @param {string} name - Full name string.
 * @param {string} email - Email address.
 * @param {string} phone - Phone number.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateEditedContact(name, email, phone) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s]{10,15}$/;
  if (!validateNameParts(name, 'editAlertMessageTitle')) return false;
  if (!validateEmail(email, emailRegex, 'editAlertMessageEmail')) return false;
  if (!validatePhone(phone, phoneRegex, 'editAlertMessageNumber')) return false;
  return true;
}


/**
 * Deletes a contact from database and updates local data, then re-renders.
 * @param {string} contactKey - The unique key of the contact to delete.
 */
async function deleteContact(contactKey) {
  try {
    if (!currentUser.contacts || !currentUser.contacts[contactKey]) {
      throw new Error("Contact not found or invalid key.");
    }
    await deleteContactFromDatabase(currentUser.id, contactKey);
    delete currentUser.contacts[contactKey];
    handlePostDeleteUI();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}


/**
 * Manages the UI after a contact is deleted (list, details, overlay).
 */
function handlePostDeleteUI() {
  renderSpacerAndContactSection();
  const details = document.getElementById("contactDetails");
  if (details) details.innerHTML = "";
  closeMobileContactViewIfNeeded();
  closeEditContactOverlayIfOpen();
}


/**
 * Closes the mobile contact view if screen width <= 1000px.
 */
function closeMobileContactViewIfNeeded() {
  if (window.innerWidth <= 1000) {
    const contactSection = document.querySelector(".contact-section");
    const showContact = document.querySelector(".show-contact");
    if (contactSection && showContact) {
      contactSection.style.display = "block";
      showContact.style.display = "none";
    }
  }
}


/**
 * Closes the edit overlay if it's currently open.
 */
function closeEditContactOverlayIfOpen() {
  const editOverlay = document.querySelector(".edit-contact-container-overlay");
  if (editOverlay && !editOverlay.classList.contains("d-none")) {
    editOverlay.classList.add("d-none");
  }
}


/**
 * Closes an open mobile menu if a click occurs outside of it.
 */
document.addEventListener("click", event => {
  const menuSection = document.getElementById("menuSectionMobile");
  const menuIcon = document.getElementById("noteMenuMobile");
  if (
    currentlyOpenMenu &&
    menuSection &&
    !menuSection.contains(event.target) &&
    event.target !== menuIcon
  ) {
    closeMobileMenu(menuSection, menuIcon);
    currentlyOpenMenu = null;
  }
});