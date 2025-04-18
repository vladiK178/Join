/**
 * Initializes the login page with an animation sequence
 * Shows splash screen first, then fades to login form
 */
function initLoginAnimation() {
    // First hide the content
    const contentElement = document.getElementById('content');
    contentElement.classList.add('content-hidden');
    
    // Create and append splash screen if it doesn't exist
    if (!document.getElementById('splash-screen')) {
      createSplashScreen();
    }
    
    // Render login content behind splash screen
    renderLoginContent();
    
    // Start animation sequence
    setTimeout(() => {
      const splashScreen = document.getElementById('splash-screen');
      
      // Fade out splash screen
      if (splashScreen) {
        splashScreen.style.opacity = '0';
        
        // After fade out completes, remove splash and show content
        setTimeout(() => {
          splashScreen.remove();
          contentElement.classList.remove('content-hidden');
          contentElement.classList.add('content-visible');
        }, 500); // Duration of opacity transition
      }
    }, 2000); // Delay before starting fade (logo animation duration + delay)
  }
  
  /**
   * Creates and appends the splash screen element with logo
   */
  function createSplashScreen() {
    const splashScreen = document.createElement('div');
    splashScreen.id = 'splash-screen';
    splashScreen.className = 'splash-screen';
    
    const logo = document.createElement('img');
    logo.src = './assets/img/JoinLogo.svg';
    logo.alt = 'Join Logo';
    logo.className = 'splash-logo';
    
    splashScreen.appendChild(logo);
    document.body.appendChild(splashScreen);
  }