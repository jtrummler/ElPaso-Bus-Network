function addStopsAndRoutesLayer(stopsPath, routesPath, map) {


    fetch(stopsPath)
    .then(response => response.json())
    .then(data => {
        // visualize geojason data in console
        console.log(data);

        // create an empty object to store the ridership data for each bus stop
        const ridershipData = {};

        // Create a Leaflet GeoJSON layer and add it to the map
        const geojsonLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                // Determine the radius of the circle based on a property of the GeoJSON feature
                const radius = Math.sqrt(feature.properties.avg_offs) * 5
                const id = feature.properties.id;

                // Add the bus stop's ridership data to the ridershipData object
                ridershipData[id] = [feature.properties.avg_ons, feature.properties.avg_offs];

                // Create the circle marker with the determined radius and add it to the map
                return L.circleMarker(latlng, { radius: radius, fillColor: '#ffb545', color: '#ffb545' });
                },
                onEachFeature: function(feature, layer) {
                    // Bind a popup to each circle marker displaying the name of the GeoJSON feature
                    layer.bindPopup(feature.properties.TP +
                        "<br>Average offs: " + feature.properties.avg_offs.toFixed(2) +
                        "<br>Average ons: " + feature.properties.avg_ons.toFixed(2));

                }
        });
        console.log(ridershipData);

        // Create an array of unique bus routes from the GeoJSON data
        const routes = [...new Set(data.features.map(feature => feature.properties.RT))];
        
        // Create a drop-down menu for selecting bus routes
        const routesSelector = document.querySelector('#routes-select');
        routesSelector.innerHTML = `<option value="">All Routes</option>
                                   ${routes.map(route => `<option value="${route}">${route}</option>`)}`;

        // Get the selected route from the drop-down menu
        const routesSelect = document.getElementById('routes-select');
        // const selectedRoute = routesSelect.value;

        // Add an event listener for the drop-down menu
        routesSelect.addEventListener('change', function() {
            const selectedRoute = this.value;

            geojsonLayer.eachLayer(function(layer) {
                const layerRoute = layer.feature.properties.RT.toString();
                if (selectedRoute && layerRoute !== selectedRoute) {
                    // Hide the layer if it doesn't match the selected route
                    layer.setStyle({ opacity: 0, fillOpacity: 0 });
                } else {
                    // Show the layer if it matches the selected route
                    layer.setStyle({ opacity: 1, fillOpacity: 0.5 });
                }
            });

            updateLine(routesPath, map, selectedRoute);

            // Get the data for the barchart
            const selectedRouteData = data.features
            .filter(feature => feature.properties.RT.toString() === selectedRoute)
            .map(feature => [feature.properties.TP, feature.properties.avg_ons, feature.properties.avg_offs]);

            // Update the histogram with the selected route data
            updateBarchart(selectedRouteData, selectedRouteData[0]);

            // fill in information in current-data
            const currentData = document.getElementById('current-data'); 
            const on_sum = selectedRouteData.reduce((accumulator, currentValue) => {
                return accumulator + currentValue[1];
              }, 0);
            const off_sum = selectedRouteData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue[1];
            }, 0);

            currentData.innerHTML = '<h2>Selected Route: '+selectedRoute+'</h2>'+
             '<p>Total Current Ridership: ' + Math.round(on_sum+off_sum) + '</p>' +
             '<p>Total Current Ons: ' + Math.round(on_sum) + '</p>'+
             '<p>Total Current Offs: ' + Math.round(off_sum) + '</p>';

         
        });
        geojsonLayer.addTo(map);

    });
  }


function updateLine(routesPath, map, routeValue){
    fetch(routesPath)
    .then(response => response.json())
    .then(data => {
        // visualize geojason data in console
        console.log(data);

        const filteredRoutes = data.features.filter(function(feature) {
            console.log(feature.properties.route_short_name);
            return feature.properties.route_short_name.toString() === routeValue;
            });

            // remove the previous routesLayer if it exists
            if (map.routesLayer && map.hasLayer(map.routesLayer)) {
                map.removeLayer(map.routesLayer);
                }

            map.routesLayer = L.geoJSON(filteredRoutes, {
                style: function(feature) {
                return {
                    color: "#78938a",
                    weight: 3
                };
                }
            }).addTo(map);

})

}


// Create a function to update the histogram
function updateBarchart(selectedData, labels) {

    // Delete existing chart
    d3.select("#barchart").selectAll("svg").remove();
  
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 100, left: 80},
    width = 1000 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    var data = selectedData;

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = labels.slice(1);
    
    // List of groups = bus stops here = value of the first column called group -> I show them on the X axis
    var groups = data.map(function(d) { return d[0]; });
    
    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0));

    svg.selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
    
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d[1]; })])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));
    
    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])
    
    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#ffb545','#78938a'])
    
    // Show the bars
    svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
        .attr("transform", function(d) { return "translate(" + x(d[0]) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key, i) { return {key: key, value: d[i+1]}; }); })
    .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); });
}


export{
    addStopsAndRoutesLayer
}