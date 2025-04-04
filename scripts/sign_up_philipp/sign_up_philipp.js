const DATABASEURL =
  "https://join-7dba7-default-rtdb.europe-west1.firebasedatabase.app/";

let isPolicyChecked = false;

function validateForm(password, confirmPassword) {
  return correctForm(password, confirmPassword);
}

function generateUserKey(email) {
  return `user_${encodeEmail(email)}`;
}

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

async function createUserData(name, email, password) {
  const nameParts = splitFullName(name);
  if (!isNameCorrect(nameParts)) return null;

  const firstName = formatName(nameParts.firstName);
  const lastName = formatName(nameParts.lastName);
  const userKey = generateUserKey(email);
  const userData = buildUserData(email, firstName, lastName, password, userKey);

  return { userKey, userData };
}

async function sendToFirebase(userKey, userData) {
  try {
    const checkRes = await fetch(`${DATABASEURL}/${userKey}.json`);
    const existingUser = await checkRes.json();

    if (existingUser) {
      return null;
    }

    const response = await fetch(`${DATABASEURL}/${userKey}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("Neuer Benutzer hinzugefügt");
    return response.json();
  } catch (error) {
    console.error("Fehler:", error);
  }
}

async function registerUser() {
  const name = document.getElementById("userName");
  const email = document.getElementById("userEmail");
  const password = document.getElementById("userPassword");
  const confirmPassword = document.getElementById("userPasswordConfirmed");

  await processRegistration(name, email, password, confirmPassword);
}

async function processRegistration(name, email, password, confirmPassword) {
  if (!handleInvalidEmail(email.value)) return;

  if (!validateForm(password.value, confirmPassword.value)) return;

  if (await handleExistingEmail(email.value)) return;

  const result = await createUserData(name.value, email.value, password.value);
  if (!result) return;

  await finalizeRegistration(result, name, email, password, confirmPassword);
}

async function checkIfEmailExists(email) {
  try {
    const response = await fetch(`${DATABASEURL}.json`);
    const data = await response.json();

    for (const userKey in data) {
      if (data[userKey].email === email) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Fehler beim Überprüfen der E-Mail:", error);
    return false;
  }
}

function handleInvalidEmail(email) {
  if (!isEmailValid(email)) {
    document.getElementById("alertMessageEmail").className = "alert-message";
    return false;
  }
  return true;
}

async function handleExistingEmail(email) {
  const emailExists = await checkIfEmailExists(email);
  if (emailExists) {
    document.getElementById("alertMessageEmailExists").className =
      "alert-message";
    return true;
  }
  return false;
}

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

function checkUncheckPolicy() {
  let checkId = document.getElementById("logInCheckbox").src;

  if (checkId.endsWith("checkboxChecked.svg")) {
    isPolicyChecked = true;
  } else {
    isPolicyChecked = false;
  }
}

function correctForm(password, confirmedPassword) {
  let confirmPassword = isConfirmedPasswordIdentical(
    password,
    confirmedPassword
  );
  let checkedBox = isCheckboxChecked();

  if (confirmPassword == false || checkedBox == false) {
    return false;
  }

  return true;
}

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

function isCheckboxChecked() {
  if (isPolicyChecked == false) {
    document.getElementById("alertMessagePolicy").className = "alert-message";
    return false;
  }
}

function resetForm(name, email, password, confirmPassword) {
  name.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
}

function splitFullName(fullName) {
  const parts = fullName.trim().split(" ");
  if (parts.length !== 2) {
    return null;
  }

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

function isNameCorrect(nameParts) {
  if (!nameParts) {
    document.getElementById("alertMessageName").className = "alert-message";
    return false;
  }

  return true;
}

function formatName(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

async function isEmailTaken(email) {
  try {
    const response = await fetch(`${DATABASEURL}.json`);
    const data = await response.json();

    for (let key in data) {
      if (
        data[key].email &&
        data[key].email.toLowerCase() === email.toLowerCase()
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Fehler beim Prüfen der E-Mail:", error);
    return false;
  }
}

function encodeEmail(email) {
  return email.replace(/[@.]/g, "_").toLowerCase();
}

function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
