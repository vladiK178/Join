let currentUser;

async function initLegalNoticePage() {
    await getUsersData();
    currentSubTask = {};

    let currentUserId = localStorage.getItem('currentUserId');
    currentUser = users.users[currentUserId];
    renderDesktopTemplate();
    changeToChosenLegalNoticeSection();
    renderLegalNoticeContent();
}


function renderDesktopTemplate() {
    let content = document.getElementById('templateSection');
    content.innerHTML = "";
    content.innerHTML += getDesktopTemplate(currentUser);
}

function changeToChosenLegalNoticeSection() {
    let legalSection = document.getElementById('legalSection');
    let summarySection = document.getElementById('summary-section');
    let summaryImg = document.getElementById('summary-img');

    summarySection.classList.remove('chosen-section');
    summaryImg.classList.remove('summary-img-chosen');
    summaryImg.classList.add('summary-img');

    legalSection.classList.add('chosen-section');
    legalSection.classList.remove('legal-section');
}

function renderLegalNoticeContent() {
    let content = document.getElementById('newContentSection');
    content.innerHTML += getLegalNoticeContent();
}