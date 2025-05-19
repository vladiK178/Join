/**
 * Initializes login page with animation sequence
 * Shows splash screen then transitions to login form
 */
function initLoginAnimation() {
    const contentElement = document.getElementById('content');
    contentElement.classList.add('content-hidden');
    
    if (!document.getElementById('splash-screen')) {
      createSplashScreen();
    }
    
    renderLoginContent();

    setTimeout(() => {
      const splashScreen = document.getElementById('splash-screen');
      
      if (splashScreen) {
        splashScreen.style.opacity = '0';
        
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