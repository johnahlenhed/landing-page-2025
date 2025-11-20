<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Kinforma</title>
    <!-- Google fonts links -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Special+Gothic+Expanded+One&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/styles.css">
    <script type="module" src="../assets/model.js"></script>
    <script type="module" src="../assets/main.js"></script>
    <script type="importmap">
        {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@v0.181.0/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@v0.181.0/examples/jsm/"
        }
      }
    </script>
</head>

<body>

    <nav class="navbar">

        <div class="menu-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </div>

        <h1>Kinforma</h1>

        <div class="cart-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        </div>
    </nav>

    <nav class="navbar-desktop">

        <div class="navbar-items-desktop">
            <img src="/assets/images/sweden-flag.svg" alt="swedish flag icon">

            <img src="/assets/images/kinforma-logo-light.png" alt="Kinforma logo">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

        </div>

        <div class="nav-links-desktop">
            <ul>
                <li><a>Kollektioner</a></li>
                <li><a>Personlig design</a></li>
                <li><a>Om oss</a></li>
                <li><a>Kontakta oss</a></li>
            </ul>
        </div>
    </nav>

    <menu class="mobile-menu">

        <div class="mobile-menu-top">
            <img src="/assets/images/sweden-flag.svg" alt="swedish flag icon">
            <img src="/assets/images/kinforma-logo-light.png" alt="Kinforma logo">
            <div class="menu-icon-close">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>
        </div>

        <div class="menu-link-container">
            <ul>
                <li><a>Butik</a></li>
                <li><a>Om oss</a></li>
                <li><a>Kontakt</a></li>
                <li><a>Hållbarhet</a></li>
            </ul>
        </div>

        <div class="menu-user-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <p>Logga in</p>
        </div>
    </menu>

    <div class="video-container">

        <video autoplay muted loop playsinline>
            <source src="/assets/video/hero_animation1.mkv" type="video/mp4">
        </video>

    </div>

    <section class="hero-overlay"></section>

    <script>
        // Header scroll effect
        console.log("Header loaded");
        var nav = document.querySelector('.navbar');
        var navDesktop = document.querySelector('.navbar-desktop');

        function transparentNav() {
            if (window.scrollY > 140) {
                nav.classList.add('navbar-scrolled');
                navDesktop.classList.add('navbar-desktop-scrolled');
            } else {
                nav.classList.remove('navbar-scrolled');
                navDesktop.classList.remove('navbar-desktop-scrolled');
            }
        }
        window.addEventListener('scroll', transparentNav);
    </script>

    <script src="/assets/mobile-menu.js"></script>