document.addEventListener('DOMContentLoaded', () => {
  // 1. Retrieve Saved Package Data
  const savedPackageRaw = localStorage.getItem('current_selected_package');
  const displayPackageName = document.getElementById('displayPackageName');
  const displayPackagePrice = document.getElementById('displayPackagePrice');
  const vegGuestsInput = document.getElementById('vegGuests');
  const nonVegGuestsInput = document.getElementById('nonVegGuests');
  const totalGuestCount = document.getElementById('totalGuestCount');
  const estimatedTotal = document.getElementById('estimatedTotal');
  const eventDetailsForm = document.getElementById('eventDetailsForm');

  let baseUnitPrice = 249;

  if (savedPackageRaw) {
    try {
      const pkg = JSON.parse(savedPackageRaw);
      if (pkg.name) displayPackageName.textContent = pkg.name;
      if (pkg.price) {
        baseUnitPrice = parseInt(pkg.price, 10);
        displayPackagePrice.textContent = `Base: ₹${baseUnitPrice} / box`;
      }
      if (pkg.initialQty && vegGuestsInput) {
        vegGuestsInput.value = pkg.initialQty;
      }
    } catch (err) {
      console.error('Error parsing stored package data:', err);
    }
  }

  // 2. Calculations for Portion Boxes & Estimated Total
  function calculateGrandTotal() {
    const vegCount = parseInt(vegGuestsInput.value || '0', 10);
    const nonVegCount = parseInt(nonVegGuestsInput.value || '0', 10);
    const totalGuests = Math.max(0, vegCount) + Math.max(0, nonVegCount);

    totalGuestCount.textContent = `${totalGuests} Boxes`;

    let activeUnitPrice = baseUnitPrice;
    if (totalGuests >= 25) {
      activeUnitPrice = Math.round(baseUnitPrice * 0.9); // 10% volume discount
    }

    const calculatedSum = totalGuests * activeUnitPrice;
    estimatedTotal.textContent = `₹${calculatedSum.toLocaleString('en-IN')}`;
  }

  // 3. Stepper Button Handlers
  document.querySelectorAll('.btn-step').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      let currentVal = parseInt(input.value || '0', 10);
      const min = parseInt(input.getAttribute('min') || '0', 10);
      const max = parseInt(input.getAttribute('max') || '500', 10);

      if (btn.classList.contains('inc') && currentVal < max) {
        input.value = currentVal + 5;
      } else if (btn.classList.contains('dec') && currentVal > min) {
        input.value = Math.max(min, currentVal - 5);
      }

      calculateGrandTotal();
    });
  });

  if (vegGuestsInput) {
    vegGuestsInput.addEventListener('input', calculateGrandTotal);
  }
  if (nonVegGuestsInput) {
    nonVegGuestsInput.addEventListener('input', calculateGrandTotal);
  }

  calculateGrandTotal();

  // 4. Form Submission & State Routing
  if (eventDetailsForm) {
    eventDetailsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(eventDetailsForm);
      const eventConfig = {
        city: formData.get('city') || 'Noida',
        occasion: formData.get('occasion'),
        eventDate: formData.get('eventDate'),
        deliveryTime: formData.get('deliveryTime'),
        vegGuests: parseInt(formData.get('vegGuests') || '0', 10),
        nonVegGuests: parseInt(formData.get('nonVegGuests') || '0', 10),
        unitPrice: baseUnitPrice,
        totalBoxes: parseInt(vegGuestsInput.value || '0', 10) + parseInt(nonVegGuestsInput.value || '0', 10)
      };

      localStorage.setItem('current_event_details', JSON.stringify(eventConfig));

      const submitBtn = document.querySelector('.btn-customize-menu');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving Event Details...';
      }

      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 400);
    });
  }
});