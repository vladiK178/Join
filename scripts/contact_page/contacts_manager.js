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
      await getUsersData();
      currentUser = users[userId];
      if (!currentUser) {
        console.error("User not found in database");
        localStorage.clear();
        window.location.href = "index.html";
        return;
      }
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