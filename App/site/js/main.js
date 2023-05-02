
import { initMap, addHexgrid, addStopPoints, addRoutes} from './map.js';
import {addStopsAndRoutesLayer } from './current_data.js';
import { addHexLayer } from './model.js';
import {ridershipData, updateChartByImport } from './dashboard.js';

const epMap = initMap();
addHexgrid(epMap, './data/final_hex.geojson');
// addStopPoints(epMap, './data/ridership.geojson');
addRoutes(epMap, './data/transit_lines.geojson');


// add and remove the prediction model hex bins on the map
addHexLayer('./data/final_hex.geojson', epMap);


$(document).ready(function() {
  $('#ridership-button').click(function() {
    $('#content').css({
      'display': 'flex'
    });
  });
});

// create a button to show the ridership data
const ridershipButton = document.getElementById("ridership-button");
const routesSelect = document.getElementById('routes-select');

ridershipButton.addEventListener("click", function() {
    routesSelect.style.display = 'block';
    addStopsAndRoutesLayer('./data/ridership.geojson', './data/transit_lines.geojson', epMap)

});





// visit our GitHub webpage
// const githubButton = document.getElementById('github-button');
//   githubButton.addEventListener('click', () => {
//     const confirmation = confirm('You are about to visit our GitHub page. Are you sure you want to continue?');
//     if (confirmation) {
//       window.open('https://github.com/jtrummler/ElPaso-Bus-Network', '_blank');
//     }
//   });



// import new routes
const importButton = document.getElementById('import-button');
const fileInput = document.getElementById('file-input');



let importData;
let importCounter = 0;

importButton.addEventListener('click', () => {
  fileInput.click();
});


fileInput.addEventListener('change', async () => {
  const form = document.getElementById('import_routes_form');
  const formData = new FormData(form);
  console.log(form);
  console.log(formData);


  // Get the selected file
  const file = fileInput.files[0];

  console.log(file);

  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    const data = JSON.parse(reader.result);
    console.log(data);
    addNewRoutes(epMap, data);
  };
  

  const resp = await fetch('https://route-hex-agg-nigyrurota-uc.a.run.app/', {
    method: 'POST',
    body: formData
  });
  
  importData = await resp.json();
  importCounter++;

  updateChartByImport(importData);

  // Create a button in the HTML div id="scenario"
  const scenarioDiv = document.getElementById('scenario');
  const button = document.createElement('button');
  button.textContent = `Scenario ${String.fromCharCode(64 + importCounter)}`;
  const closeButton = document.createElement('span');
  closeButton.textContent = 'X';
  closeButton.style.float = 'right';
  closeButton.style.fontSize = '8px'; // Set the font size
  button.appendChild(closeButton);
  scenarioDiv.appendChild(button);

  // Add event listener to the close button
  closeButton.addEventListener('click', () => {
    button.remove();
  });
});

function addNewRoutes(map, file) {
  const geojsonLayer = L.geoJSON(file, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#ffb545",
        color: "#ffb545",
        weight: 0,
        opacity: 1,
        fillOpacity: 1,
        zIndex: 1
      });
    }
  });
  geojsonLayer.addTo(map);
  map.fitBounds(geojsonLayer.getBounds());
}






