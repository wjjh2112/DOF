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

// Update the chart and current with new generated dummy data
function updatePenDOChartAndCurrent(chart, currentElement) {
    const now = new Date();
    const newTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    chart.data.labels.push(newTime);
    chart.data.labels.shift();
  
    const newPenDO = 4.30 + Math.random() * 2.58; // Generate new dissolved oxygen value between 4.30 and 6.88
    chart.data.datasets[0].data.push(newPenDO);
    chart.data.datasets[0].data.shift();
  
    chart.update();
    currentElement.textContent = newPenDO.toFixed(2); // Update the displayed value
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

    dropdownLogger.addEventListener("change", function() {
        const logger = dropdownLogger.value;
        fetchDataAndUpdateChart(logger.includes('DO') ? doChart : phChart, logger.includes('DO') ? doElement : phElement, logger);
    });

    // Initial fetch
    fetchDataAndUpdateChart(doChart, doElement, dropdownLogger.value.includes('DO') ? dropdownLogger.value : 'PEN1_DO');
    fetchDataAndUpdateChart(phChart, phElement, dropdownLogger.value.includes('PH') ? dropdownLogger.value : 'PEN1_PH');

    // Update every 1 minute
    setInterval(() => fetchDataAndUpdateChart(doChart, doElement, dropdownLogger.value.includes('DO') ? dropdownLogger.value : 'PEN1_DO'), 60000);
    setInterval(() => fetchDataAndUpdateChart(phChart, phElement, dropdownLogger.value.includes('PH') ? dropdownLogger.value : 'PEN1_PH'), 60000);
});
