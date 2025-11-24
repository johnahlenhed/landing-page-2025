const cartMenuIcon = document.querySelector('.cart-icon');
const cartMenu = document.querySelector('.cart-menu');
const cartMenuClose = document.querySelector('.cart-close-icon');
const cartIconDesktop = document.querySelector('.cart-icon-desktop');


cartMenuClose.addEventListener('click', () => {
    cartMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');

    closeWithBackdrop(cartMenu);
});

cartMenuIcon.addEventListener('click', () => {
    cartMenu.classList.add('active');
    document.body.classList.add('no-scroll');

    openWithBackdrop(cartMenu);
});

cartIconDesktop.addEventListener('click', () => {
    cartMenu.classList.add('active');
    document.body.classList.add('no-scroll');

    openWithBackdrop(cartMenu);
});