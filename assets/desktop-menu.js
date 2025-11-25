const desktopMenuIcon = document.querySelector(".menu-icon-desktop");
const desktopMenu = document.querySelector(".mobile-menu");
const desktopMenuIconClose = document.querySelector(".menu-icon-close");

//Menu links
const desktopMenuLinks = document.querySelectorAll(".menu-link-container ul li a");

//Close icon
desktopMenuIconClose.addEventListener("click", () => {
  desktopMenuIconClose.classList.remove("active");
  document.body.classList.remove("no-scroll");
  desktopMenu.classList.remove("active");
  
  closeWithBackdrop(desktopMenu);
});

//Menu close on link click
desktopMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    desktopMenuIconClose.classList.remove("active");
    document.body.classList.remove("no-scroll");
    desktopMenu.classList.remove("active");
    
    closeWithBackdrop(desktopMenu);
  });
});

//Open menu
desktopMenuIcon.addEventListener("click", () => {
  desktopMenu.classList.add("active");
  document.body.classList.add("no-scroll");

  openWithBackdrop(desktopMenu);
});
