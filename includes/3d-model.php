<section id="product-customizer">
  <div class="customizer-header">
    <h2>Personlig Design</h2>
    <p>Skapa din egen design av vår fåtölj – personlig, unik och helt i din stil.</p>
  </div>

  <!-- 3d model container -->
  <figure id="model-container">
    <figcaption class="visually-hidden">
      3d-modell av fåtöljen Carlsten
    </figcaption>
  </figure>

  <div class="model-flex">

    <!-- Color swatches body-->
    <div class="color-selectors">
  
      <!-- Body -->
      <div class="color-group">
        <button class="color-toggle" aria-expanded="false">
          <span class="label">Stomme</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
  
        <ul class="swatch-list" hidden>
          <li><button class="swatch" data-color="#d79566" data-part="body"></button></li>
          <li><button class="swatch" data-color="#3f2b0e" data-part="body"></button></li>
          <li><button class="swatch" data-color="#000000" data-part="body"></button></li>
        </ul>
      </div>
  
      <!-- Seat-->
      <div class="color-group">
        <button class="color-toggle" aria-expanded="false">
          <span class="label">Sittdel</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
  
        <ul class="swatch-list" hidden>
          <li><button class="swatch" data-color="#513029" data-part="seat"></button></li>
          <li><button class="swatch" data-color="#616e42" data-part="seat"></button></li>
          <li><button class="swatch" data-color="#fffaee" data-part="seat"></button></li>
          <li><button class="swatch" data-color="#000000" data-part="seat"></button></li>
          <li><button class="swatch" data-color="#1c3064" data-part="seat"></button></li>
          <li><button class="swatch" data-color="#b0b0b0" data-part="seat"></button></li>
        </ul>
      </div>
    </div>
  
    <!-- CTA button -->
    <button class="cta-button product-button button-disabled">
      Utforska produkt
      <img src="/assets/images/arrow_forward.svg" alt="arrow icon">
    </button>
  </div>
</section>

<script>
  document.querySelectorAll(".color-toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const list = toggle.nextElementSibling; // the UL
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      // toggle visibility
      toggle.setAttribute("aria-expanded", String(!isOpen));
      list.hidden = isOpen ? true : false;
    });
  });
</script>