// Haetaan kasvidata JSON-tiedostosta
fetch('/plants')
  .then(response => response.json())
  .then(plants => {
    showPlants(plants);
  })
  .catch(error => {
    console.error('Virhe JSON-tiedoston latauksessa:', error);
  });

// Näytetään kasvit galleriassa
function showPlants(plants) {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  plants.forEach(plant => {
    const card = document.createElement('div');
    card.classList.add('plant-card');

    card.innerHTML = `
  <img src="${plant.image}" alt="${plant.name}">
  <div class="plant-info">
    <h3>${plant.name}</h3>
    <p>${plant.description}</p>
    <p>${plant.material}</p>
    <p>Color: ${plant.color}</p>
  </div>
`;

    grid.appendChild(card);
  });
}