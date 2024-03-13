// HAMBURGER MENU***************
// Definera nav
let nav = document.querySelector('nav');

// funktion för att toggla hamburgar-menyn
function toggleNavbar() {
    let navLinks = document.querySelectorAll('nav a');
    let hamburgerIcon = document.querySelector('.hamburger-menu i');

    // visa nav länkarna
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].style.display = navLinks[i].style.display === 'block' ? 'none' : 'block';
    }

    // Toggla nav-active class
    nav.classList.toggle('nav-active');

    // Byta ikoner från fontawesome. När hamburgemenyn har klickats på och nav länkarna visas ska ikonen bytas till 'fa-xmark', När nav länkarna inte syns ska 'fa-bars' visas.
    if (nav.classList.contains('nav-active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-xmark');
    } else {
        hamburgerIcon.classList.remove('fa-xmark');
        hamburgerIcon.classList.add('fa-bars');
    }
}
// Event listener för hamburger meny
document.getElementById('hamburger-menu').addEventListener('click', toggleNavbar);

// Event listener för när man klickar utanför nav. Då ska naven stängas.
document.addEventListener('click', function(event) {
    let clickedInsideNav = nav.contains(event.target) || event.target.matches('#hamburger-menu, #hamburger-menu *');

    if (!clickedInsideNav && nav.classList.contains('nav-active')) {
        toggleNavbar(); // Close the navbar if it is open and the click is outside
    }
});



function showEditForm(id, currentName, currentPopulation) {
    document.getElementById('editCityForm').style.display = 'block';
    document.getElementById('editNameInput').value = currentName;
    document.getElementById('editPopulationInput').value = currentPopulation;

    console.log("Setting id:",id);

    // Lägg till för att se vilket ID som sätts
    // Sätt ett attribut på redigeringsknappen med aktuellt Id
    document.getElementById('editCityButton').setAttribute('data-city-id',id);
     // Scrolla till toppen av sidan när redigeringsformuläret visas
     window.scrollTo(0, 0);
}



function fetchAndDisplayCities() {
    fetch('https://avancera.app/cities/')
        .then(response => response.json())
        .then(cities => {
            const citiesList = document.getElementById('citiesList');
            citiesList.innerHTML = ''; // Rensar befintliga städer

            cities.forEach(city => {
                let row = citiesList.insertRow();
                row.insertCell(0).textContent = city.name;
                row.insertCell(1).textContent = city.population;
                let actionsCell = row.insertCell(2);

                // Skapa Radera-knapp
                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Radera';
                deleteButton.onclick = () => deleteCity(city.id);
                actionsCell.appendChild(deleteButton);

                // Skapa Redigera-knapp
                let editButton = document.createElement('button');
                editButton.textContent = 'Redigera';
                //lägger till en klass på knappen så att jag kan styla den.
                editButton.classList.add("edit-button");
                // När man klickar kommer det upp redigeringsformulär
                editButton.onclick = () => showEditForm(city.id, city.name, city.population);
                actionsCell.appendChild(editButton);

            });
        });
}
fetchAndDisplayCities();
// Funktion för att lägga till en stad
function addCity(event) {
    event.preventDefault(); // Förhindrar sidan från att laddas om
    let name = document.getElementById('nameInput').value;
    let population = Number(document.getElementById('populationInput').value);

    fetch('https://avancera.app/cities/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, population })
    }).then(() => fetchAndDisplayCities());
}

// Funktion för att radera en stad
function deleteCity(id) {
    fetch(`https://avancera.app/cities/${id}`, {
        method: 'DELETE'
    }).then(() => fetchAndDisplayCities());
}


// Funktion för att redigera en stad med PUT
function editCity(event) {
    event.preventDefault();
    let id = document.getElementById('editCityButton').getAttribute('data-city-id');
    console.log("id:", id); // Detta bör endast logga själva ID-värdet

    let newName = document.getElementById('editNameInput').value;
    let newPopulation = Number(document.getElementById('editPopulationInput').value);

    fetch(`https://avancera.app/cities/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            name: newName,
            population: newPopulation
        })
    }).then(() => {
        fetchAndDisplayCities();
        document.getElementById('editCityForm').style.display = 'none';
    });
}



//Eventlyssnare som ändrar cityform.
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('editCityForm').onsubmit = editCity;
    document.getElementById('addCityForm').addEventListener('submit', addCity);
    fetchAndDisplayCities();
});
