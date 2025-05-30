let currentUser;
const contactColors = {};
let currentlyOpenMenu = null; 
let currentContactKey = null;
let userCircle;

/**
 * Creates the initials for the current user based on their first and last name.
 * Retrieves names from localStorage and returns the two first letters capitalized.
 * @returns {string} Initials of the current user (e.g., "AB")
 */
function renderCurrentUserCircle() {
  const currentUserFirstName = localStorage.getItem("firstName");
  const currentUserLastName = localStorage.getItem("lastName");
  const userCircle =
    currentUserFirstName[0].toUpperCase() +
    currentUserLastName[0].toUpperCase();
  return userCircle;
}

/**
 * Sorts contact list by first name
 * @param {Object} contacts - Contacts object to sort
 * @returns {Array} Sorted array of contact keys
 */
function sortContactsByFirstName(contacts) {
  const entries = Object.entries(contacts);
  const sorted = entries.sort(([_, a], [__, b]) =>
    a.firstNameContact.toLowerCase().localeCompare(b.firstNameContact.toLowerCase())
  );
  return sorted.map(([key]) => key);
}

/**
 * Saves a new contact to the database.
 */
async function saveNewContact() {
  const { name, email, phone } = getNewContactInputValues();
  if (!validateNewContact(name, email, phone)) return;

  try {
    const { fName, lName } = splitContactName(name);
    const newContactKey = await createNewContactInDatabase(fName, lName, email, phone);
    await refreshCurrentUser();
    handleSuccessfulContactCreation(newContactKey);
  } catch (error) {
    handleContactCreationError(error);
  }
}

/**
 * Retrieves input values for a new contact.
 * @returns {{name: string, email: string, phone: string}} - Contact input values
 */
function getNewContactInputValues() {
  return {
    name: document.getElementById("contactName").value.trim(),
    email: document.getElementById("contactEmail").value.trim(),
    phone: document.getElementById("contactNumber").value.trim()
  };
}

/**
 * Splits full name into first and last name.
 * @param {string} name - Full contact name
 * @returns {{fName: string, lName: string}} - First and last name
 */
function splitContactName(name) {
  const [fName, lName] = formatContactName(name);
  return { fName, lName };
}

/**
 * Adds a new contact to the database.
 * @param {string} fName - First name
 * @param {string} lName - Last name
 * @param {string} email - Email address
 * @param {string} phone - Phone number
 * @returns {Promise<string>} - New contact key
 */
async function createNewContactInDatabase(fName, lName, email, phone) {
  initializeContactsObjectIfNeeded();
  const newContact = { firstNameContact: fName, lastNameContact: lName, email, phone };
  return await addContactToDatabase(currentUser.id, newContact);
}

/**
 * Refreshes the current user data after database update.
 */
async function refreshCurrentUser() {
  await getUsersData();
  currentUser = users[currentUser.id];
}

/**
 * Handles UI changes after successfully saving a contact.
 * @param {string} newContactKey - Key of the new contact
 */
function handleSuccessfulContactCreation(newContactKey) {
  showSuccessMessage();
  setTimeout(() => {
    closeAddContactSection();
    renderSpacerAndContactSection();
  }, 2000);
}

/**
 * Handles errors during new contact creation.
 * @param {Error} error - Error object
 */
function handleContactCreationError(error) {
  console.error("Error saving new contact to Firebase:", error);
}

/**
 * Validates the input data for creating a new contact.
 * Checks if the name, email, and phone number are properly formatted and if the email already exists.
 * @param {string} name - Full name of the contact
 * @param {string} email - Email address of the contact
 * @param {string} phone - Phone number of the contact
 * @returns {boolean} True if all validations pass, otherwise false
 */
function validateNewContact(name, email, phone) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s]{10,15}$/;
  let isValid = true;
  if (!validateNameParts(name, "alertMessageTitle")) isValid = false;
  if (!validateEmail(email, emailRegex, "alertMessageEmail")) isValid = false;
  if (!validatePhone(phone, phoneRegex, "alertMessageNumber")) isValid = false;
  if (isEmailExisting(email)) {
    showEmailAlreadyExists("alertMessageEmail");
    isValid = false;
  }
  return isValid;
}

/**
 * Renders all contacts grouped by first letter
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
  let currentLetter = "";
  sortedKeys.forEach(key => {
    const contact = currentUser.contacts[key];
    const firstLetter = contact.firstNameContact.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      container.innerHTML += `<div class="spacer">${currentLetter}</div>`;
    }
    container.innerHTML += getContactListItemHtml(key, contact);
  });
}

/**
 * Creates HTML for a single contact list item
 * @param {string} key - Contact key
 * @param {Object} contact - Contact data
 * @returns {string} HTML string
 */
function getContactListItemHtml(key, contact) {
  const color = getOrAssignColorForContact(key);
  const initials = `${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}`;
  const email = contact.email || 'No email';
  return `
    <div id="contact-${key}" class="contact" onclick="chooseContact('${key}')">
      <span class="name-circle" style="background-color: ${color};">${initials}</span>
      <div class="name-and-email">
        <span class="contact-list-name">${contact.firstNameContact} ${contact.lastNameContact}</span>
        <span class="email-span contact-list-email">${email}</span>
      </div>
    </div>`;
}

