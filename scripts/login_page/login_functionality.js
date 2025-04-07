const DATABASEURL =
  "https://join-7dba7-default-rtdb.europe-west1.firebasedatabase.app/";

async function loginUser(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  try {
    const response = await fetch(`${DATABASEURL}.json`);
    const usersData = await response.json();

    let userFound = false;
    for (let userKey in usersData) {
      const user = usersData[userKey];

      if (
        user.email.toLowerCase() === emailInput.toLowerCase() &&
        String(user.password) === passwordInput
      ) {
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("LastName", user.lastName);
        localStorage.setItem("currentUserId", user.id);

        window.location.href = "summary.html";
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      document.getElementById("alertMessageEmail").className = "alert-message";
    }
  } catch (error) {
    console.error("Login-Fehler:", error);
    alert("Ein Fehler ist beim Login aufgetreten.");
  }
}

async function guestLogin() {
  try {
    const response = await fetch(`${DATABASEURL}/guest_user.json`);
    const guestData = await response.json();

    if (!guestData) {
      alert("Guest user konnte nicht geladen werden.");
      return;
    }

    localStorage.setItem("firstName", guestData.firstName);
    localStorage.setItem("LastName", guestData.lastName);
    localStorage.setItem("currentUserId", guestData.id);

    window.location.href = "summary.html";
  } catch (error) {
    console.error("Fehler beim Guest Login:", error);
    alert("Ein Fehler ist aufgetreten.");
  }
}
