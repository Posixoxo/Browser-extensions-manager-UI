// Fetch the data from data.json
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('section'); // section holds all cards
    const filterButtons = document.querySelectorAll('.butt-list .tlist');

    // Function to render cards dynamically
    function renderCards(filteredData) {
      container.innerHTML = ''; // clear current cards

      filteredData.forEach((ext, index) => {
        const toggleId = `toggleSwitch-${index}`;
        const card = document.createElement('div');
        card.className = 'card-wrapper';
        card.dataset.active = ext.isActive; // store active state for filtering

        card.innerHTML = `
          <div class="extension-card ${ext.isActive ? 'active' : ''}">
            <div class="Ext">
              <img src="${ext.logo}" alt="${ext.name}" class="img-x">
              <div class="info">
                <h2 class="name">${ext.name}</h2>
                <p class="description">${ext.description}</p>
              </div>
            </div>
            <div class="butt">
              <button class="removeBtn">Remove</button>
              <div class="toggle">
                <input type="checkbox" class="toggleSwitch" id="${toggleId}" ${ext.isActive ? 'checked' : ''}>
                <label for="${toggleId}" class="slider"></label>
              </div>
            </div>
          </div>
        `;

        container.appendChild(card);
      });

      attachCardListeners();
    }

    // Function to attach events to toggles and remove buttons
    function attachCardListeners() {
      const toggles = container.querySelectorAll('.toggleSwitch');
      toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
          const cardWrapper = toggle.closest('.card-wrapper');
          const extensionCard = cardWrapper.querySelector('.extension-card');
          const name = cardWrapper.querySelector('.name').textContent;
          const isActive = toggle.checked;

          // Update appearance
          extensionCard.classList.toggle('active', isActive);
          cardWrapper.dataset.active = isActive; // update data attribute

          // Update the actual data array in memory
          const extData = data.find(ext => ext.name === name);
          if (extData) extData.isActive = isActive;

          console.log(`${name} is now: ${isActive ? 'Active' : 'Inactive'}`);
        });
      });

      const removeButtons = container.querySelectorAll('.removeBtn');
      removeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const cardWrapper = button.closest('.card-wrapper');
          const name = cardWrapper.querySelector('.name').textContent;

          // Remove from DOM
          cardWrapper.remove();

          // Update data array
          const index = data.findIndex(ext => ext.name === name);
          if (index !== -1) data.splice(index, 1);

          console.log(`${name} removed`);
        });
      });
    }

    // Initial render
    renderCards(data);

    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.textContent.trim().toLowerCase();

        // Remove active highlight from others
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        if (filter === 'all') {
          renderCards(data);
        } else if (filter === 'active') {
          renderCards(data.filter(ext => ext.isActive));
        } else if (filter === 'inactive') {
          renderCards(data.filter(ext => !ext.isActive));
        }
      });
    });
  })
  .catch(err => console.error(err));




  
// dark/light mode toggle
// Get elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';

// Apply saved theme on load
if (currentTheme === 'light') {
  body.classList.add('light-mode');
  sunIcon.classList.remove('active');
  moonIcon.classList.add('active');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  sunIcon.classList.toggle('active');
  moonIcon.classList.toggle('active');
  
  // Save preference
  if (body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
});
