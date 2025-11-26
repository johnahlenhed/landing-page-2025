<?php
require("content.php");
?>
<section id="products-section">
    <header class="product-header">
        <div class="products-intro">
            <p class="product-season">Vår 2026</p>
            <h2>Marstrand</h2>
            <p>Upptäck vår senaste kollektion av 3D-printade möbler. Tillverkade i Göteborg av återvunnet fiskenät från Marstrand.</p>
        </div>
        <div>
            <button class="cta-button product-button">
                Utforska kollektion
                <img src="/assets/images/arrow_forward.svg" alt="arrow icon">
            </button>
        </div>
    </header>
    <?php foreach ($products as $product) : ?>
        <article class="product-card">

            <!-- Mobile slider -->
            <div class="product-gallery mobile-slider">
                <div class="slider-track">
                    <img src="<?= $product['img-path-active'] ?>" alt="<?= $product['img-alt'] ?>">
                    <img src="<?= $product['img-path_2'] ?>" alt="<?= $product['img-alt'] ?>">
                </div>

                <div class="slider-dots">
                    <span class="dot active"></span>
                    <span class="dot"></span>
                </div>

                <a class="cta-design mobile-cta-design" href="#product-customizer">
                    <span class="material-symbols-outlined">
                        edit_square
                    </span>Designa
                </a>
            </div>

            <!-- Desktop gallery (hidden on mobile) -->
            <figure class="product-gallery desktop-gallery">
                <figcaption class="visually-hidden"><?= $product['figcaption'] ?></figcaption>
                <img src="<?= $product['img-path-active'] ?>" alt="<?= $product['img-alt'] ?>">
                <img src="<?= $product['img-path_2'] ?>" alt="<?= $product['img-alt_2'] ?>">
            </figure>

            <!-- Product Information -->
            <div class="product-info-flex">
                <div class="product-info">
                    <p><?= $product['type'] ?></p>
                    <h3><?= $product['name'] ?></h3>
                    <p>Från <?= $product['price'] ?> kr</p>

                    <a class="cta-design desktop-cta-design" href="#product-customizer">
                        <span class="material-symbols-outlined">
                            edit_square
                        </span>Designa
                    </a>
                </div>

                <div class="button-position">
                    <button class="cta-button product-button">
                        <span>
                            Utforska
                        </span>
                        <img src="/assets/images/arrow_forward.svg" alt="arrow forward icon" />
                    </button>
                </div>
            </div>
        </article>
    <?php endforeach; ?>
</section>

<script>
    document.querySelectorAll(".mobile-slider").forEach(slider => {
        const track = slider.querySelector(".slider-track");
        const dots = slider.querySelectorAll(".dot");

        track.addEventListener("scroll", () => {
            const index = Math.round(track.scrollLeft / track.clientWidth);
            dots.forEach((d, i) => d.classList.toggle("active", i === index));
        });
    });
</script>