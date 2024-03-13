



//HÄMTA PAGINATION ELEMENT
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const firstPageBtn = document.getElementById('first-page');
const lastPageBtn = document.getElementById('last-page');
const currentPageSpan = document.getElementById('current-page');
let itemsPerPageSelect = document.getElementById('items-per-page');
let itemsRangeSpan = document.getElementById('items-range');
let totalItemsSpan = document.getElementById('total-items');
let totalPagesSpan = document.getElementById('total-pages');

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



//Planetbehållare <div>
let planetsContainer = document.getElementById('planets-container');

let currentPage = 1;
let planetsPerPage = parseInt(itemsPerPageSelect.value, 10); // Använd valda värdet för items per page, vi vill ha decimaltal

let currentFilter = ''; //Här ska nuvarande filter queryn hållas isär.
let totalFilteredPlanets = 0; //vi stoppar in planeterna här

// Hämta planeter för varje sida
 // % -> %25
  // : -> %3a
  // encodeURIComponent console logg
  function fetchPlanets(page, typeQuery = currentFilter, searchQuery = '') {
    let baseUrl = `https://exoplanets.nasa.gov/api/v1/planets/?order=display_name+asc&per_page=${planetsPerPage}&page=${page}`;

       //encodeURIComponent säkerställer att söksträngen är URL-kodad för att undvika problem med särskilda tecken.
     // Kontrollerar om det finns ett filter för planettyp och om så är fallet lägger till denna filterparameter i URL:en.
    let searchPart = searchQuery ? `&condition_1=%25${encodeURIComponent(searchQuery)}%25%3adisplay_name:ilike` : '';
    let typePart = typeQuery ? `&search=${typeQuery}` : '';

    let url = `${baseUrl}${searchPart}${typePart}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log("Parsed Data:", data);
      totalFilteredPlanets = data.total; // totala antalet planeter från fetchen.
        displayPlanets(data.items);
        updatePlanetCount(totalFilteredPlanets); // så det totala antalet syns på sidan
        updatePaginationDisplay();
      })
  }

  // Ny funktion för att uppdatera planeträkningen på sidans inledningstext.
    function updatePlanetCount(count) {
      const planetCountElement = document.getElementById('planet-count');
      if (planetCountElement) {
        planetCountElement.textContent = `Total confirmed planet discoveries as of today: ${count}`;
      } else {
        console.log("planetCountElement not found");
      }
    }

  // Filter knapparna
  document.getElementById('btn-all').addEventListener('click', () => {
    currentFilter = ''; //resettar currentfilter
    currentPage = 1; // sätter currentpage till 1.
    fetchPlanets(currentPage - 1,); // Kalla på fetchplanet utan filter.
  });

  document.getElementById('btn-gas-giant').addEventListener('click', () => {
    currentFilter = '(Gas+Giant)%3Aplanet_type';
    currentPage = 1; // När man tryckt på ett filter ska det reseta till första sidan för filtret
    fetchPlanets(currentPage - 1, currentFilter);
  });
  document.getElementById('btn-neptune-like').addEventListener('click', () => {
    currentFilter = '(Neptune-like)%3Aplanet_type';
    currentPage = 1; // Reset till första sidan av filtret
    fetchPlanets(currentPage - 1, currentFilter);
  });
  document.getElementById('btn-super-earth').addEventListener('click', () => {
    currentFilter = '(Super+Earth)%3Aplanet_type';
    currentPage = 1;
    fetchPlanets(currentPage - 1, currentFilter);
  });
  document.getElementById('btn-terrestrial').addEventListener('click', () => {
    currentFilter = '(Terrestrial)%3Aplanet_type';
    currentPage = 1;
    fetchPlanets(currentPage - 1, currentFilter);
  });
  document.getElementById('btn-unknown').addEventListener('click', () => {
    currentFilter = '(Unknown)%3Aplanet_type';
    currentPage = 1;
    fetchPlanets(currentPage - 1, currentFilter);
  });

//searchPlanet function för att kalla på fetchPlanets med search query
function searchPlanet() {
  let searchInput = document.getElementById('search-input');
  let search = searchInput.value.toLowerCase();
  fetchPlanets(currentPage - 1, '', search);
}

// Event listener för sök button
document.getElementById('search-button').addEventListener('click', searchPlanet);
document.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    searchPlanet();
  }
});

function displayPlanets(planets) {
  planetsContainer.innerHTML = ''; // Clear previous planets

  planets.forEach((planet, index) => {
    console.log(planet.description)
    const planetDiv = document.createElement('div');
    planetDiv.className = 'planet';
    // varje planet ligger i en div som heter planet. <H3> är den som är klickbar för modalen. Där ligger all data-set information. Jag hämtar data-set informationen inuti H3an och sedan lägger jag in elementet i min modal med ett ID. som jag sedan hämtar längre ner i en variabel.
    planetDiv.innerHTML = `
      <div class="StopOverflow">
        <div class="col-3">


          <a class="imglink" href="#" data-planet-index="${index}">
            <img id="IDett" class="planetImg" alt="image of planet" src="https://exoplanets.nasa.gov${planet.image}"></img>
          </a>
          <div class="col-pic">
            <h3 id="A"
            data-type=${planet.planet_type}
            data-description="${planet.description}"
            data-avstond=${planet.st_dist}
            data-bild="https://exoplanets.nasa.gov${planet.image}"
            data-mass="${planet.mass_display}"
            data-discovery="${planet.discovery_date}"
            data-name="${planet.title}"

            class="title">${planet.title}</h3>

            <h4>${planet.planet_type}</h4>

            <h5>Distance: ${planet.st_dist} light years</h5>
          </div>
        </div>
      </div>
      <div id="myModal" class="modal">
      <span class="close">&times;</span>

      <img class="modal-content" id="img01">
<p id="description"></p>
<p id="mass">Mass: </p>

      <p id="avstond">Distance: light years</p>

      <p id="discovery"> </p>

      <div id="caption"></div>
    </div>
    `;

    planetsContainer.appendChild(planetDiv);

  }); modal();
}

function modal() {
// Get the modal

let modal = document.getElementById("myModal");
console.log("inmodal")
// Hämtar alla element som ska vara i min modal.
let img = document.getElementById("A");
let title = document.querySelectorAll(".title");
// title är en array med klasser på H3. vi la in data attribut på den eftersom att det är den som ska klickas på.
let modalImg = document.getElementById("img01");
let captionText = document.getElementById("caption");
let description =document.getElementById("description");
let mass = document.getElementById("mass");
let avstond = document.getElementById("avstond")
let discoveryDate = document.getElementById("discovery")
console.log("hej", title[0].dataset.description);
for(let i = 0 ;  i < title.length; i++){
// arrayen av H3 med klassen title loopas igenom så att vi inte får samma information för varje planet.
  title[i].onclick = function(){

mass.textContent = `Mass: ${title[i].dataset.mass}`
discoveryDate.textContent = `Discovery date: ${title[i].dataset.discovery}`;
avstond.textContent = `Distance: ${title[i].dataset.avstond} light years`;
     console.log("clickat",title[i].dataset.description );

description.innerHTML = title[i].dataset.description;
     modal.style.display = "block"; // Här syns modalen

     modalImg.src = title[i].dataset.bild; // Här är bakgrundsbilden
     // Title text nedanför:
     captionText.innerHTML = `${title[i].dataset.name} <br>
      ${title[i].dataset.type} planet`
  }
}


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

}

function updatePaginationDisplay() {
  //startindex för sidan: Om varje sida visar 10 planeter och du är på sida 2, börjar indexet på 11 ((2 - 1) * 10 + 1 = 11). Detta är de första planetena som visas på sidan.
  let startIndex = (currentPage - 1) * planetsPerPage + 1;
  // Beräknar slutindex för planeterna på den nuvarande sidan.
  //använder Math.min för att välja det lägsta värdet mellan det beräknade slutindexet och det totala antalet filtrerade planeter, så att det inte refererar till planeter som inte finns.
  let endIndex = Math.min(startIndex + planetsPerPage - 1, totalFilteredPlanets);
  //Sätter textinnehållet i HTML-elementet itemsRangeSpan till en sträng som visar hela intervallet av planeter
  itemsRangeSpan.textContent = `${startIndex}-${endIndex}`;
  //Visar totala antalet filtrerade planeter
  totalItemsSpan.textContent = totalFilteredPlanets;
  //Beräknar totala antalet sidor genom att dela det totala antalet filtrerade planeter med antalet planeter per sida och seedan avrunda uppåt(eftersom en del av en sida även räknas som en hel sida i paginering)
  totalPagesSpan.textContent = Math.ceil(totalFilteredPlanets / planetsPerPage);
  //uppdaterar innehållet i currentPageSpan med det aktuella sidnumret användaren är på
  currentPageSpan.textContent = currentPage;
}


// ÄNDRAT*
// function fetchPlanetsForType(typeQuery) {
//   let url = `https://exoplanets.nasa.gov/api/v1/planets/?order=display_name+asc&per_page=25&page=0&search=${typeQuery}`;

//   fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       displayPlanets(data.items);
//       updatePaginationDisplay();
//     })
//
// }

function changePage(increment) {
  let newPage = currentPage + increment;
  if (newPage < 1) {
    newPage = 1; // Stanna på första sidan om man trycker ner -1
  } else if (newPage > Math.ceil(totalFilteredPlanets / planetsPerPage)) {
    newPage = Math.ceil(totalFilteredPlanets / planetsPerPage); // stanna på sista sidan om man trycker på nästa när man redan är på sista sidan.
  }

  //Om nya sidan inte är current page så ändrar vi till ny sida. Vi sparar nuvarande sida med saveCurrentPage() funktionen som har webstorage. och vi fetchar planeterna för nuvarande sida.
  if (newPage !== currentPage) {
    currentPage = newPage;
    saveCurrentPage();
    fetchPlanets(currentPage);
  }
}

//event listeners för pagination buttons
prevPageBtn.addEventListener('click', () => changePage(-1));
nextPageBtn.addEventListener('click', () => changePage(1));
firstPageBtn.addEventListener('click', () => {
  currentPage = 1;
  saveCurrentPage();
  fetchPlanets(currentPage);
});
lastPageBtn.addEventListener('click', () => {
  currentPage = Math.ceil(totalFilteredPlanets / planetsPerPage);
  saveCurrentPage();
  fetchPlanets(currentPage);
});

// Ändra nummer per sida
itemsPerPageSelect.addEventListener('change', (event) => {
  planetsPerPage = parseInt(event.target.value, 10);
  currentPage = 1; // Reset till first page
  fetchPlanets(currentPage);
});

function saveCurrentPage() {
  localStorage.setItem('currentPage', currentPage);
}
let lastPage = localStorage.getItem('currentPage');
if (lastPage !== null) {
  currentPage = parseInt(lastPage, 10);// om lastPage inte är null. Om det finns ett värde, betyder det att vi har ett sparad sidnummer och behöver använda det för att återställa användarens position i pagineringen.
}
document.addEventListener("touchstart", function(){}, true);
// Ensure that the updatePaginationDisplay function is not called standalone at the bottom
// as it's now handled within fetchPlanets.
updatePlanetCount();
// visa planeter
fetchPlanets();
