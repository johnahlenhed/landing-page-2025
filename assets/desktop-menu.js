const desktopMenuIcon = document.querySelector(".menu-icon-desktop");
const desktopMenu = document.querySelector(".mobile-menu");
const desktopMenuIconClose = document.querySelector(".menu-icon-close");

desktopMenuIconClose.addEventListener("click", () => {
  desktopMenuIconClose.classList.remove("active");
  document.body.classList.remove("no-scroll");
  desktopMenu.classList.remove("active");

  closeWithBackdrop(desktopMenu);
});

desktopMenuIcon.addEventListener("click", () => {
  desktopMenu.classList.add("active");
  document.body.classList.add("no-scroll");

  openWithBackdrop(desktopMenu);
});
