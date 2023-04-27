
import { initMap} from './map.js';
import {addStopsAndRoutesLayer } from './current_data.js';
import { addHexLayer } from './model.js';


const epMap = initMap();

// create a button to show the ridership data
const ridershipButton = document.getElementById("ridership-button");
const routesSelect = document.getElementById('routes-select');

ridershipButton.addEventListener("click", function() {
    routesSelect.style.display = 'block';
    addStopsAndRoutesLayer('./data/ridership.geojson', './data/transit_lines.geojson', epMap)

    var tabContainer = document.querySelector(".tab-container");
    if (tabContainer.style.display === "none") {
      tabContainer.style.display = "block";
    }
});


// Define a variable to keep track of the hex layer
let hexLayer = null;

// Get the hex button element
const hexButton = document.getElementById("hex-button");

// Add a click event listener to the hex button
hexButton.addEventListener("click", function() {
    if (hexLayer) {
        // If the hex layer is already added, remove it and set the hexLayer variable to null
        epMap.removeLayer(hexLayer);
        hexLayer = null;
    } else {
        // If the hex layer is not added, call the addHexLayer function and set the hexLayer variable to the returned layer
        hexLayer = addHexLayer('./data/final_hex.geojson', epMap);
    }
});



// visit our GitHub webpage
const githubButton = document.getElementById('github-button');
  githubButton.addEventListener('click', () => {
    const confirmation = confirm('You are about to visit our GitHub page. Are you sure you want to continue?');
    if (confirmation) {
      window.open('https://github.com/jtrummler/ElPaso-Bus-Network', '_blank');
    }
  });



// import new routes
const importButton = document.getElementById('import-button');
  const fileInput = document.getElementById('file-input');

  importButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const accessToken = 'YOUR_DROPBOX_ACCESS_TOKEN';
    const url = 'https://content.dropboxapi.com/2/files/upload';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
      path: `/${file.name}`,
      mode: 'add',
      autorename: true,
      mute: false
    }));

    xhr.onload = () => {
      if (xhr.status === 200) {
        alert('File uploaded successfully!');
      } else {
        alert('An error occurred while uploading the file.');
      }
    };

    xhr.send(file);
  });



  


