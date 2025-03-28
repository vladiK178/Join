let currentUser;

async function initHelpPage() {
    await getUsersData();
    currentSubTask = {};

    let currentUserId = localStorage.getItem('currentUserId');
    currentUser = users.users[currentUserId];
    renderDesktopTemplate();
    changeToNoChosenSection();
    renderHelpContent();
}

function renderDesktopTemplate() {
    let content = document.getElementById('templateSection');
    content.innerHTML = "";
    content.innerHTML += getDesktopTemplate(currentUser);
}

function changeToNoChosenSection() {
    let summarySection = document.getElementById('summary-section');
    let summaryImg = document.getElementById('summary-img');

    summarySection.classList.remove('chosen-section');
    summaryImg.classList.remove('summary-img-chosen');
    summaryImg.classList.add('summary-img');
}

function goBack() {
    window.history.back();
}

function renderHelpContent() {
    let content = document.getElementById('newContentSection');
    content.innerHTML += getHelpContent();
}

