// ---- Sliders: adds/deletes active class and changes the index of the images
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.product-slider');

  sliders.forEach(slider => {
    const images = slider.querySelectorAll('.product-image');
    const leftArrow = slider.querySelector('.arrow-left');
    const rightArrow = slider. querySelector('.arrow-right');
    let index = 0;

    const showImage = (i) => {
      images.forEach(img => img.classList.remove('active'));
      images[i].classList.add('active');

      // ---- Toggles visibility of arrows depending on visible image
      if (i === 0){
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'block';
      } else if (i === images.length - 1){
        rightArrow.style.display = 'none';
        leftArrow.style.display = 'block';
      } else {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
      }
    };

    showImage(index);

    slider.querySelector('.arrow-left').addEventListener('click', () => {
      index = (index === 0) ? images.length - 1 : index - 1;
      showImage(index);
    });

    slider.querySelector('.arrow-right').addEventListener('click', () => {
      index = (index === images.length - 1) ? 0 : index + 1;
      showImage(index);
    });
  });
});