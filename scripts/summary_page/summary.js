/**
     * Initializes the summary page by loading user data, 
     * setting the current user, and rendering the page.
     */
function initSummaryPage() {
    renderPage();
    showGreetingOnce(); // Decide whether to show greeting overlay or not
  }

  /**
   * Renders the main page by rendering a desktop template,
   * summary content, and greeting message.
   */
  function renderPage() {
    renderDesktopTemplate();
    renderSummaryContent();
    greetingMessage();
  }

    /**
   * Renders the desktop template into the element with the ID 'templateSection'.
   */
    function renderDesktopTemplate() {
        let content = document.getElementById('templateSection');
        content.innerHTML = getDesktopTemplate();
      }

  /**
   * Renders the summary content by inserting the HTML returned from getSummaryContent()
   * into the element with the ID 'templateSection' (appending it to the desktop template).
   */
  function renderSummaryContent() {
    let templateSection = document.getElementById('newContentSection');
    templateSection.innerHTML += getSummaryContent();
  }
    
  /**
   * Displays a time-based greeting with the user's name.
   */
  function greetingMessage() {
    let greetingSection = document.getElementById('greetingSpot');
    const currentHour = new Date().getHours();
    const greeting = getTimeBasedGreeting(currentHour);
    greetingSection.innerHTML = `
        <span class="greeting-time">${greeting},</span>
        <span class="greeting-name">GUEST USER</span>
    `;
  }

  /**
   * Returns a greeting string based on the current hour.
   */
  function getTimeBasedGreeting(hour) {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  /**
   * Redirects to 'board.html'.
   */
  function changeWindowToBoardSection() {
    window.location.href = "board.html";
  }

  /**
   * Decides whether to show the greeting overlay or not.
   * If 'wasGreeted' in localStorage is 'true', hide the overlay.
   * Otherwise, show it and set the flag.
   */
  function showGreetingOnce() {
    const wasGreeted = localStorage.getItem('wasGreeted');
    if (wasGreeted === 'true') {
      // User was already greeted => hide overlay
      hideGreetingOverlay();
    } else {
      // User not greeted yet => show overlay and set flag
      showGreetingOverlay();
      localStorage.setItem('wasGreeted', 'true');
    }
  }

  /**
   * Shows the greeting overlay (e.g., by setting display: flex or block).
   * Make sure the element with ID 'greetingMessageSection' exists in HTML.
   */
  function showGreetingOverlay() {
    let greetingOverlay = document.getElementById('greetingMessageSection');
    if (greetingOverlay) {
      greetingOverlay.style.display = 'flex'; // or 'block'
    }
  }

  /**
   * Hides the greeting overlay (e.g., by setting display: none).
   */
  function hideGreetingOverlay() {
    let greetingOverlay = document.getElementById('greetingMessageSection');
    if (greetingOverlay) {
      greetingOverlay.style.display = 'none';
    }
  }