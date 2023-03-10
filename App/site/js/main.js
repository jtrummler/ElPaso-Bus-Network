
import { initMap } from './map.js';

const map = initMap();


var transitLines

// define a function to style the GeoJSON features based on their properties
function styleFunction(feature) {
  var value = feature.properties.route_type;
  console.log(value)


  var fillColor;
  if (value = '4') {
    fillColor = 'green';
  } else if (value = 2) {
    fillColor = 'yellow';
  } else {
    fillColor = '#2d3439';
  }
  return {
    fillColor: fillColor,
    fillOpacity: 0.5,
    weight: 2,
    color: 'black',
    
  };
}


// load the GeoJSON file using the fetch API
fetch('./data/transit_lines.geojson')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    transitLines = data;
    // create a Leaflet GeoJSON layer with the loaded data and add it to the map
    L.geoJSON(transitLines, {style: styleFunction}).addTo(map);
});


function checkbox() {
    // Get the checkbox
    var checkBox = document.getElementById("myCheck");
    // Get the output text
    var text = document.getElementById("text");
  
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
  }