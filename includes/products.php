<?php
require("content.php");
?>
<section class="products">
    <h2>Höst 25</h2>
    <?php foreach ($products as $product) : ?>
        <article class="product-card">
            <img src="<?= $product['img-path'] ?>" alt="<?= $product['img-alt'] ?>">
            <h3><?= $product['name'] ?></h3>
        </article>
    <?php endforeach; ?>
    <div class="cta-collection">
        <a href="#">Utforska kollektionen ></a>
    </div>
</section>