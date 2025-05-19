/** The base URL of the Firebase Realtime Database. */
const DATABASEURL =
  "https://join-7dba7-default-rtdb.europe-west1.firebasedatabase.app/";

/** Flag to track whether the policy checkbox is selected. */
let isPolicyChecked = false;

/**
 * Validates the registration form input.
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - Confirmation of the user's password.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateForm(password, confirmPassword) {
  return correctForm(password, confirmPassword);
}

/**
 * Generates a unique user key from the user's email.
 * @param {string} email - The user's email address.
 * @returns {string} The encoded user key.
 */
function generateUserKey(email) {
  return `user_${encodeEmail(email)}`;
}

/**
 * Constructs a user data object.
 * @param {string} email
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} password
 * @param {string} userKey
 * @returns {object} The structured user data.
 */
function buildUserData(email, firstName, lastName, password, userKey) {
  return {
    email,
    firstName,
    lastName,
    id: userKey,
    contacts: default_contacts,
    tasks: default_tasks,
    password,
  };
}

/**
 * Splits name and creates structured user data.
 * @param {string} name - Full name of the user.
 * @param {string} email - Email address.
 * @param {string} password - User password.
 * @returns {object|null} An object containing userKey and userData or null.
 */
async function createUserData(name, email, password) {
  const nameParts = splitFullName(name);
  if (!isNameCorrect(nameParts)) return null;

  const firstName = formatName(nameParts.firstName);
  const lastName = formatName(nameParts.lastName);
  const emailLowerCase = email.toLowerCase();
  const userKey = generateUserKey(emailLowerCase);

  const userData = buildUserData(
    emailLowerCase,
    firstName,
    lastName,
    password,
    userKey
  );
  return { userKey, userData };
}

/**
 * Sends user data to Firebase after checking for duplicates.
 * @param {string} userKey
 * @param {object} userData
 * @returns {Promise<object|null>} Response or null if user already exists.
 */
