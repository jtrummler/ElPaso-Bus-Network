

// Define a function to load the JSON file and return it as a promise
async function loadJsonFile(file) {
    const response = await fetch(file);
    const data = await response.json();
    return data;
  }
  
// Call the function to load the JSON file and store it in a variable
const ridershipData = await loadJsonFile('./data/ridership_joined.json');

const cuRidership = Object.values(ridershipData).map(d => d.ridership_per_stop_left);
  const preRidership = Object.values(ridershipData).map(d => d.pred_ridership_per_stop_left);
  const disability = Object.values(ridershipData).map(d => d.disability_left);
  const Income = Object.values(ridershipData).map(d => d.medHHInc_left);
  const aiPop = Object.values(ridershipData).map(d => d.aiPop_left);
  const asianPop = Object.values(ridershipData).map(d => d.asianPop_left);
  const blackPop = Object.values(ridershipData).map(d => d.blackPop_left);
  const otherRacePop = Object.values(ridershipData).map(d => d.otherRacePop_left);
  const empoyment = Object.values(ridershipData).map(d => d.employmentHHMix_left);


// open webpage, present the charts without highlights
function originChart(){
  jitterBox(cuRidership, 'current-ridership');
  jitterBox(preRidership, "predict-ridership");
  jitterBox(disability, 'Disability');
  jitterBox(Income, "HH-Income");
  jitterBox(empoyment, 'Jobs-HH');

  var raceLists = [];
  raceLists.push(aiPop);
  raceLists.push(blackPop);
  raceLists.push(asianPop);
  raceLists.push(otherRacePop);
  jitterBoxes(raceLists, "Races")

}

originChart();

// Get the selected route from the drop-down menu
const routesSelect = document.getElementById('routes-select');
console.log(routesSelect);

function removeCharts() {
  const singleCharts = document.querySelectorAll('.single-jitter');
  const multiCharts = document.querySelectorAll('.multi-jitter');

  singleCharts.forEach(chart => chart.remove());
  multiCharts.forEach(chart => chart.remove());
}

routesSelect.addEventListener('change', () => {
  // Remove all charts when the drop-down menu is selected
  removeCharts();
});


function getRouteData(dic, selector) {
  // Get the data for the barchart
  for (const key in dic) {
    if (key.toString() === selector) {
      return ridershipData[key];
    }
  }
}

const selectedRouteData = getRouteData(ridershipData, routesSelect);
console.log(selectedRouteData);


function updateChart(dic){
  const new_cuRidership = dic[ridership_per_stop_left];
  const new_preRidership = dic[pred_ridership_per_stop_left];
  const new_disability = dic[disability_left];
  const new_Income = dic[medHHInc_left];
  const new_aiPop = dic[aiPop_left];
  const new_asianPop = dic[asianPop_left];
  const new_blackPop = dic[blackPop_left];
  const new_otherRacePop = dic[otherRacePop_left];
  const new_empoyment = dic[employmentHHMix_left];

  new_jitterBox(cuRidership, 'current-ridership', new_cuRidership);

}




function jitterBox(list, id){
  var data = [
    {
      y: list,
      boxpoints: 'all',
      jitter: 0.3,
      pointpos: -1.8,
      type: 'box',
      marker: {
        size: 3,
        opacity: 0.5,
        color: '#fff'
      },
    }

  ];

  const layout = {
    xaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    font: {
      size: 8,
      color: '#fff'
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 180,
    width: 150
  }

  Plotly.newPlot(id, data, layout);

}

function jitterBoxes(lists, id){
  var xData = ['White', 'Black', 'Asian', 'Others'];
  var yData = lists;

  var data = [];

  for ( var i = 0; i < xData.length; i ++ ) {
      var result = {
          type: 'box',
          y: yData[i],
          name: xData[i],
          boxpoints: 'all',
          jitter: 0.5,
          whiskerwidth: 0.2,
          marker: {
            size: 3,
            opacity: 0.5,
            color: '#fff'
          },
          line: {
              width: 1
          }
      };
      data.push(result);
  };

  const layout = {
    xaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    font: {
      size: 8,
      color: '#fff'
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 180,
    width: 300,
    showlegend: false
  };

  Plotly.newPlot(id, data, layout);
}


// draw new charts by highlighting selected value
function new_jitterBox(list, id, hightlight){
  var data = [
    {
      y: list,
      boxpoints: 'all',
      jitter: 0.3,
      pointpos: -1.8,
      type: 'box',
      marker: {
        size: 3,
        opacity: 0.5,
        color: '#fff'
      },
    }

  ];

  const layout = {
    xaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    font: {
      size: 8,
      color: '#fff'
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 180,
    width: 150,
    shapes: [
      {
        type: 'line',
        x0: -0.5,
        y0: hightlight,
        x1: 0.5,
        y1: hightlight,
        line: {
          color: 'orange',
          width: 2,
          dash: 'dashdot'
        }
      }
    ]
  }

  Plotly.newPlot(id, data, layout);

}

function new_jitterBoxes(lists, id){
  var xData = ['White', 'Black', 'Asian', 'Others'];
  var yData = lists;

  var data = [];

  for ( var i = 0; i < xData.length; i ++ ) {
      var result = {
          type: 'box',
          y: yData[i],
          name: xData[i],
          boxpoints: 'all',
          jitter: 0.5,
          whiskerwidth: 0.2,
          marker: {
            size: 3,
            opacity: 0.5,
            color: '#fff'
          },
          line: {
              width: 1
          }
      };
      data.push(result);
  };

  const layout = {
    xaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      titlefont: {
        size: 8,
        color: '#fff'
      },
      tickfont: {
        size: 8,
        color: '#fff'
      }
    },
    font: {
      size: 8,
      color: '#fff'
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    autosize: true,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 180,
    width: 300,
    showlegend: false,
    shapes: [
      {
        type: 'line',
        x0: -0.5,
        y0: hightlight,
        x1: 0.5,
        y1: hightlight,
        line: {
          color: 'orange',
          width: 2,
          dash: 'dashdot'
        }
      }
    ]
  };

  Plotly.newPlot(id, data, layout);
}

export { ridershipData };
