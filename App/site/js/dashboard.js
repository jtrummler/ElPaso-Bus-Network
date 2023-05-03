
// Define a function to load the JSON file and return it as a promise
async function loadJsonFile(file) {
    const response = await fetch(file);
    const data = await response.json();
    return data;
  }
  
// Call the function to load the JSON file and store it in a variable
const ridershipData = await loadJsonFile('./data/ridership_joined.json');

console.log(ridershipData);


const cuRidership = Object.values(ridershipData).map(d => d.ridership_per_stop_left);
const preRidership = Object.values(ridershipData).map(d => d.pred_ridership_per_stop_left);
const disability = Object.values(ridershipData).map(d => d.disability_left);
const Income = Object.values(ridershipData).map(d => d.medHHInc_left);
const aiPop = Object.values(ridershipData).map(d => d.aiPop_left);
const asianPop = Object.values(ridershipData).map(d => d.asianPop_left);
const blackPop = Object.values(ridershipData).map(d => d.blackPop_left);
const otherRacePop = Object.values(ridershipData).map(d => d.otherRacePop_left);
const empoyment = Object.values(ridershipData).map(d => d.employmentHHMix_left);

var raceLists = [];
  raceLists.push(aiPop);
  raceLists.push(blackPop);
  raceLists.push(asianPop);
  raceLists.push(otherRacePop);


// open webpage, present the charts without highlights
function originChart(){
  jitterBox(cuRidership, 'current-ridership');
  jitterBox(preRidership, "predict-ridership");
  jitterBox(disability, 'Disability');
  jitterBox(Income, "HH-Income");
  jitterBox(empoyment, 'Jobs-HH');
  jitterBoxes(raceLists, "Races");

}

originChart();

// // Get the selected route from the drop-down menu
// const routesSelect = document.getElementById('routes-select');
// console.log(routesSelect);


function removeCharts() {
  // const singleCharts = document.querySelectorAll('.single-jitter');
  // const multiCharts = document.querySelectorAll('.multi-jitter');

  // singleCharts.forEach(chart => chart.remove());
  // multiCharts.forEach(chart => chart.remove());
  // const chart = document.querySelectorAll('.jitter-content');
  // chart.forEach(chart => chart.remove());
}

// routesSelect.addEventListener('change', () => {
//   // Remove all charts when the drop-down menu is selected
//   removeCharts();
// });


function updateChart(selected){
  // Remove all charts when the drop-down menu is selected
  // removeCharts();

  const dic = ridershipData[selected];

  console.log(ridershipData);
  console.log(selected);
  console.log(dic);
  
  const new_cuRidership = dic['ridership_per_stop_left'];
  const new_preRidership = dic['pred_ridership_per_stop_left'];
  const new_disability = dic['disability_left'];
  const new_Income = dic['medHHInc_left'];
  const new_aiPop = dic['aiPop_left'];
  const new_asianPop = dic['asianPop_left'];
  const new_blackPop = dic['blackPop_left'];
  const new_otherRacePop = dic['otherRacePop_left'];
  const new_empoyment = dic['employmentHHMix_left'];

  new_jitterBox(cuRidership, 'current-ridership', new_cuRidership);
  new_jitterBox(preRidership, 'predict-ridership', new_preRidership);
  new_jitterBox(disability, 'Disability', new_disability);
  new_jitterBox(Income, "HH-Income", new_Income);
  new_jitterBox(empoyment, 'Jobs-HH', new_empoyment);
  new_jitterBoxes(raceLists, "Races", new_aiPop, new_blackPop, new_asianPop, new_otherRacePop);


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
        size: 10,
        color: '#fff'
      },
      tickangle: 0,  // Optional: rotate the tick labels for better visibility
      automargin: true  // Optional: automatically adjust margins to fit labels
    },
    yaxis: {
      autorange: true,
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
      size: 12,
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
    height: 175,
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
          width: 4
        }
      }
    ]
  }

  Plotly.newPlot(id, data, layout);

}

function new_jitterBoxes(lists, id, hightlight1, hightlight2, hightlight3, hightlight4){
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
        size: 10,
        color: '#fff'
      },
      tickangle: 0,  // Optional: rotate the tick labels for better visibility
      automargin: true  // Optional: automatically adjust margins to fit labels
    },
    yaxis: {
      autorange: true,
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
      size: 12,
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
    height: 175,
    width: 300,
    showlegend: false,
    shapes: [
      {
        type: 'line',
        x0: -0.5,
        y0: hightlight1,
        x1: 0.25,
        y1: hightlight1,
        line: {
          color: 'orange',
          width: 4
        }
      },
      {
        type: 'line',
        x0: 0.5,
        y0: hightlight2,
        x1: 1.25,
        y1: hightlight2,
        line: {
          color: 'orange',
          width: 4
        }
      },
      {
        type: 'line',
        x0: 1.5,
        y0: hightlight3,
        x1: 2.25,
        y1: hightlight3,
        line: {
          color: 'orange',
          width: 4
        }
      },
      {
        type: 'line',
        x0: 2.5,
        y0: hightlight4,
        x1: 3.25,
        y1: hightlight4,
        line: {
          color: 'orange',
          width: 4
        }
      }
    ]
  };

  Plotly.newPlot(id, data, layout);
}

function updateChartByImport(importData){

  console.log(importData[0].aiPopPct);

  const new_cuRidership = importData[0].ridership_per_stop;
  const new_preRidership = importData[0].pred_ridership_per_stop;
  const new_disability = importData[0].disability;
  const new_Income = importData[0].medHHInc;
  const new_aiPop = importData[0].aiPopPct;
  const new_asianPop = importData[0].asianPopPct;
  const new_blackPop = importData[0].blackPopPct;
  const new_otherRacePop = importData[0].otherRacePopPct;
  const new_empoyment = importData[0].employmentHHMix;

  new_jitterBox(cuRidership, 'current-ridership', new_cuRidership);
  new_jitterBox(preRidership, 'predict-ridership', new_preRidership);
  new_jitterBox(disability, 'Disability', new_disability);
  new_jitterBox(Income, "HH-Income", new_Income);
  new_jitterBox(empoyment, 'Jobs-HH', new_empoyment);
  new_jitterBoxes(raceLists, "Races", new_aiPop, new_blackPop, new_asianPop, new_otherRacePop);
}

export { 
  ridershipData, 
  updateChart, 
  updateChartByImport};
