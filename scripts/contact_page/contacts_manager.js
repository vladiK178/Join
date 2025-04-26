/**
 * Initializes the contact page with user data.
 */
async function initContactPage() {
    const userId = getUserIdFromStorage();
    if (!userId) return redirectToLogin();

    try {
      await loadUserData(userId);
      setupContactPage();
    } catch (error) {
      handleInitError(error);
    }
}

/**
 * Retrieves the current user ID from localStorage.
 * @returns {string|null} User ID or null if not found
 */
function getUserIdFromStorage() {
    return localStorage.getItem("currentUserId");
}

/**
 * Redirects the user to the login page.
 */
function redirectToLogin() {
    console.error("No user ID found - login required");
    window.location.href = "index.html";
}

/**
 * Loads user data from Firebase and sets current user.
 * @param {string} userId - User ID
 */
async function loadUserData(userId) {
    await getUsersData();
    currentUser = users[userId];
    if (!currentUser) {
      console.error("User not found in database");
      localStorage.clear();
      window.location.href = "index.html";
      throw new Error("User not found");
    }
    localStorage.setItem("currentUserId", userId);
}

/**
 * Sets up the contact page UI.
 */
function setupContactPage() {
    renderDesktopTemplate();
    renderContactsContent();
    changeToChosenContactsSection();
    renderSpacerAndContactSection();
}

/**
 * Handles initialization errors.
 * @param {Error} error - Caught error
 */
function handleInitError(error) {
    console.error("Error loading user data:", error);
    window.location.href = "index.html";
}


  /**
 * Handles contact selection by its key
 * @param {string} key - Unique contact key
 */
function chooseContact(key) {
    currentContactKey = key;
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
 * Shows feedback message to user
 * @param {string} message - Text to display
 * @param {boolean} isError - Whether message is an error
 */
function showToastMessage(message, isError = false) {
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
    toast.style.backgroundColor = isError ? "#FF3D00" : "#2A3647";
    toast.style.color = "white";
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
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
 * Renders the main contacts content area
 */
function renderContactsContent() {
    const content = document.getElementById('newContentSection');
    content.innerHTML = getContactsContentHtml();
  }