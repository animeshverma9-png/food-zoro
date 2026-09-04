document.addEventListener('DOMContentLoaded', () => {
  // 1. Location Dropdown Picker Logic
  const locationToggle = document.getElementById('locationToggle');
  const cityDropdown = document.getElementById('cityDropdown');
  const selectedCityText = document.getElementById('selectedCityText');

  locationToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    cityDropdown.classList.toggle('show');
  });

  cityDropdown.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', (e) => {
      const city = e.target.getAttribute('data-city');
      selectedCityText.innerHTML = `${city} <i class="fa-solid fa-chevron-down"></i>`;
      localStorage.setItem('user_city', city);
      cityDropdown.classList.remove('show');
    });
  });

  document.addEventListener('click', () => {
    cityDropdown.classList.remove('show');
  });

  const savedCity = localStorage.getItem('user_city');
  if (savedCity) {
    selectedCityText.innerHTML = `${savedCity} <i class="fa-solid fa-chevron-down"></i>`;
  }

  // 2. Automated Poster Swiping Carousel (Every 3 Seconds)
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const carouselWrapper = document.getElementById('heroCarousel');

  let currentSlide = 0;
  const slideIntervalTime = 3000; // 3 seconds
  let slideTimer;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
      dots[idx].classList.toggle('active', idx === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAutoSlide() {
    slideTimer = setInterval(nextSlide, slideIntervalTime);
  }

  function pauseAutoSlide() {
    clearInterval(slideTimer);
  }

  // Event Listeners for Controls
  nextBtn.addEventListener('click', () => {
    nextSlide();
    pauseAutoSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    pauseAutoSlide();
    startAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index'));
      showSlide(targetIndex);
      pauseAutoSlide();
      startAutoSlide();
    });
  });

  // Pause on mouse hover, resume on mouse leave
  carouselWrapper.addEventListener('mouseenter', pauseAutoSlide);
  carouselWrapper.addEventListener('mouseleave', startAutoSlide);

  // Initialize Slider
  startAutoSlide();
});