/**
 * Creates edit overlay if it doesn't exist
 */
function createEditOverlayIfMissing() {
  const overlay = document.querySelector(".edit-contact-container-overlay");
  if (!overlay) {
    const body = document.querySelector("body");
    body.insertAdjacentHTML('beforeend', '<div class="edit-contact-container-overlay d-none"></div>');
  }
}

/**
 * Renders edit contact form with data
 * @param {Object} contact - Contact to edit
 * @param {string} contactKey - Contact key
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
 * Closes the edit contact overlay
 */
function closeEditContactSection() {
  const overlay = document.querySelector(".edit-contact-container-overlay");
  if (overlay) overlay.classList.add("d-none");
}

/**
 * Saves changes made to an existing contact.
 * @param {string} contactKey - Key of the contact to edit
 */
async function saveEditedContact(contactKey) {
  const { name, email, phone } = getEditContactInputValues();
  if (!validateNewContact(name, email, phone)) return;

  try {
    const { fName, lName } = splitContactName(name);
    const updatedContact = createUpdatedContactObject(fName, lName, email, phone);
    await updateContactInDatabase(currentUser.id, contactKey, updatedContact);
    await refreshCurrentUser();
    handleSuccessfulContactEdit(contactKey);
  } catch (error) {
    handleContactEditError(error);
  }
}

/**
 * Retrieves input values from the edit contact form.
 * @returns {{name: string, email: string, phone: string}} - Edited contact input values
 */
function getEditContactInputValues() {
  return {
    name: document.getElementById("editContactName").value.trim(),
    email: document.getElementById("editContactEmail").value.trim(),
    phone: document.getElementById("editContactPhone").value.trim()
  };
}

/**
 * Creates a contact object with updated values.
 * @param {string} fName - First name
 * @param {string} lName - Last name
 * @param {string} email - Email address
 * @param {string} phone - Phone number
 * @returns {Object} - Updated contact object
 */
function createUpdatedContactObject(fName, lName, email, phone) {
  return {
    firstNameContact: fName,
    lastNameContact: lName,
    email,
    phone
  };
}

/**
 * Handles UI changes after successfully editing a contact.
 * @param {string} contactKey - Key of the edited contact
 */
function handleSuccessfulContactEdit(contactKey) {
  setTimeout(() => {
    renderSpacerAndContactSection();
    chooseContact(contactKey);
  }, 2000);
}

/**
 * Handles errors during contact editing.
 * @param {Error} error - Error object
 */
function handleContactEditError(error) {
  console.error("Error updating contact in Firebase:", error);
}

/**
 * Validates edited contact data
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} phone - Phone number
 * @returns {boolean} Validity status
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
 * Deletes a contact from Firebase
 * @param {string} contactKey - Contact key to delete
 */
async function deleteContact(contactKey) {
  try {
    if (!currentUser.contacts || !currentUser.contacts[contactKey]) {
      throw new Error("Contact not found or invalid key.");
    }
    await deleteContactFromDatabase(currentUser.id, contactKey);
    delete currentUser.contacts[contactKey];
    await getUsersData();
    currentUser = users[currentUser.id];
    showToastMessage("Contact deleted");
    handlePostDeleteUI();
  } catch (error) {
    console.error("Error deleting contact from Firebase:", error);
  }
}

/**
 * Updates UI after contact deletion
 */
function handlePostDeleteUI() {
  renderSpacerAndContactSection();
  const details = document.getElementById("contactDetails");
  if (details) details.innerHTML = "";
  closeMobileContactViewIfNeeded();
  closeEditContactOverlayIfOpen();
}

/**
 * Handles mobile view after deletion
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
 * Closes edit overlay if open
 */
function closeEditContactOverlayIfOpen() {
  const editOverlay = document.querySelector(".edit-contact-container-overlay");
  if (editOverlay && !editOverlay.classList.contains("d-none")) {
    editOverlay.classList.add("d-none");
  }
}

/**
 * Returns or assigns a color for a contact
 * @param {string} contactKey - Contact key
 * @returns {string} Color hex code
 */
function getOrAssignColorForContact(contactKey) {
  if (!contactColors[contactKey]) {
    contactColors[contactKey] = getRandomColorFromPalette();
  }
  return contactColors[contactKey];
}

/**
 * Closes the mobile menu and resets the menu icon state.
 *
 * @param {HTMLElement} menuSection - The mobile menu element to hide
 * @param {HTMLElement} menuIcon - The menu icon element to update
 */
function closeMobileMenu(menuSection, menuIcon) {
  menuSection.classList.add("d-none");
  menuIcon.classList.remove("open-menu-mobile");
  menuIcon.classList.add("closed-menu-mobile");
}

// Event listener for clicks outside the menu
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
