
import { initMap, addStopsLayer} from './map.js';
import { addHexLayer } from './model.js';


const epMap = initMap();

// Get the routes checkbox element
const checkbox_Routes = document.getElementById("myCheck_Routes");

// Add a click event listener to the checkbox
checkbox_Routes.addEventListener("click", function() {
  // Check if the checkbox is checked
  if (checkbox_Routes.checked) {
    // Call the addStopsLayer function with the specified arguments
    addStopsLayer('./data/ridership.geojson', epMap);
  } 
});


// Get the hex checkbox element
const checkbox_Hex = document.getElementById("myCheck_Hex");

// Add a click event listener to the checkbox
checkbox_Hex.addEventListener("click", function() {
  // Check if the checkbox is checked
  if (checkbox_Hex.checked) {
    // Call the addStopsLayer function with the specified arguments
    addHexLayer('./data/final_hex.geojson', epMap);
  }
});



  


