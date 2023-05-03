import{addHexgrid} from './map.js';

function addHexLayer(filePath, map) {
  const hexButton = document.getElementById("hex-button");
  let geojsonLayer = null;

  hexButton.addEventListener("click", () => {
    if (!geojsonLayer) {
      fetch(filePath)
        .then(response => response.json())
        .then(data => {
          console.log(data);

          // Find the maximum and minimum ridership values in the dataset
          const predictedRider = data.features.map(feature => feature.properties.prediction);
          console.log(predictedRider);
          const currentRider = data.features.map(feature => feature.properties.ridership);
          console.log(currentRider);
          const maxRidership = Math.max(...predictedRider);
          const minRidership = Math.min(...predictedRider);

          // Define the hex color based on the predicted ridership
          geojsonLayer = L.geoJSON(data, {

            style: function (feature) {
              const ridership = feature.properties.prediction;
              // Convert the ridership value to a percentage of the range between min and max
              const percent = (ridership - minRidership) / (maxRidership - minRidership);
              // Calculate the red, green, and blue components of the fill color
              const r = Math.round(217 + 47 * percent);
              const g = Math.round(158 + 65 * (1 - percent));
              const b = 57;
              return {
                fillColor: `rgb(${r},${g},${b})`,
                fillOpacity: 0.6,
                color: "white",
                weight: 0.5,
              };
            },
            onEachFeature: function (feature, layer) {
              layer.on('mouseover', function (e) {
                layer.setStyle({
                  color: "#ffb545", // set boundary color to orange
                  weight: 5, // set boundary weight to 2
                  shadowBlur: 10, // add a shadow effect
                  shadowColor: "#000" // set shadow color to black
                });
                layer.openPopup(); // open popup on mouse hover
              });
              layer.on('mouseout', function (e) {
                geojsonLayer.resetStyle(layer); // reset layer style on mouse out
                layer.closePopup(); // close popup on mouse out
              });
              // Bind a popup to each hexagon displaying the name of the GeoJSON feature
              layer.bindPopup("Current Ridership: "+ Math.round(feature.properties.ridership)+"<br>Predicted Ridership: " + Math.round(feature.properties.prediction), {
                className: "my-popup-style"
              });
            }
            
          });
          geojsonLayer.addTo(map);
        })
        .catch(error => console.error(error));
    } else {
      map.removeLayer(geojsonLayer);
      addHexgrid(map, './data/final_hex.geojson');
    }
  });

  return map;
}



function jitterPlot(ridership, select, chartId, title) {
    const canvas = document.getElementById(chartId);
  
    const data = ridership.map((rider) => {
      return {
        x: Math.random() + 0.5,
        y: rider,
        color: rider === select ? 'orange' : 'rgba(255, 255, 255, 0.5)'
      }
    })
  
    const filteredData = data.filter((d) => d.y !== null);
    canvas.width = canvas.width * 0.25;
    canvas.height = canvas.height * 0.5;
    
    new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [
          {
            data: filteredData,
            borderColor: 'transparent',
            backgroundColor: filteredData.map(d => d.color),
            pointRadius: 2,
            pointHoverRadius: 5,
            pointHitRadius: 20,
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
            xAxes: [{
                ticks: {
                  display: false,
                  beginAtZero: true
                },
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  display: false,
                  callback: function (value) {
                    return value.toLocaleString();
                  },
                  fontColor: '#fff' // add this line to change the color of yAxes
                },
                gridLines: {
                  display: true
                }
              }]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return tooltipItem.yLabel.toLocaleString();
            }
          }
        },
        title: {
          display: true,
          text: title,
          fontColor:'#fff'
        }
      }
    });
  }
  

function racialChart(feature){

  const racialChartCanvas = document.getElementById('racialChartCanvas');

  racialChartCanvas.style.display = 'flex';
  racialChartCanvas.style.height = racialChartCanvas.style.height * 1.5;
  racialChartCanvas.style.width = racialChartCanvas.style.width * 0.5;

  // Remove the existing chart if there is one
  if (window.raceChart) {
    window.raceChart.destroy();
  }

  const whitePop = feature.properties.whitePop;
  const blackPop = feature.properties.blackPop;
  const asianPop = feature.properties.asianPop;
  const otherPop = feature.properties.totalPop - whitePop - blackPop - asianPop;

  const raceData = [whitePop, blackPop, asianPop, otherPop];
  const raceLabels = ['White', 'Black', 'Asian', 'Others'];

  window.raceChart = new Chart(racialChartCanvas, {
    type: 'bar',
    data: {
      labels: raceLabels,
      datasets: [{
        label: 'Race',
        data: raceData,
        backgroundColor: ['#ffb545', '#78938a', '#FAD02C', '#C0C0C0']
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Races Distribution',
        fontColor: '#fff'
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Population',
            fontColor: '#fff'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Race',
            fontColor: '#fff'
          }
        }]
      }
    }
  });
}
    


