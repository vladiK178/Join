/**
 * Gets or creates color for contact
 * @param {string} contactKey - Contact identifier
 * @returns {string} Color hex code
 */
function getOrAssignColorForContact(contactKey) {
  if (!contactColors[contactKey]) {
    contactColors[contactKey] = getRandomColorFromPalette();
  }
  return contactColors[contactKey];
}

/**
 * Renders contact details in right panel
 * @param {string} contactKey - Contact to display
 */
function renderContactDetails(contactKey) {
  const container = document.getElementById("contactDetails");
  const contact = currentUser.contacts[contactKey];

  // Handle missing contact
  if (!contact) {
    console.error("Contact not found:", contactKey);
    if (container) container.innerHTML = "<div>Contact not available.</div>";
    return;
  }

  // Render contact with assigned color
  const color = getOrAssignColorForContact(contactKey);
  container.innerHTML = getContactDetailsHtml(contactKey, contact, color);
}

/**
 * Gets contact element by its key
 * @param {string} key - Contact key
 * @returns {HTMLElement|null} Contact element or null
 */
function getContactElement(key) {
  const element = document.getElementById(`contact-${key}`);
  if (!element) console.error(`Contact ${key} not found in DOM`);
  return element;
}

/**
 * Checks if contact is already selected
 * @param {HTMLElement} element - Contact element
 * @returns {boolean} True if selected
 */
function isContactAlreadyChosen(element) {
  return element.classList.contains("contact-chosen");
}

/**
 * Checks if viewport is mobile size
 * @returns {boolean} True if mobile width
 */
function isMobileView() {
  return window.innerWidth <= 1000;
}

/**
 * Handles contact selection on mobile
 * @param {string} key - Selected contact key
 */
function handleMobileContactSelection(key) {
  // Get container elements
  const listSection = document.querySelector(".contact-section");
  const detailSection = document.querySelector(".show-contact");

  // Switch view if both elements exist
  if (listSection && detailSection) {
    listSection.style.display = "none";
    detailSection.style.display = "block";
  }

  // Show selected contact details
  renderContactDetails(key);
}

/**
 * Returns to contacts list from detail view
 */
function goBackToContacts() {
  const listSection = document.querySelector(".contact-section");
  const detailSection = document.querySelector(".show-contact");

  if (listSection && detailSection) {
    listSection.style.display = "block";
    detailSection.style.display = "none";
  }
}

/**
 * Toggles mobile menu visibility
 * @param {Event} event - Click event
 */
function toggleMenuMobile(event) {
  // Prevent event bubbling
  event.stopPropagation();

  // Get menu elements
  const menu = document.getElementById("menuSectionMobile");
  const icon = document.getElementById("noteMenuMobile");

  if (!menu || !icon) {
    console.error("Menu elements not found");
    return;
  }

  // Check if menu is open
  const isOpen = !menu.classList.contains("d-none");

  // Close if open, open if closed
  if (isOpen) {
    menu.classList.add("d-none");
    icon.classList.remove("open-menu-mobile");
    icon.classList.add("closed-menu-mobile");
  } else {
    // Close any other open menu first
    if (currentlyOpenMenu && currentlyOpenMenu !== menu) {
      currentlyOpenMenu.classList.add("d-none");
      const prevIcon = document.getElementById("noteMenuMobile");
      if (prevIcon) {
        prevIcon.classList.remove("open-menu-mobile");
        prevIcon.classList.add("closed-menu-mobile");
      }
    }

    // Open this menu
    menu.classList.remove("d-none");
    icon.classList.remove("closed-menu-mobile");
    icon.classList.add("open-menu-mobile");
    currentlyOpenMenu = menu;
  }
}

/**
 * Shows success message temporarily
 */
function showSuccessMessage() {
  const overlay = document.getElementById("successContactsOverlay");
  overlay.classList.remove("d-none");

  // Hide after delay
  setTimeout(() => {
    overlay.classList.add("d-none");
  }, 2250);
}
