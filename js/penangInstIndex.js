// Dissolved Oxygen
function initializePenDOLineChart(ctx, initialData) {
    const data = {
        labels: initialData.labels,
        datasets: [{
            label: "Dissolved Oxygen (mg/L)",
            borderColor: "rgba(0, 192, 239)",
            borderWidth: 1,
            backgroundColor: "rgba(102, 217, 245, 0.7)",
            data: initialData.values, // changed from initialData.initialData to initialData.values
        }]
    };
  
    const options = {
        legend: {
            position: 'top',
            labels: {
                fontFamily: 'Poppins'
            }
        },
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontFamily: "Poppins"
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0.0,
                    max: 7.0, // Adjust as necessary
                    fontFamily: "Poppins"
                }
            }]
        }
    };
  
    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// PH Value
function initializePenPHLineChart(ctx, initialData) {
    const data = {
        labels: initialData.labels,
        datasets: [{
            label: "pH Value",
            borderColor: "rgba(0, 192, 239)",
            borderWidth: 1,
            backgroundColor: "rgba(102, 217, 245, 0.7)",
            data: initialData.values, // changed from initialData.initialData to initialData.values
        }]
    };
  
    const options = {
        legend: {
            position: 'top',
            labels: {
                fontFamily: 'Poppins'
            }
        },
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontFamily: "Poppins"
                }
            }],
            yAxes: [{
                ticks: {
                    min: 0.0,
                    max: 8.0, // Adjust as necessary
                    fontFamily: "Poppins"
                }
            }]
        }
    };
  
    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

async function fetchDataAndUpdateChart(chart, currentElement, logger) {
    try {
        const response = await fetch(`/api/data/${logger}`);
        const data = await response.json();

        const labels = data.map(item => {
            const time = new Date(item.timestamp);
            return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        });

        const payloadData = data.map(item => item.payload); // Make sure 'payload' is correct

        chart.data.labels = labels;
        chart.data.datasets[0].data = payloadData;
        chart.update();

        currentElement.textContent = payloadData[payloadData.length - 1].toFixed(2);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const doCtx = document.getElementById("realtimePenDO").getContext("2d");
    const doChart = initializePenDOLineChart(doCtx, { labels: [], values: [] });
    const doElement = document.getElementById("penDO");

    const phCtx = document.getElementById("realtimePenPH").getContext("2d");
    const phChart = initializePenPHLineChart(phCtx, { labels: [], values: [] });
    const phElement = document.getElementById("penPH");

    const dropdownLogger = document.getElementById("dropdownPenLogger");

    async function fetchAndDisplayData() {
        const tank = dropdownLogger.value;
        const doLogger = tank + "_DO";
        const phLogger = tank + "_PH";

        // Fetch and update DO data
        await fetchDataAndUpdateChart(doChart, doElement, doLogger);
        // Fetch and update PH data
        await fetchDataAndUpdateChart(phChart, phElement, phLogger);
    }

    dropdownLogger.addEventListener("change", fetchAndDisplayData);

    // Initial fetch
    fetchAndDisplayData();

    // Update every 1 minute
    setInterval(fetchAndDisplayData, 60000);
});