function pctCarChart(feature) {
  const carChartCanvas = document.getElementById('carChartCanvas');

  carChartCanvas.style.display = 'flex';
  carChartCanvas.style.height = carChartCanvas.style.height * 1.5;
  carChartCanvas.style.width = carChartCanvas.style.width * 0.5;
  
  // Check if the chart exists
  if (window.carChart) {
    // Destroy the chart if it exists
    window.carChart.destroy();
  }

  const carData = [
    feature.properties.pct0Car,
    feature.properties.pct1Car,
    feature.properties.pct2Car
  ];

  const carLabels = ['pct0Car', 'pct1Car', 'pct2Ca'];

  window.carChart = new Chart(carChartCanvas, {
    type: 'bar',
    data: {
      labels: carLabels,
      datasets: [{
        label: 'Pct Car Distribution',
        data: carData,
        backgroundColor: ['#ffb545', '#78938a', '#4A5899'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      legend: {
        labels: {
          fontColor: '#fff',
          fontSize: 8,
          boxWidth: 8,
          boxHeight: 8
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: "#fff",
            beginAtZero: true
          }
        }]
      }
    }
  });
}



function occupationChart(feature){

  const occupationData = [
      feature.properties.NAICS11,
      feature.properties.NAICS21,
      feature.properties.NAICS22,
      feature.properties.NAICS23,
      feature.properties.NAICS31_33,
      feature.properties.NAICS42,
      feature.properties.NAICS44_46,
      feature.properties.NAICS48_49,
      feature.properties.NAICS51,
      feature.properties.NAICS52,
      feature.properties.NAICS53,
      feature.properties.NAICS54,
      feature.properties.NAICS55,
      feature.properties.NAICS56,
      feature.properties.NAICS61,
      feature.properties.NAICS62,
      feature.properties.NAICS71,
      feature.properties.NAICS72,
      feature.properties.NAICS81,
      feature.properties.NAICS92
  ]

  const occupationLabels = [
      '11', 
      '21', 
      '22',
      '23', 
      '31_33', 
      '42',
      '44_46',
      '48_49', 
      '51', 
      '52',
      '53', 
      '54', 
      '55',
      '56', 
      '61', 
      '62',
      '71',
      '72', 
      '81', 
      '92',
  ];


  // Get the canvas element
  const occChartCanvas = document.getElementById('occChartCanvas');

  // Check if a chart already exists
  if (window.occupationChart) {
      window.occupationChart.destroy();
  }

  // Create the new chart
  window.occupationChart = new Chart(occChartCanvas, {
      type: 'bar',
      data: {
      labels: occupationLabels,
      datasets: [{
          data: occupationData,
          backgroundColor: [
              '#f7909f', '#e2647f', '#d1698c', '#e8555f', '#da332a', 
              '#fe672a', '#ff7a34', '#ffb22c', '#83ba69', '#4ca64e',
              '#2a897e', '#287f91', '#62b0dc', '#6492cb', '#4975c4', 
              '#3b4f93', '#32436f', '#5f5395', '#6f4483', '#5a3340']
      }]
      },
      options: {
          responsive: true,
          title: {
              display: true,
              text: 'NAICS Occupation distribution',
              fontColor: '#fff'
          },
          scales: {
              xAxes: [{
                  ticks: {
                      fontColor: '#fff'
                  }
              }],
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      fontColor: '#fff'
                  }
              }]
          },
          legend: {
              labels: {
                  fontColor: '#fff',
                  fontSize: 8,
                  boxWidth: 8,
                  boxHeight: 8
              }
          }
      }
      
  });

}


function amenitiesChart(feature){

    const amenitiesData = [
        feature.properties.bar,
        feature.properties.cafe,
        feature.properties.cinema,
        feature.properties.clinic,
        feature.properties.department_store,
        feature.properties.hospital,
        feature.properties.major_road,
        feature.properties.mall,
        feature.properties.park,
        feature.properties.restaurant,
        feature.properties.school,
        feature.properties.supermarket,
        feature.properties.worship
    ]

    const amenitiesLabels = [
        'bar', 
        'cafe', 
        'cinema',
        'clinic', 
        'department_store', 
        'hospital',
        'major_road',
        'mall', 
        'park', 
        'restaurant',
        'school', 
        'supermarket', 
        'worship'
    ];


    // Get the canvas element
    const ameChartCanvas = document.getElementById('ameChartCanvas');

    ameChartCanvas.style.display = 'flex';
    ameChartCanvas.style.height = ameChartCanvas.style.height * 1.5;
    ameChartCanvas.style.width = ameChartCanvas.style.width *2;
    // Check if a chart already exists
    if (window.amenitiesChart) {
        window.amenitiesChart.destroy();
    }

    // Create the new chart
    window.amenitiesChart = new Chart(ameChartCanvas, {
        type: 'bar',
        data: {
        labels: amenitiesLabels,
        datasets: [{
            data: amenitiesData,
            backgroundColor: [
                '#f7909f', '#e2647f', '#d1698c', '#e8555f', '#da332a', 
                '#fe672a', '#ff7a34', '#ffb22c', '#83ba69', '#4ca64e',
                '#2a897e', '#287f91', '#62b0dc']
        }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Amenities Counts',
                fontColor: '#fff'
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: '#fff'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: '#fff'
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: '#fff'
                }
            }
        }
        
    });

}




export {
    addHexLayer
};