async function sendToFirebase(userKey, userData) {
  try {
    const normalizedKey = userKey.toLowerCase();
    userData.email = userData.email.toLowerCase();

    const existingUser = await checkIfUserExists(normalizedKey);
    if (existingUser) return null;

    const response = await putUserData(normalizedKey, userData);
    console.log("User successfully registered");
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Checks if a user already exists in Firebase.
 * @param {string} normalizedKey
 * @returns {Promise<object|null>} The existing user or null.
 */
async function checkIfUserExists(normalizedKey) {
  const checkRes = await fetch(`${DATABASEURL}/${normalizedKey}.json`);
  return await checkRes.json();
}

/**
 * Stores user data in Firebase using PUT.
 * @param {string} normalizedKey
 * @param {object} userData
 * @returns {Promise<object>} Firebase response.
 */
async function putUserData(normalizedKey, userData) {
  const response = await fetch(`${DATABASEURL}/${normalizedKey}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return await response.json();
}

/** Initiates the user registration process. */
async function registerUser() {
  const name = document.getElementById("userName");
  const email = document.getElementById("userEmail");
  const password = document.getElementById("userPassword");
  const confirmPassword = document.getElementById("userPasswordConfirmed");

  await processRegistration(name, email, password, confirmPassword);
}

/**
 * Handles the full registration logic.
 */
async function processRegistration(name, email, password, confirmPassword) {
  if (!handleInvalidEmail(email.value.toLowerCase())) return;
  if (!validateForm(password.value, confirmPassword.value)) return;
  if (await handleExistingEmail(email.value)) return;

  const result = await createUserData(
    name.value,
    email.value.toLowerCase(),
    password.value
  );
  if (!result) return;

  await finalizeRegistration(result, name, email, password, confirmPassword);
}

/**
 * Checks if the email is already registered in Firebase.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function checkIfEmailExists(email) {
  try {
    const normalizedEmail = email.toLowerCase();
    const response = await fetch(`${DATABASEURL}.json`);
    const data = await response.json();

    for (const userKey in data) {
      if (data[userKey].email.toLowerCase() === normalizedEmail) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}

/**
 * Displays alert if email is invalid.
 * @param {string} email
 * @returns {boolean}
 */
function handleInvalidEmail(email) {
  if (!isEmailValid(email)) {
    document.getElementById("alertMessageEmail").className = "alert-message";
    return false;
  }
  return true;
}

/**
 * Displays alert if email is already taken.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function handleExistingEmail(email) {
  const emailExists = await checkIfEmailExists(email);
  if (emailExists) {
    document.getElementById("alertMessageEmailExists").className =
      "alert-message";
    return true;
  }
  return false;
}

/**
 * Finalizes the registration by saving the user and resetting the form.
 */
async function finalizeRegistration(
  { userKey, userData },
  name,
  email,
  password,
  confirmPassword
) {
  await sendToFirebase(userKey, userData);
  resetForm(name, email, password, confirmPassword);
  document.getElementById("logInCheckbox").src =
    "./assets/img/checkboxEmpty.svg";
  isPolicyChecked = false;
  showSuccessMessage();
}

/** Checks or unchecks the policy checkbox and updates state. */
function checkUncheckPolicy() {
  let checkId = document.getElementById("logInCheckbox").src;
  isPolicyChecked = checkId.endsWith("checkboxChecked.svg");
}

/**
 * Validates both the password and the checkbox status.
 * @returns {boolean}
 */
function correctForm(password, confirmedPassword) {
  return (
    isConfirmedPasswordIdentical(password, confirmedPassword) &&
    isCheckboxChecked()
  );
}

/**
 * Compares password and confirmation.
 */
function isConfirmedPasswordIdentical(password, confirmPassword) {
  if (password.length < 6) {
    document.getElementById("alertMessageLength").className = "alert-message";
    return false;
  }
  if (password !== confirmPassword) {
    document.getElementById("alertMessagePassword").className = "alert-message";
    return false;
  }
  return true;
}

/**
 * Checks if the user agreed to the policy.
 * @returns {boolean}
 */
function isCheckboxChecked() {
  if (!isPolicyChecked) {
    document.getElementById("alertMessagePolicy").className = "alert-message";
    return false;
  }
  return true;
}

/** Resets all form fields. */
function resetForm(name, email, password, confirmPassword) {
  name.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
}

/**
 * Splits a full name string into first and last name.
 * @param {string} fullName
 * @returns {object|null}
 */
function splitFullName(fullName) {
  const parts = fullName.trim().split(" ");
  if (parts.length !== 2) return null;
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/**
 * Validates name parts.
 * @param {object|null} nameParts
 * @returns {boolean}
 */
function isNameCorrect(nameParts) {
  if (!nameParts) {
    document.getElementById("alertMessageName").className = "alert-message";
    return false;
  }
  return true;
}

/**
 * Formats name with first letter capitalized.
 * @param {string} name
 * @returns {string}
 */
function formatName(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Checks if email is already in use.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
async function isEmailTaken(email) {
  try {
    const users = await fetchAllUsers();
    return emailExists(users, email);
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}

/** Fetches all users from the database. */
async function fetchAllUsers() {
  const response = await fetch(`${DATABASEURL}.json`);
  return await response.json();
}

/**
 * Checks if a given email exists in a list of users.
 * @param {object} users
 * @param {string} email
 * @returns {boolean}
 */
function emailExists(users, email) {
  const lowerEmail = email.toLowerCase();
  for (let key in users) {
    if (users[key].email?.toLowerCase() === lowerEmail) {
      return true;
    }
  }
  return false;
}

/**
 * Encodes an email address for use as a Firebase key.
 * @param {string} email
 * @returns {string}
 */
function encodeEmail(email) {
  return email.replace(/[@.]/g, "_").toLowerCase();
}

/**
 * Validates the format of an email address.
 * @param {string} email
 * @returns {boolean}
 */
function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
