/**
 * Initializes login page with animation sequence
 * Shows splash screen then transitions to login form
 */
function initLoginAnimation() {
    // Hide content initially
    const contentElement = document.getElementById('content');
    contentElement.classList.add('content-hidden');
    
    // Create splash screen if needed
    if (!document.getElementById('splash-screen')) {
      createSplashScreen();
    }
    
    // Load login form in background
    renderLoginContent();
    
    // Start animation sequence
    setTimeout(() => {
      const splashScreen = document.getElementById('splash-screen');
      
      // Start fade out
      if (splashScreen) {
        splashScreen.style.opacity = '0';
        
        // Remove splash after transition completes
        setTimeout(() => {
          splashScreen.remove();
          contentElement.classList.remove('content-hidden');
          contentElement.classList.add('content-visible');
        }, 500);
      }
    }, 2000);
  }
  
  /**
   * Creates splash screen with logo
   */
  function createSplashScreen() {
    const splashScreen = document.createElement('div');
    splashScreen.id = 'splash-screen';
    splashScreen.className = 'splash-screen';
    
    const logo = document.createElement('img');
    logo.src = './assets/img/joinLogo.svg';
    logo.alt = 'Join Logo';
    logo.className = 'splash-logo';
    
    splashScreen.appendChild(logo);
    document.body.appendChild(splashScreen);
  }