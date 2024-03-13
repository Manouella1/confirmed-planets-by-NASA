
    let currentPage = 0; // räknar sidorna vi kollar på.
    const perPage = 400; // Vi kollar 100 planeter per sida.
    let topPlanets = []; // Här lagras de 10 största planeterna.
let planetString = [];
    //Hämtar planeterna per sida. För stora datamängder returneras det i sidor. Vi har därför med page i parametern för att specifiera vilken sida av resultaten vi hämtar från.

    //Varje gång fetchPage kallas, används page-parametern för att berätta för API:et vilken delmängd av data som ska returneras. I detta fall sätter vi page-parametern i URL:en för API-anropet, som en del av query-strängen:
    function fetchPage(page) {
      document.getElementById('loading').style.display = 'block'; // Visa laddningssymbolen


      fetch(`https://exoplanets.nasa.gov/api/v1/planets/?order=display_name+asc&per_page=${perPage}&page=${page}&search=`)
        .then(response => response.json())
        .then(data => {
          processPlanets(data.items); // Process the current page of planets
          const totalPages = Math.ceil(data.total / perPage);
//om det finns fler sidor att hämta
          if (currentPage < totalPages - 1) {
            currentPage++;
            fetchPage(currentPage); // Då hämtas data från nästa sida
          } else {
            console.log('Finished fetching all pages');
            // När alla sidor har hämtats har vi samlat ihop alla planeter.
            displayTopPlanets();
             document.getElementById('loading').style.display = 'none'; // dölj laddningssymbolen
             document.querySelector('h2').style.display = 'none';

          }
        })

    }
// Tar en array av planeter och behandlar varje planet.
    function processPlanets(planets) {
      planets.forEach(planet => {
        if (planet.pl_massj) { //Kontrollera om planeten har massvärde.
          if (topPlanets.length < 10) {
            topPlanets.push(planet); //Om vi inte har 10 planeter, lägg till en.
            if (topPlanets.length === 10) {
              // När vi har 10, sorterar vi  dem.
              topPlanets.sort((a, b) => b.pl_massj - a.pl_massj); //Använder sort metoden och en jämförelsefunktion.
              //Jämförelsefunktionen b - a beräknar skillnaderna i nyckelvärdet pl_massj. Om resultatet är ett negativt tal är negativt så är a större än b, och a kommer sorteras före b. Om resultatet är 0 kommer det stanna kvar i sin ordning.
            }
          } else if (planet.pl_massj > topPlanets[topPlanets.length - 1].pl_massj) {//Ersätt den minsta i top 10 om den nya planeten är större.
            topPlanets[topPlanets.length - 1] = planet;
            //Sortera om listan
            topPlanets.sort((a, b) => b.pl_massj - a.pl_massj);
          }
        }
      });
    }
// CHART********
function displayTopPlanets() {
  // Sortera planeterna baserat på deras massa
  topPlanets.sort((a, b) => b.pl_massj - a.pl_massj);

  // Skapa en array av färger för bubblorna
  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D', '#00FF00'];

   // Ta de 9 första planeterna efter sortering och tilldela färger
   const bubbleData = topPlanets.slice(0, 9).map((planet, index) => ({
    x: index, // X-axeln kan vara indexet för att sortera dem
    y: Math.round(planet.pl_massj), // Y-axeln är massan av planeten
    r: Math.sqrt(planet.pl_massj) * 2, // Radien för bubblan, justera faktorn efter behov
    title: planet.title, // Planetens namn här
    pl_massj: Math.round(planet.pl_massj), // Planetens massa här och avrundad till heltal
    backgroundColor: colors[index] // Tilldela färg från arrayen
  }));
// Lägg till Jorden som den tionde planeten
bubbleData.push({
  x: 9, // X-axelns position för jorden
  y: 0.00315, // Jordens massa i Jupitermassor
  r: Math.sqrt(0.00315) * 40, //Tar kvadratroten så jag får radien för att kunna skala upp cirkeln.
  title: 'Earth', // Namnet på jorden
  pl_massj: 0.00315, // Jordens massa
  backgroundColor: colors[9] // Specifik bakgrundsfärg för jorden
});

  let ctx = document.getElementById('myChart').getContext('2d');
  let myBubbleChart = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Planet mass',
        data: bubbleData,
        backgroundColor: colors // Använder färgarrayen här
      }]

    },
    options: {
      // responsive: true,
      // maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#fff'
          },
        },
      },
scales: {
  y: {
    ticks:{
      color: '#fff'
  },
  grid: {
    color: '#fff'
  }

},
x: {
  ticks: {
    color: '#ffff'
  },
  grid: {
    color: '#fff'
  }
}}
    }
  });

  // Lägger in egen chart legend under chart
  createLegend(bubbleData);
  document.querySelector('section').style.display = 'block';
  document.getElementById('chartLegend').style.display = 'block';
}

function createLegend(bubbleData) {
  const legendContainer = document.getElementById('chartLegend'); // Förutsätter att det finns ett element med ID 'chartLegend' i din HTML
  legendContainer.innerHTML = ''; // Rensa befintlig legend

  bubbleData.forEach((planet, index) => {
    const legendItem = document.createElement('div');
    const colorBox = document.createElement('span');
    colorBox.style.display = 'inline-block';
    colorBox.style.backgroundColor = planet.backgroundColor;
    colorBox.style.width = '20px';
    colorBox.style.height = '20px';
    colorBox.style.borderRadius = '50%';
    colorBox.style.marginRight = '10px';

    legendItem.appendChild(colorBox);
    legendItem.appendChild(document.createTextNode(`${index}: Planet: ${planet.title}, Jupiter mass: ${planet.pl_massj}`));
    legendContainer.appendChild(legendItem);
  });
}

    fetchPage(currentPage);
