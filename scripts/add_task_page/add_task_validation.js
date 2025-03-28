/** Validates the title field. */
function validateTitle() {
    let t = document.getElementById('title');
    if (!t || t.value.trim().length === 0) {
      document.getElementById('alertMessageTitle').classList.remove('hide-alert-message');
      rotateMessage();
      return false;
    }
    document.getElementById('alertMessageTitle').classList.add('hide-alert-message');
    return true;
  }
  
  /** Validates at least one contact is assigned. */
  function validateAssignedContacts() {
    let hasOne = false;
    const allContacts = currentUser.contacts || {};
    for (let key in allContacts) {
      let box = document.getElementById(`assignedToCheckbox${key}`);
      if (box && box.checked) hasOne = true;
    }
    if (!hasOne) rotateMessage();
    return hasOne;
  }
  
  /** Validates the chosen end date. */
  function validateEndDate() {
    let d = document.getElementById('date');
    if (!d || !d.value) {
      document.getElementById('alertMessageDate').classList.remove('hide-alert-message');
      rotateMessage();
      return false;
    }
    document.getElementById('alertMessageDate').classList.add('hide-alert-message');
    return true;
  }
  
  /** Validates if category is "Technical Task" or "User Story". */
  function validateCategory() {
    let cat = document.getElementById('selectTaskCategorySpan');
    if (!cat || (!cat.innerText.includes("Technical Task") && !cat.innerText.includes("User Story"))) {
      rotateMessage();
      return false;
    }
    return true;
  }


  /** Gathers all checked contacts into an object. */
function collectAssignedContacts() {
  const c = currentUser.contacts || {};
  let chosen = {};
  for (let key in c) {
    let box = document.getElementById(`assignedToCheckbox${key}`);
    if (box && box.checked) {
      chosen[`contact_${key}`] = {
        firstName: c[key].firstNameContact,
        lastName: c[key].lastNameContact
      };
    }
  }
  return chosen;
}

/** Retrieves the selected category text. */
function getSelectedCategory() {
  let catSpan = document.getElementById('selectTaskCategorySpan');
  return catSpan.innerText.includes("Technical Task") ? "Technical Task" : "User Story";
}

/** Determines the current priority selected. */
function getSelectedPriority() {
  if (document.getElementById('prioUrgent').classList.contains('prio-urgent-chosen')) return "Urgent";
  if (document.getElementById('prioMedium').classList.contains('prio-medium-chosen')) return "Medium";
  return "Low";
}