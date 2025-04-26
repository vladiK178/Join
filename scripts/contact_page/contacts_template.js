/**
 * Creates HTML for the "Add Contact" overlay
 * @returns {string} HTML content for add contact overlay
 */
function getAddContactSectionHtml() {
  return `
    <div id="addContactCard" class="add-contact-container">
      <div class="left-section">
        <img src="./assets/img/joinLogoAddContact.svg" alt="Logo">
        <div class="add-contact-headline-and-span"></div>
        <h1>Add contact</h1>
        <p>Tasks are better with a team!</p>
        <div class="add-contact-blue-seperator"></div>
      </div>
      <div class="right-section">
        <div onclick="closeAddContactSection()">
          <img class="close-button" src="./assets/img/cancelImg.svg" alt="">
        </div>
        <div onclick="closeAddContactSection()">
          <img class="close-button-mobile" src="./assets/img/close-gray-mobile.svg" alt="">
        </div>
        <form>
          <div class="profile-placeholder-section">
            <div class="profile-placeholder">
              <img src="./assets/img/addContactPersonaIcon.svg" alt="Profile Placeholder">
            </div>
          </div>
          <div class="add-contact-input-section">
            <div>
              <div class="input-group">
                <input id="contactName" type="text" placeholder="Name" onblur="validateNameParts(this.value, 'alertMessageTitle')"
                oninput="checkAllInputsValid()">
                <img class="input-icon" src="./assets/img/person.svg" alt="Name Icon">
              </div>
              <span id="alertMessageTitle" class="alert-message hide-alert-message">This field is required</span>
            </div>
            <div>
              <div class="input-group">
                <input id="contactEmail" type="email" placeholder="Email" onblur="validateEmail(this.value, /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, 'alertMessageEmail')"
                oninput="checkAllInputsValid()">
                <img src="./assets/img/mail.svg" alt="Email Icon">
              </div>
              <span id="alertMessageEmail" class="alert-message hide-alert-message">This field is required</span>
            </div>
            <div>
              <div class="input-group">
                <input id="contactNumber" type="tel" placeholder="Phone" onblur="validatePhone(this.value, /^\\+?[0-9\\s]{10,15}$/, 'alertMessageNumber')"
                oninput="checkAllInputsValid()">
                <img src="./assets/img/phone.svg" alt="Phone Icon">
              </div>
              <span id="alertMessageNumber" class="alert-message hide-alert-message">This field is required</span>
            </div>
            <div class="buttons">
              <div onclick="closeAddContactSection()" class="cancel-button">
                <span>Cancel</span>
                <img class="cancel-icon" src="./assets/img/cancelImg.svg" alt="">
              </div>
              <div onclick="saveNewContact()" class="create-button" disabled>
                <span>Create contact</span>
                <img src="./assets/img/check.svg" alt="">
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- Success Message -->
    <div id="successContactsOverlay" class="success-sign-up-overlay d-none">
        <span class="success-icon">Contact succesfully created</span>
    </div>
    `;
}

/**
* Creates HTML for the contacts page main layout
* @returns {string} HTML content for contacts page
*/
function getContactsContentHtml() {
  return `
    <div class="contact-section">
      <div class="add-new-contact-button-section">
        <div onclick="openAddContactSection()" class="add-new-contact-button">
          <span>Add new contact</span>
          <img src="./assets/img/person_add.svg" alt="Add Contact">
        </div>
      </div>
      <div class="add-contact-and-contact-list-section">
        <div class="spacer-and-contact-section" id="spacerAndContactsSection"></div>
      </div>
      <div class="add-contact-mobile">
        <img class="person-add-img" 
             onclick="openAddContactSection()"
             src="./assets/img/person_add.svg" 
             alt="Add Contact">
      </div>
    </div>
    <div class="show-contact">
      <div class="complete-right-section">
        <div class="headline-section">
          <h1>Contacts</h1>
          <div class="headline-seperator"></div>
          <span class="headline-span">Better with a team</span>
        </div>
        <div id="contactDetails" class="contact-details"></div>
      </div>
      <div class="back-arrow-section" onclick="goBackToContacts()">
        <img class="back-arrow" src="./assets/img/back_arrow.svg" alt="Back">
      </div>
    </div>
    <div id="rotateWarning" class="rotate-overlay hide">
    <div class="rotate-message">
      <h2>Bitte drehe dein Gerät</h2>
      <p>Um unsere Seite optimal zu nutzen, verwende bitte das Hochformat.</p>
    </div>
    </div>
`;
}

