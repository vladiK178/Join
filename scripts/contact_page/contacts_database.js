/**
 * Sends a new contact to the Firebase database.
 * @param {string} userId - The current user's ID.
 * @param {Object} newContact - The contact data to store.
 * @returns {Promise<string>} The new contact's key in Firebase.
 */
async function addContactToDatabase(userId, newContact) {
    const url = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts.json`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });
    if (!response.ok) {
      throw new Error("Failed to add contact to database.");
    }
    const result = await response.json();
    return result.name; 
  }


  /**
 * Updates a contact in the database via PUT request.
 * @param {string} userId - The ID of the current user.
 * @param {string} contactKey - The key of the contact to update.
 * @param {Object} updatedContact - The updated contact data.
 */
async function updateContactInDatabase(userId, contactKey, updatedContact) {
    const url = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts/${contactKey}.json`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact),
    });
    if (!response.ok) {
      throw new Error("Failed to update contact in database.");
    }
  }


  /**
 * Deletes a contact from the Firebase database via DELETE request.
 * @param {string} userId - The ID of the current user.
 * @param {string} contactKey - The key of the contact to delete.
 */
async function deleteContactFromDatabase(userId, contactKey) {
    const url = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts/${contactKey}.json`;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to delete contact from database.");
    }
  }