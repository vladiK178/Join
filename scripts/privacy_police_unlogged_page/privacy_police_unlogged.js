let currentUser;

async function initPrivacyNoticePage() {
    await getUsersData();
    currentSubTask = {};

    let currentUserId = localStorage.getItem('currentUserId');
    currentUser = users.users[currentUserId];
    renderDesktopTemplate();
    changeToChosenPrivacyPoliceSection();
    renderPrivacyPolicyContentUnlogged();
}

function renderDesktopTemplate() {
    let content = document.getElementById('templateSection');
    content.innerHTML = "";
    content.innerHTML += getDesktopTemplateUnlogged();
}

function changeToChosenPrivacyPoliceSection() {
    let legalSection = document.getElementById('privacySection');
    let summarySection = document.getElementById('summary-section');
    // Hier wird auf das existierende Element mit der ID "log-in-img" zugegriffen
    let summaryImg = document.getElementById('log-in-img');

    summarySection.classList.remove('chosen-section');
    summaryImg.classList.remove('summary-img-chosen');
    summaryImg.classList.add('summary-img');

    legalSection.classList.add('chosen-section');
    legalSection.classList.remove('privacy-section');
}

function renderPrivacyPolicyContentUnlogged() {
    let content = document.getElementById('newContentSection');
    content.innerHTML += getPrivacyPolicyContentUnlogged();
}