// Kun sivu latautuu, haetaan heti kasvit listaan
loadPlants();

// Tämä funktio hakee kaikki kasvit palvelimelta ja näyttää ne sivulla
function loadPlants() {
    // Lähetetään pyyntö palvelimelle osoitteeseen /plants
    fetch('/plants')
        .then(res => res.json()) // Muutetaan vastaus JavaScript-objektiksi
        .then(plants => {
            // Haetaan se div johon lista tulee
            const list = document.getElementById('plant-list');
            
            // Tyhjennetään lista ensin jotta ei tule duplikaatteja
            list.innerHTML = '';

            // Käydään jokainen kasvi läpi yksi kerrallaan
            plants.forEach(plant => {
                // Luodaan uusi div jokaiselle kasville
                const item = document.createElement('div');
                item.classList.add('plant-item');

                // Lisätään kasvin nimi ja poisto-nappi
                // plant.id menee napin onclick funktioon jotta tiedetään mikä kasvi poistetaan
                item.innerHTML = `
                    <span>${plant.name}</span>
                    <button onclick="deletePlant(${plant.id})">Delete</button>
                `;

                // Lisätään kortti listaan
                list.appendChild(item);
            });
        });
}

// Tämä funktio lisää uuden kasvin kun admin painaa "Add Plant" nappia
function addPlant() {
    // FormData on erityinen objekti jolla voi lähettää sekä tekstiä että kuvatiedostoja
    const formData = new FormData();
    
    // Lisätään jokainen lomakkeen kenttä FormDataan
    formData.append('name', document.getElementById('name').value);
    formData.append('color', document.getElementById('color').value);
    formData.append('material', document.getElementById('material').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('image', document.getElementById('image').files[0]); // files[0] = ensimmäinen valittu tiedosto

    // Lähetetään data palvelimelle POST-pyyntönä
    fetch('/plants', {
        method: 'POST',
        body: formData // Ei tarvita Content-Type headeria koska FormData asettaa sen automaattisesti
    })
    .then(res => res.json())
    .then(() => {
        // Näytetään onnistumisviesti
        const msg = document.getElementById('add-message');
        msg.textContent = 'Plant added successfully!';
        msg.style.color = 'green';

        // Tyhjennetään kaikki lomakkeen kentät lisäämisen jälkeen
        document.getElementById('name').value = '';
        document.getElementById('color').value = '';
        document.getElementById('material').value = '';
        document.getElementById('description').value = '';
        document.getElementById('image').value = '';

        // Päivitetään lista jotta uusi kasvi näkyy heti
        loadPlants();
    });
}

// Tämä funktio poistaa kasvin sen id:n perusteella
// id tulee parametrina kun nappia painetaan, esim. deletePlant(3) poistaa kasvin jonka id on 3
function deletePlant(id) {
    // Lähetetään DELETE-pyyntö palvelimelle, id laitetaan URL:iin
    fetch('/plants/' + id, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
        // Näytetään poistamisviesti
        const msg = document.getElementById('delete-message');
        msg.textContent = 'Plant deleted!';
        msg.style.color = 'red';

        // Päivitetään lista jotta poistettu kasvi katoaa heti
        loadPlants();
    });
}