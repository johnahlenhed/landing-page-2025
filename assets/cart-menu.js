const cartMenuIcon = document.querySelector('.cart-icon');
const cartMenu = document.querySelector('.cart-menu');
const cartMenuClose = document.querySelector('.cart-close-icon');

cartMenuClose.addEventListener('click', () => {
    cartMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
});

cartMenuIcon.addEventListener('click', () => {
    cartMenu.classList.add('active');
    document.body.classList.add('no-scroll');
});