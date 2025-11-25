const cartMenuIcon = document.querySelector('.cart-icon');
const cartMenu = document.querySelector('.cart-menu');
const cartMenuClose = document.querySelector('.cart-close-icon');
const cartIconDesktop = document.querySelector('.cart-icon-desktop');
const cartMenuButton = document.querySelector('.cart-menu button a');


//Close icon
cartMenuClose.addEventListener('click', () => {
    cartMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');

    closeWithBackdrop(cartMenu);
});

cartMenuButton.addEventListener('click', () => {
    cartMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');

    closeWithBackdrop(cartMenu);
});

//Open cart menu
cartMenuIcon.addEventListener('click', () => {
    cartMenu.classList.add('active');
    document.body.classList.add('no-scroll');

    openWithBackdrop(cartMenu);
});

//Open cart menu desktop
cartIconDesktop.addEventListener('click', () => {
    cartMenu.classList.add('active');
    document.body.classList.add('no-scroll');

    openWithBackdrop(cartMenu);
});