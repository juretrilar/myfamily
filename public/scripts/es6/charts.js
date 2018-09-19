$.ajax({
    url: '/api/get_koraki/',//+$("#trenutniUporabnik").val(),
    type: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    success: function(response){
        console.log(response);
        var ctx = document.getElementById('myChart').getContext('2d');
        //let pageWidth = $(document).width();
        console.log("making chart");
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: ["Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota", "Nedelja"],
                datasets: [{
                    label: "Število korakov",
                    borderColor: 'rgb(255, 255, 255)',
                    data: response,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    backgroundColor: 'rgb(54, 157, 156)'
                }]
            },
        
            // Configuration options go here
            options: {
                legend: {
                    labels: {
                        fontColor: 'rgb(68, 88, 112)'
                    }
                },
                scales: {
                    yAxes: [{
                        ticks:{
                            fontColor : "#445870",
                        },
                        gridLines:{
                            color: "rgba(0,0,0,0)",
                        },
                    }],
                    xAxes: [{
                        ticks:{
                            fontColor : "#445870",
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
    },
    error: function(response, jqXhr, textStatus, errorThrown){            
        console.log(jqXhr, textStatus, errorThrown, response);
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