/**
* Generates HTML for displaying contact details
* @param {string} contactKey - Unique identifier for contact
* @param {Object} contact - Contact data object
* @param {string} color - Background color for contact circle
* @returns {string} HTML for contact details view
*/
function getContactDetailsHtml(contactKey, contact, color) {
  const firstInitial = contact.firstNameContact.charAt(0);
  const lastInitial = contact.lastNameContact.charAt(0);
  
  return `
  <div id="contactDetailsContent" class="contact-details-content">
    <div class="big-name-circle-and-name">
      <div class="big-name-circle" style="background-color: ${color};">
        ${firstInitial}${lastInitial}
      </div>
      <div class="name-and-edit-and-delete-section">
        <span class="big-name-span">
          ${contact.firstNameContact} ${contact.lastNameContact}
        </span>
        <div class="edit-and-delete-section">
          <div class="contact-details-edit" onclick="openEditContactSection('${contactKey}')">
            <img src="./assets/img/pencilBlue.svg" alt="">
            <span>Edit</span>
          </div>
          <div class="contact-details-delete" onclick="deleteContact('${contactKey}')">
            <img src="./assets/img/trashImg.svg" alt="">
            <span>Delete</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-information-section">
      <span>Contact Information</span>
    </div>
    <div class="email-and-number-section">
      <div class="email-section">
        <span class="email-name-span">Email</span>
        <span class="email-span">${contact.email || "No email"}</span>
      </div>
      <div class="number-section">
        <span class="phone-name-span">Phone</span>
        <span>${contact.phone || "No phone number"}</span>
      </div>
    </div>
    </div>
    <div class="change-column-menu-mobile">
      <img id="noteMenuMobile" 
           onclick="toggleMenuMobile(event)" 
           class="closed-menu-mobile" 
           src="./assets/img/more_vert.svg" 
           alt="More">
    </div>
    <div id="menuSectionMobile" class="menu-section-mobile d-none">
      <div class="menu-mobile">
        <div class="menu-mobile-container">
          <img src="./assets/img/edit-icon.svg" alt="">
          <a href="javascript:void(0);" 
             class="menu-option" 
             onclick="openEditContactSection('${contactKey}')">
             Edit
          </a>
        </div>
        <div class="seperator-edid-delete"></div>
        <div class="menu-mobile-container">
          <img src="./assets/img/trashImg.svg" alt="">
          <a href="javascript:void(0);" 
             class="menu-option" 
             onclick="deleteContact('${contactKey}')">
             Delete
          </a>
        </div>
      </div>
    </div>`;
}

/**
* Creates HTML for edit contact overlay
* @param {Object} contact - Contact data to edit
* @param {string} key - Contact identifier
* @param {string} color - Background color for contact circle
* @returns {string} HTML for edit contact form
*/
function getEditContactSectionHtml(contact, key, color) {
  const initials = `${contact.firstNameContact.charAt(0)}${contact.lastNameContact.charAt(0)}`;
  
  return `
    <div class="edit-contact-container">
      <div class="left-section">
        <img src="./assets/img/joinLogoAddContact.svg" alt="Logo">
        <div class="add-contact-headline-and-span"></div>
        <h1>Edit contact</h1>
        <div class="add-contact-blue-seperator"></div>
      </div>
      <div class="right-section">
        <div class="close-button" onclick="closeEditContactSection()">
          <img src="./assets/img/cancelImg.svg" alt="">
        </div>
        <form>
          <div class="profile-placeholder-section">
            <div class="big-name-circle" style="background-color: ${color};">
              ${initials}
            </div>
          </div>
          <div class="add-contact-input-section">
            <div>
              <div class="input-group">
                <input id="editContactName" type="text" placeholder="Name" 
                  value="${contact.firstNameContact} ${contact.lastNameContact}">
                <img class="input-icon" src="./assets/img/person.svg" alt="Name Icon">
              </div>
              <span id="editAlertMessageTitle" class="alert-message hide-alert-message">
                This field is required
              </span>
            </div>
            <div>
              <div class="input-group">
                <input id="editContactEmail" type="email" placeholder="Email" value="${contact.email}">
                <img src="./assets/img/mail.svg" alt="Email Icon">
              </div>
              <span id="editAlertMessageEmail" class="alert-message hide-alert-message">
                This field is required
              </span>
            </div>
            <div>
              <div class="input-group">
                <input id="editContactNumber" type="tel" placeholder="Phone" value="${contact.phone}">
                <img src="./assets/img/phone.svg" alt="Phone Icon">
              </div>
              <span id="editAlertMessageNumber" class="alert-message hide-alert-message">
                This field is required
              </span>
            </div>
            <div class="buttons">
              <div onclick="closeEditContactSection()" class="cancel-button">
                <span>Cancel</span>
                <img class="cancel-icon" src="./assets/img/cancelImg.svg" alt="">
              </div>
              <div onclick="deleteContact('${key}')" class="delete-button d-none">
                <span>Delete</span>
              </div>
              <div onclick="saveEditedContact('${key}')" class="save-button">
                <span>Save</span>
                <img src="./assets/img/check.svg" alt="">
              </div>
            </div>
          </div>
        </form>
      </div>
      <div onclick="closeEditContactSection()">
        <img class="close-button-mobile-edit" src="./assets/img/close-gray-mobile.svg" alt="">
      </div>
    </div>`;
}