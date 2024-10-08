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
                    max: 9.0, // Adjust as necessary
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
                    max: 9.0, // Adjust as necessary
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

        // Map and reverse the labels and payload data
        const labels = data.map(item => {
            const time = new Date(item.timestamp);
            return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        }).reverse();  // Reverse the labels array

        const payloadData = data.map(item => item.payload).reverse();  // Reverse the data array

        // Update the chart labels and data
        chart.data.labels = labels;
        chart.data.datasets[0].data = payloadData;
        chart.update();

        // Update the current value displayed with the latest value
        const latestValue = payloadData[payloadData.length - 1];
        currentElement.textContent = latestValue ? latestValue.toFixed(2) : "N/A";
    } catch (error) {
        console.error('Error fetching data:', error);
        currentElement.textContent = "Error";
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
    const penLoggerElement = document.getElementById("penLogger");

    function mapDropdownValueToTank(value) {
        switch (value) {
            case 'Tank 1':
                return 'PEN1';
            case 'Tank 2':
                return 'PEN2';
            case 'Tank 3':
                return 'PEN3';
            default:
                return '';
        }
    }

    async function fetchAndDisplayData() {
        const dropdownValue = dropdownLogger.value;
        const tank = mapDropdownValueToTank(dropdownValue);

        if (tank) {
            const doLogger = `${tank}_DO`;
            const phLogger = `${tank}_PH`;

            penLoggerElement.textContent = dropdownValue;

            // Fetch and update DO data
            await fetchDataAndUpdateChart(doChart, doElement, doLogger);
            // Fetch and update PH data
            await fetchDataAndUpdateChart(phChart, phElement, phLogger);
        }
    }

    $('#dropdownPenLogger').change(fetchAndDisplayData);

    // Initial fetch
    fetchAndDisplayData();

    // Update every 1 minute
    setInterval(fetchAndDisplayData, 60000);
});
