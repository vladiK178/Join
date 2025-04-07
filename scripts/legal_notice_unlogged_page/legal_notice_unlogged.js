let currentUser;

async function initLegalNoticePage() {
    await getUsersData();
    currentSubTask = {};

    let currentUserId = localStorage.getItem('currentUserId');
    currentUser = users[currentUserId];
    renderDesktopTemplate();
    changeToChosenLegalNoticeSection();
    renderLegalNoticeContent();
}

function renderDesktopTemplate() {
    let content = document.getElementById('templateSection');
    content.innerHTML = "";
    content.innerHTML += getDesktopTemplateUnlogged();
}

function changeToChosenLegalNoticeSection() {
    let legalSection = document.getElementById('legalSection');
    let summarySection = document.getElementById('summary-section');
    // Hier wird auf das existierende Element mit der ID "log-in-img" zugegriffen
    let summaryImg = document.getElementById('log-in-img');

    summarySection.classList.remove('chosen-section');
    summaryImg.classList.remove('summary-img-chosen');
    summaryImg.classList.add('summary-img');

    legalSection.classList.add('chosen-section');
    legalSection.classList.remove('legal-section');
}

function renderLegalNoticeContent() {
    let content = document.getElementById('newContentSection');
    content.innerHTML += getLegalNoticeContentUnlogged();
}