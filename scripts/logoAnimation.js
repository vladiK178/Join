document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.querySelector(".overlay").style.display = "none"; // Entfernt das Overlay nach der Animation
  }, 2000); // Wartezeit entsprechend der CSS-Animation
});
