// ---- Works by adding an active class and changing the index of the images
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.product-slider');

  sliders.forEach(slider => {
    const images = slider.querySelectorAll('.product-image');
    let index = 0;

    const showImage = (i) => {
      images.forEach(img => img.classList.remove('active'));
      images[i].classList.add('active');
    };

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