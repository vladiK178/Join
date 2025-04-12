/**
 * Adds new contact to Firebase database
 * @param {string} userId - User identifier
 * @param {Object} newContact - Contact data
 * @returns {Promise<string>} Firebase generated key
 */
async function addContactToDatabase(userId, newContact) {
  // Create Firebase URL for contacts
  const dbUrl = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts.json`;

  try {
    // Send POST request with contact data
    const response = await fetch(dbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });

    // Check if request was successful
    if (!response.ok) {
      throw new Error("Failed to add contact to database.");
    }

    // Parse response and get generated key
    const result = await response.json();
    return result.name;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

/**
 * Updates existing contact data
 * @param {string} userId - User identifier
 * @param {string} contactKey - Contact identifier
 * @param {Object} updatedContact - New contact data
 */
async function updateContactInDatabase(userId, contactKey, updatedContact) {
  // Create URL for specific contact
  const contactUrl = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts/${contactKey}.json`;

  try {
    // Send PUT request to update contact
    const response = await fetch(contactUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact),
    });

    // Check response status
    if (!response.ok) {
      throw new Error("Failed to update contact in database.");
    }
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

/**
 * Removes contact from database
 * @param {string} userId - User identifier
 * @param {string} contactKey - Contact to delete
 */
async function deleteContactFromDatabase(userId, contactKey) {
  // Create URL for contact to delete
  const deleteUrl = `https://join-67494-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/contacts/${contactKey}.json`;

  try {
    // Send DELETE request
    const response = await fetch(deleteUrl, {
      method: "DELETE",
    });

    // Verify deletion was successful
    if (!response.ok) {
      throw new Error("Failed to delete contact from database.");
    }
  } catch (error) {
    console.error("Deletion error:", error);
    throw error;
  }
}
