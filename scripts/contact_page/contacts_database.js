const CONTACTS_BASE_URL = "https://join-7dba7-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Adds a new contact to Firebase under the given user
 * @param {string} userId - the ID of the current user
 * @param {Object} newContact - the contact data to add
 * @returns {Promise<string>} - the generated Firebase key for the new contact
 */
async function addContactToDatabase(userId, newContact) {
  const url = `${CONTACTS_BASE_URL}/${userId}/contacts.json`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newContact),
  });
  if (!response.ok) {
    throw new Error(`Failed to add contact (status ${response.status})`);
  }
  const data = await response.json();
  return data.name;
}

/**
 * Updates an existing contact in Firebase for the given user
 * @param {string} userId - the ID of the current user
 * @param {string} contactKey - the Firebase key of the contact to update
 * @param {Object} updatedContact - the new contact data
 */
async function updateContactInDatabase(userId, contactKey, updatedContact) {
  const url = `${CONTACTS_BASE_URL}/${userId}/contacts/${contactKey}.json`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedContact),
  });
  if (!response.ok) {
    throw new Error(`Failed to update contact (status ${response.status})`);
  }
}

/**
 * Deletes a contact from Firebase for the given user
 * @param {string} userId - the ID of the current user
 * @param {string} contactKey - the Firebase key of the contact to delete
 */
async function deleteContactFromDatabase(userId, contactKey) {
  const url = `${CONTACTS_BASE_URL}/${userId}/contacts/${contactKey}.json`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Failed to delete contact (status ${response.status})`);
  }
}