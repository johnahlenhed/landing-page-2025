const menuIcon = document.querySelector('.menu-icon');
const mobileMenu = document.querySelector('.mobile-menu');
const menuIconClose = document.querySelector('.menu-icon-close');

menuIconClose.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

menuIcon.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});
