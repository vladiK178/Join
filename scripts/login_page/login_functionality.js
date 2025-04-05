const DATABASEURL =
  "https://join-7dba7-default-rtdb.europe-west1.firebasedatabase.app/";
let users = {};

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
        localStorage.setItem("contacts", JSON.stringify(user.contacts));
        localStorage.setItem("tasks", JSON.stringify(user.tasks));
        localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
        localStorage.setItem("userId", user.id);

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

    localStorage.setItem("contacts", JSON.stringify(guestData.contacts));
    localStorage.setItem("tasks", JSON.stringify(guestData.tasks));
    localStorage.setItem(
      "userName",
      `${guestData.firstName} ${guestData.lastName}`
    );

    window.location.href = "summary.html";
  } catch (error) {
    console.error("Fehler beim Guest Login:", error);
    alert("Ein Fehler ist aufgetreten.");
  }
}

function saveSessionData(user) {
  localStorage.setItem("contacts", JSON.stringify(user.contacts));
  localStorage.setItem("tasks", JSON.stringify(user.tasks));
  localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
}
