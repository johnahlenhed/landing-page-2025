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

  <div class="model-flex product-header">

    <!-- Color swatches body-->
    <div class="color-selectors">
  
      <!-- Body -->
      <div class="color-group">
        <button class="color-toggle" aria-expanded="false">
          <span class="label">Stomme</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
  
        <ul class="swatch-list" hidden>
          <li><button class="swatch" button-color="#d79566" data-color="ek" data-part="chair" data-mesh="seat,sidor"></button></li>
          <li><button class="swatch" button-color="#3f2b0e" data-color="brun" data-part="chair" data-mesh="seat,sidor"></button></li>
          <li><button class="swatch" button-color="#000000" data-color="svart" data-part="chair" data-mesh="seat,sidor"></button></li>
        </ul>
      </div>
  
      <!-- Seat-->
      <div class="color-group">
        <button class="color-toggle" aria-expanded="false">
          <span class="label">Sittdel</span>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
  
        <ul class="swatch-list" hidden>
          <li><button class="swatch" button-color="#513029" data-color="brun" data-part="kudde" data-mesh="kudde"></button></li>
          <li><button class="swatch" button-color="#616e42" data-color="green" data-part="kudde" data-mesh="kudde"></button></li>
          <li><button class="swatch" button-color="#fffaee" data-color="beige" data-part="kudde" data-mesh="kudde"></button></li>
          <li><button class="swatch" button-color="#000000" data-color="svart" data-part="kudde" data-mesh="kudde"></button></li>
          <li><button class="swatch" button-color="#1c3064" data-color="blue" data-part="kudde" data-mesh="kudde"></button></li>
          <li><button class="swatch" button-color="#b0b0b0" data-color="grey" data-part="kudde" data-mesh="kudde"></button></li>
        </ul>
      </div>
    </div>
  
    <!-- CTA button -->
     <div>
       <button class="cta-button product-button">
         Lägg i varukorg
         <img src="/assets/images/arrow_forward.svg" alt="arrow icon">
       </button>
     </div>
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