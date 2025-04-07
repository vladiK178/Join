let currentUser;

async function initPrivacyNoticePage() {
    await getUsersData();
    currentSubTask = {};

    let currentUserId = localStorage.getItem('currentUserId');
    currentUser = users[currentUserId];
    renderDesktopTemplate();
    changeToChosenPrivacyPoliceSection();
    renderPrivacyPolicyContent();
}


function renderDesktopTemplate() {
    let content = document.getElementById('templateSection');
    content.innerHTML = "";
    content.innerHTML += getDesktopTemplate(currentUser);
}

function changeToChosenPrivacyPoliceSection() {
    let legalSection = document.getElementById('privacySection');
    let summarySection = document.getElementById('summary-section');
    let summaryImg = document.getElementById('summary-img');

    summarySection.classList.remove('chosen-section');
    summaryImg.classList.remove('summary-img-chosen');
    summaryImg.classList.add('summary-img');

    legalSection.classList.add('chosen-section');
    legalSection.classList.remove('privacy-section');
}

function renderPrivacyPolicyContent() {
    let content = document.getElementById('newContentSection');
    content.innerHTML += getPrivacyPolicyContent();
}