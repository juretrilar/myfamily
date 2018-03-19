var ctx = document.getElementById('myChart').getContext('2d');
let pageWidth = $(document).width();
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota", "Nedelja"],
        datasets: [{
            label: "Število korakov",
            borderColor: 'rgb(255, 255, 255)',
            data: [505, 434, 876, 2656, 1643, 946, 1207],
            pointRadius: 8,
            pointHoverRadius: 10,
            backgroundColor: 'rgb(63,81,181)'
        }]
    },

    // Configuration options go here
    options: {
        legend: {
            labels: {
                fontColor: 'rgb(255, 255, 255)'
            }
        },
        scales: {
            yAxes: [{
                ticks:{
                    fontColor : "#fff",
                },
                gridLines:{
                    color: "rgba(0,0,0,0)",
                },
            }],
            xAxes: [{
                ticks:{
                    fontColor : "#fff",
                },
                gridLines:{
                    color: "rgba(0,0,0,0)",
                }
            }]
        },
        responsive:true,
        maintainAspectRatio: false,
        chartArea: {
            backgroundColor: 'rgba(251, 85, 85, 0.8)'
        }
    }
});
if (pageWidth < 600) {
    updateConfigAsNewObject(chart);
    console.log("manjse");
}

function updateConfigAsNewObject(chart) {
    chart.options = {
        legend: {
            labels: {
                fontColor: 'rgb(255, 255, 255)'
            }
        },
        responsive:true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks:{
                    fontColor : "#fff",
                },
                gridLines:{
                    color: "rgba(0,0,0,0)",
                },
            }],
            xAxes: [{
                ticks:{
                    display: false,
                },
                gridLines:{
                    color: "rgba(0,0,0,0)",
                }
            }]
        },
        chartArea: {
            backgroundColor: 'rgba(251, 85, 85, 0.4)'
        }
    };
    chart.update();
}



