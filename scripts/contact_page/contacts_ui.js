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
 * Renders contact details in the right panel.
 * @param {string} contactKey - Key of the contact to render
 */
function renderContactDetails(contactKey) {
  const container = document.getElementById("contactDetails");
  const contact = getContactByKey(contactKey);

  if (!contact) {
    showContactNotFound(container, contactKey);
    return;
  }

  renderContactContent(container, contactKey, contact);
}

/**
 * Retrieves a contact by its key.
 * @param {string} contactKey - Unique contact identifier
 * @returns {Object|null} The contact object or null if not found
 */
function getContactByKey(contactKey) {
  return currentUser.contacts[contactKey] || null;
}

/**
 * Displays a fallback message when contact is not found.
 * @param {HTMLElement} container - HTML container element
 * @param {string} contactKey - Key of the missing contact
 */
function showContactNotFound(container, contactKey) {
  console.error("Contact not found:", contactKey);
  if (container) {
    container.innerHTML = "<div>Contact not available.</div>";
  }
}

/**
 * Renders contact content and triggers the slide-in animation.
 * @param {HTMLElement} container - HTML container element
 * @param {string} contactKey - Key of the contact
 * @param {Object} contact - Contact object
 */
function renderContactContent(container, contactKey, contact) {
  const color = getOrAssignColorForContact(contactKey);
  container.innerHTML = getContactDetailsHtml(contactKey, contact, color);
  const contentDiv = document.getElementById("contactDetailsContent");
  if (contentDiv) {
    contentDiv.classList.add("slide-in-from-right");
  }
}

/**
 * Toggles the visibility of the mobile menu.
 * @param {Event} event - Click event
 */
function toggleMenuMobile(event) {
  event.stopPropagation();
  const menu = document.getElementById("menuSectionMobile");
  const icon = document.getElementById("noteMenuMobile");
  if (!menu || !icon) {
    handleMissingMenuElements();
    return;
  }
  if (isMenuOpen(menu)) {
    closeMenu(menu, icon);
  } else {
    closePreviouslyOpenMenu();
    openMenu(menu, icon);
    currentlyOpenMenu = menu;
  }
}

/**
 * Handles missing menu elements by logging an error.
 */
function handleMissingMenuElements() {
  console.error("Menu elements not found");
}

/**
 * Checks if a mobile menu is currently open.
 * @param {HTMLElement} menu - Menu element
 * @returns {boolean} True if menu is open
 */
function isMenuOpen(menu) {
  return !menu.classList.contains("d-none");
}

/**
 * Closes the specified mobile menu.
 * @param {HTMLElement} menu - Menu element to close
 * @param {HTMLElement} icon - Menu icon element to update
 */
function closeMenu(menu, icon) {
  menu.classList.add("d-none");
  icon.classList.remove("open-menu-mobile");
  icon.classList.add("closed-menu-mobile");
}

/**
 * Opens the specified mobile menu.
 * @param {HTMLElement} menu - Menu element to open
 * @param {HTMLElement} icon - Menu icon element to update
 */
function openMenu(menu, icon) {
  menu.classList.remove("d-none");
  icon.classList.remove("closed-menu-mobile");
  icon.classList.add("open-menu-mobile");
}

/**
 * Closes any previously open mobile menu.
 */
function closePreviouslyOpenMenu() {
  if (currentlyOpenMenu && currentlyOpenMenu !== document.getElementById("menuSectionMobile")) {
    currentlyOpenMenu.classList.add("d-none");
    const prevIcon = document.getElementById("noteMenuMobile");
    if (prevIcon) {
      prevIcon.classList.remove("open-menu-mobile");
      prevIcon.classList.add("closed-menu-mobile");
    }
  }
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
  return window.innerWidth <= 1200;
}

/**
 * Handles contact selection on mobile
 * @param {string} key - Selected contact key
 */
function handleMobileContactSelection(key) {
  const listSection = document.querySelector(".contact-section");
  const detailSection = document.querySelector(".show-contact");
  if (listSection && detailSection) {
    listSection.style.display = "none";
    detailSection.style.display = "block";
  }
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
  event.stopPropagation();
  const menu = document.getElementById("menuSectionMobile");
  const icon = document.getElementById("noteMenuMobile");
  if (!menu || !icon) {
    console.error("Menu elements not found");
    return;
  }
  const isOpen = !menu.classList.contains("d-none");
  if (isOpen) {
    menu.classList.add("d-none");
    icon.classList.remove("open-menu-mobile");
    icon.classList.add("closed-menu-mobile");
  } else {
    if (currentlyOpenMenu && currentlyOpenMenu !== menu) {
      currentlyOpenMenu.classList.add("d-none");
      const prevIcon = document.getElementById("noteMenuMobile");
      if (prevIcon) {
        prevIcon.classList.remove("open-menu-mobile");
        prevIcon.classList.add("closed-menu-mobile");
      }
    }
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
  setTimeout(() => {
    overlay.classList.add("d-none");
  }, 2250);
}