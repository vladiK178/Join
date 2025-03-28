/**
 * Returns or assigns a color for the contact based on its key.
 * @param {string} contactKey - The unique key for the contact.
 * @returns {string} The assigned or newly generated color.
 */
function getOrAssignColorForContact(contactKey) {
    if (!contactColors[contactKey]) {
      contactColors[contactKey] = getRandomColorFromPalette();
    }
    return contactColors[contactKey];
  }


  /**
 * Renders the detailed view of a contact by key.
 * @param {string} contactKey - Unique key of the contact to show.
 */
function renderContactDetails(contactKey) {
    const contactDetails = document.getElementById("contactDetails");
    const contact = currentUser.contacts[contactKey];
    if (!contact) return showMissingContactError(contactDetails, contactKey);
  
    const color = getOrAssignColorForContact(contactKey);
    contactDetails.innerHTML = getContactDetailsHtml(contactKey, contact, color);
  }
  

  /**
 * Displays an error if the contact is missing, used by renderContactDetails.
 * @param {HTMLElement} container - The details container.
 * @param {string} contactKey - The missing contact key.
 */
function showMissingContactError(container, contactKey) {
    console.error("Contact not found:", contactKey);
    if (container) container.innerHTML = "<div>Contact not available.</div>";
  }


  /**
 * Returns the contact element by key or logs an error if not found.
 * @param {string} key - The contact's unique key.
 * @returns {HTMLElement|null} The contact element or null if not found.
 */
function getContactElement(key) {
    const el = document.getElementById(`contact-${key}`);
    if (!el) console.error(`Contact with ID 'contact-${key}' not found.`);
    return el;
  }


  /**
 * Checks if the contact element is already chosen.
 * @param {HTMLElement} contactElement - The DOM element for the contact.
 * @returns {boolean} True if chosen, otherwise false.
 */
function isContactAlreadyChosen(contactElement) {
    return contactElement.classList.contains("contact-chosen");
  }


  /**
 * Checks if current window width indicates a mobile view.
 * @returns {boolean} True if window width is <= 1000px, otherwise false.
 */
function isMobileView() {
    return window.innerWidth <= 1000;
  }


  /**
 * Handles the contact selection logic in mobile view.
 * @param {string} key - The contact's unique key.
 */
function handleMobileContactSelection(key) {
    const contactSection = document.querySelector(".contact-section");
    const showContact = document.querySelector(".show-contact");
    if (contactSection && showContact) {
      contactSection.style.display = "none";
      showContact.style.display = "block";
    }
    renderContactDetails(key);
  }


  /**
 * Shows the contacts list and hides the single contact detail view.
 */
function goBackToContacts() {
    const contactSection = document.querySelector(".contact-section");
    const showContact = document.querySelector(".show-contact");
    if (contactSection && showContact) {
      contactSection.style.display = "block";
      showContact.style.display = "none";
    }
  }


  /**
 * Toggles the mobile menu for editing/deleting a contact.
 * @param {MouseEvent} event - The click event.
 */
function toggleMenuMobile(event) {
    event.stopPropagation();
    const menuSection = document.getElementById("menuSectionMobile");
    const menuIcon = document.getElementById("noteMenuMobile");
    if (!menuSection || !menuIcon) return console.error("Menu or icon not found.");
  
    const menuIsOpen = !menuSection.classList.contains("d-none");
    if (menuIsOpen) return closeMobileMenu(menuSection, menuIcon);
    openMobileMenu(menuSection, menuIcon);
  }


  /**
 * Closes the mobile menu.
 * @param {HTMLElement} menuSection - The menu element.
 * @param {HTMLElement} menuIcon - The menu icon element.
 */
function closeMobileMenu(menuSection, menuIcon) {
    menuSection.classList.add("d-none");
    menuIcon.classList.remove("open-menu-mobile");
    menuIcon.classList.add("closed-menu-mobile");
  }


  /**
 * Opens the mobile menu, closing any previously open menu if necessary.
 * @param {HTMLElement} menuSection - The menu element.
 * @param {HTMLElement} menuIcon - The menu icon element.
 */
function openMobileMenu(menuSection, menuIcon) {
    if (currentlyOpenMenu && currentlyOpenMenu !== menuSection) {
      currentlyOpenMenu.classList.add("d-none");
      const icon = document.getElementById("noteMenuMobile");
      icon.classList.remove("open-menu-mobile");
      icon.classList.add("closed-menu-mobile");
    }
    menuSection.classList.remove("d-none");
    menuIcon.classList.remove("closed-menu-mobile");
    menuIcon.classList.add("open-menu-mobile");
    currentlyOpenMenu = menuSection;
  }

  /**
 * Displays a success message overlay.
 */
  function showSuccessMessage() {
    let overlay = document.getElementById("successContactsOverlay");
    overlay.classList.remove("d-none");
    setTimeout(() => {
      overlay.classList.add("d-none");
    }, 2250);
  }
  