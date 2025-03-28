/** Capitalizes the first letter of a given string. */
function capitalizeFirstLetter(str) {
    if (!str || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  

  /** Returns a random color from the predefined palette. */
function getRandomColorFromPalette() {
    const colorPalette = [
      "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF",
      "#33FFF5", "#FF8C33", "#FFD433", "#A8FF33", "#8C33FF",
      "#FFB6C1", "#FF69B4", "#FF1493", "#C71585", "#DB7093",
      "#F0E68C", "#EEE8AA", "#BDB76B", "#FFD700", "#FFA07A",
      "#20B2AA", "#87CEEB", "#4682B4", "#5F9EA0", "#00CED1",
      "#40E0D0", "#48D1CC", "#AFEEEE", "#7FFFD4", "#B0E0E6",
      "#9370DB", "#8A2BE2", "#4B0082", "#6A5ACD", "#483D8B",
      "#1E90FF", "#6495ED", "#ADD8E6", "#87CEFA", "#B0C4DE",
      "#E9967A", "#FA8072", "#FFA07A", "#FF7F50", "#FF6347",
      "#FF4500", "#DC143C", "#B22222", "#CD5C5C", "#F08080",
      "#98FB98", "#00FA9A", "#32CD32", "#3CB371", "#2E8B57",
      "#90EE90", "#8FBC8F", "#66CDAA", "#7FFF00", "#7CFC00",
      "#FFDAB9", "#FFE4B5", "#F5DEB3", "#FFDEAD", "#F0E68C",
      "#EEE8AA", "#BDB76B", "#FFEFD5", "#FFDAB9", "#FAFAD2"
    ];
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  }


  /** Animates an error message for visual feedback. */
function rotateMessage() {
    let msg = document.getElementById('fieldRequiredSection');
    msg.classList.add('mar-right');
    setTimeout(() => { msg.classList.replace('mar-right', 'mar-left'); }, 50);
    setTimeout(() => { msg.classList.replace('mar-left', 'mar-right'); }, 100);
    setTimeout(() => { msg.classList.replace('mar-right', 'mar-left'); }, 150);
    setTimeout(() => { msg.classList.replace('mar-left', 'mar-right'); }, 200);
    setTimeout(() => { msg.classList.replace('mar-right', 'mar-left'); }, 250);
    setTimeout(() => { msg.classList.replace('mar-left', 'mar-right'); }, 300);
    setTimeout(() => { msg.classList.replace('mar-right', 'mar-left'); }, 350);
    setTimeout(() => { msg.classList.replace('mar-left', 'mar-right'); }, 400);
    setTimeout(() => { msg.classList.remove('mar-right'); }, 450);
  }