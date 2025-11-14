<?php
require("content.php");
?>
<section class="products">
    <h2>FW25 <em>Marstrand</em></h2>
    <?php foreach ($products as $product) : ?>
        <article class="product-slider">
                <img class="product-image active" src="<?= $product['img-path-active'] ?>" alt="<?= $product['img-alt'] ?>">
                <img class="product-image"src="<?= $product['img-path'] ?>" alt="<?= $product['img-alt'] ?>">
                <button class="arrow-left"><</button>
                <button class="arrow-right">></button>
    </article>
    <?php endforeach; ?>
</section>