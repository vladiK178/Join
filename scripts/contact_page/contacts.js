let currentUser;
const contactColors = {};
let currentlyOpenMenu = null; // Stores the currently open menu

/**
 * Initializes the contact page with data from Firebase
 */
async function initContactPage() {
  const userId = localStorage.getItem("currentUserId");
  
  if (!userId) {
    console.error("No user ID found in localStorage - login required");
    window.location.href = "index.html";
    return;
  }
  
  try {
    // Load directly from Firebase instead of localStorage
    await getUsersData();
    currentUser = users[userId];
    
    // If no user data was found, redirect to login
    if (!currentUser) {
      console.error("User not found in database");
      localStorage.clear();
      window.location.href = "index.html";
      return;
    }
    
    // Update user ID in localStorage
    localStorage.setItem("currentUserId", userId);
    
    renderDesktopTemplate();
    renderContactsContent();
    changeToChosenContactsSection();
    renderSpacerAndContactSection();
  } catch (error) {
    console.error("Error loading user data from Firebase:", error);
    window.location.href = "index.html";
  }
}

let userCircle;

function renderCurrentUserCircle() {
  const currentUserFirstName = localStorage.getItem("firstName");
  const currentUserLastName = localStorage.getItem("lastName");
  const userCircle =
    currentUserFirstName[0].toUpperCase() +
    currentUserLastName[0].toUpperCase();
  return userCircle;
}

/**
 * Renders the desktop template in the specified element
 */
function renderDesktopTemplate() {
  const content = document.getElementById('templateSection');
  content.innerHTML = "";
  content.innerHTML += getDesktopTemplate(renderCurrentUserCircle());
}

/**
 * Highlights the contacts section in navigation menu
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
 * Handles contact selection by its key
 * @param {string} key - Unique contact key
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
 * Removes selection from all contacts
 */
function resetAllContacts() {
  document
    .querySelectorAll(".contact-chosen")
    .forEach(contact => contact.classList.remove("contact-chosen"));
}

/**
 * Resets contact view to default state
 */
function resetToDefaultState() {
  resetAllContacts();
  const details = document.getElementById("contactDetails");
  if (details) details.innerHTML = "";
}

/**
 * Slide-in animation for Add Contact overlay
 */
function animateSlideInFromRight(element) {
  element.classList.add("add-contact-slide-in");
  setTimeout(() => element.classList.remove("add-contact-slide-in"), 500);
}

/**
 * Shows the add contact overlay
 */
function openAddContactSection() {
  const overlay = document.getElementById("addContactContainerOverlay");
  overlay.classList.remove("d-none");
  overlay.classList.add("overlay-fade-in");
  renderAddContactSection();
  const card = document.getElementById("addContactCard");
  animateSlideInFromRight(card);
}

/**
 * Hides the add contact overlay
 */
function closeAddContactSection() {
  const overlay = document.getElementById("addContactContainerOverlay");
  const card = document.getElementById("addContactCard");
  card.classList.add("add-contact-slide-out");
  overlay.classList.remove("overlay-fade-in");
  overlay.classList.add("overlay-fade-out");   
  setTimeout(() => {
    card.classList.remove("add-contact-slide-out");
    overlay.classList.add("d-none");
    overlay.classList.remove("overlay-fade-out");
  }, 400);
}

/**
 * Creates a new contact after validation and adds to Firebase
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
    
    // Firebase: Add contact
    let newContactKey = await addContactToDatabase(currentUser.id, newContact);
    
    // Update local object
    currentUser.contacts[newContactKey] = newContact;
    
    // Reload all data from Firebase
    await getUsersData();
    currentUser = users[currentUser.id];

    showSuccessMessage();
    setTimeout(() => { 
      closeAddContactSection(); 
      renderSpacerAndContactSection(); 
    }, 2000);
  } catch (error) {
    console.error("Error saving new contact to Firebase:", error);
  }
}



/**
 * Validates contact information
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} phone - Phone number
 * @returns {boolean} Validity status
 */
function checkAllInputsValid() {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const phone = document.getElementById("contactNumber").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9\s]{10,15}$/;

  const nameValid = name.split(" ").filter(Boolean).length >= 2;
  const emailValid = emailRegex.test(email);
  const phoneValid = phoneRegex.test(phone);

  const button = document.querySelector(".create-button");

  const allValid = nameValid && emailValid && phoneValid;

  button.disabled = !allValid;
  button.style.backgroundColor = allValid ? "#2a3647" : "#5c5c5c";
  button.style.cursor = allValid ? "pointer" : "default";
}

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
 * Renders the add contact overlay content
 */
function renderAddContactSection() {
  const overlay = document.getElementById("addContactContainerOverlay");
  overlay.innerHTML = getAddContactSectionHtml();
}

/**
 * Renders the main contacts content area
 */
function renderContactsContent() {
  const content = document.getElementById('newContentSection');
  content.innerHTML = getContactsContentHtml();
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
        <span>${contact.firstNameContact} ${contact.lastNameContact}</span>
        <span class="email-span">${email}</span>
      </div>
    </div>`;
}

/**
 * Opens the edit contact overlay
 * @param {string} contactKey - Contact key to edit
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
 * Shows feedback message to user
 * @param {string} message - Text to display
 * @param {boolean} isError - Whether message is an error
 */
function showToastMessage(message, isError = false) {
  // Create toast element
  let toast = document.getElementById("toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-message";
    toast.style.position = "fixed";
    toast.style.bottom = "100px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
  }

  // Set style and content
  toast.style.backgroundColor = isError ? "#FF3D00" : "#2A3647";
  toast.style.color = "white";
  toast.textContent = message;
  toast.style.display = "block";

  // Auto-hide after delay
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

/**
 * Saves edited contact information to Firebase
 * @param {string} contactKey - Contact key to update
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
    // Firebase: Update contact
    await updateContactInDatabase(currentUser.id, contactKey, updatedContact);
    
    // Update local data
    currentUser.contacts[contactKey] = updatedContact;
    
    // Reload data from Firebase
    await getUsersData();
    currentUser = users[currentUser.id];
    
    showToastMessage("Saved changes");
    renderSpacerAndContactSection();
    closeEditContactSection();
    renderContactDetails(contactKey);
  } catch (error) {
    console.error("Error updating contact in Firebase:", error);
  }
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
    
    // Firebase: Delete contact
    await deleteContactFromDatabase(currentUser.id, contactKey);
    
    // Update local data
    delete currentUser.contacts[contactKey];
    
    // Reload data from Firebase
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