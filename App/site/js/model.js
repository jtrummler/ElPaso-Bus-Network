function addHexLayer(filePath, map) {
    fetch(filePath)
    .then(response => response.json())
    .then(data => {
        logGeoJSONData(data);

        // Find the maximum and minimum ridership values in the dataset
        const ridershipValues = data.features.map(feature => feature.properties.ridership);
        const maxRidership = Math.max(...ridershipValues);
        const minRidership = Math.min(...ridershipValues);

        const geojsonLayer = L.geoJSON(data, {
            style: function(feature) {
                const ridership = feature.properties.ridership;
                // Convert the ridership value to a percentage of the range between min and max
                const percent = (ridership - minRidership) / (maxRidership - minRidership);
                // Calculate the red, green, and blue components of the fill color
                const r = Math.round(217 + (47 * percent));
                const g = Math.round(158 + (65 * (1 - percent)));
                const b = 57;
                return {
                    fillColor: `rgb(${r},${g},${b})`,
                    fillOpacity: 0.6,
                    color: 'white',
                    weight: 0.5
                };
            },
            onEachFeature: function(feature, layer) {
                // Bind a popup to each hexagon displaying the name of the GeoJSON feature
                layer.bindPopup(feature.properties.name);
            }
        });
        geojsonLayer.addTo(map);
    })
    .catch(error => console.error(error));

    return map;
}

export {
    addHexLayer
};