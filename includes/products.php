<?php
require("content.php");
?>
<section class="products-section">
    <header class="products-intro">
        <p class="product-season">Höst 2025</p>
        <h2>Marstrand</h2>
        <p>Upptäck vår senaste kollektion av 3D–printade möbler. Tillverkade i Göteborg av återvunnet fiskenät från Marstrand.</p>
    </header>



    <?php foreach ($products as $product) : ?>
        <article class="product-card">
            <!-- Images -->
            <figure class="product-gallery">
                <figcaption class="visually-hidden"><?php echo $product['figcaption'] ?></figcaption>
                <button class="cta-design">
                     <img src="/assets/images/customize_icon.svg"/>Designa
                </button>
                <img src="<?= $product['img-path-active'] ?>" alt="<?= $product['img-alt'] ?>">
                <nav class="carousel-controls" aria-label="Bildnavigering">
                    <!-- Navigation -->
                    <button class="" aria-label="Föregående bild"></button>
                    <button class="" aria-label="Nästa bild"></button>
                </nav>
            </figure>
            <!-- Information -->
            <div class="product-info-flex">
                <div class="product-info">
                    <p><?php echo $product['type'] ?></p>
                    <h3><?php echo $product['name'] ?></h3>
                    <p>Från <?php echo $product['price'] ?> kr</p>
                </div>
                <div class="button-position">
                    <button class="cta-button product-button">
                        Utforska  <img src="/assets/images/arrow_forward.svg" alt="arrow forward icon"/>
                    </button>
                </div>
            </div>
        </article>
    <?php endforeach; ?>
</section>