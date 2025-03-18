document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay");
  const animatedLogo = document.querySelector(".logo");
  const content = document.querySelector(".animation_content");

  animatedLogo.addEventListener("animationend", () => {
    overlay.style.display = "none"; // Verstecke das Overlay nach der Animation
    content.style.opacity = "1"; // Zeige den Content
  });
});
