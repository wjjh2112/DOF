// Dissolved Oxygen
// Function to generate initial dummy data
function generatePenDOInitialData() {
    const initialData = [];
    const labels = [];
    const now = new Date();
  
    for (let i = 0; i < 10; i++) {
        const time = new Date(now.getTime() - (9 - i) * 60 * 1000);
        const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        labels.push(formattedTime);
        initialData.push(4.30 + Math.random() * 2.58);  // Values between 4.30 and 6.88
    }
  
    return { labels: labels, initialData: initialData };
}
  
// Initialize the real time Dissolved Oxygen line chart
function initializePenDOLineChart(ctx, initialData) {
    const data = {
        labels: initialData.labels,
        datasets: [{
            label: "Dissolved Oxygen (mg/L)",
            borderColor: "rgba(0,123,255,255)",
            borderWidth: 1,
            backgroundColor: "rgba(77, 163, 255, 0.7)",
            data: initialData.initialData,
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
                    max: 7.0,
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
// Function to generate initial dummy data
function generatePenPHInitialData() {
    const initialData = [];
    const labels = [];
    const now = new Date();
  
    for (let i = 0; i < 10; i++) {
        const time = new Date(now.getTime() - (9 - i) * 60 * 1000);
        const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        labels.push(formattedTime);
        initialData.push(7.30 + Math.random() * 0.60);  // Values between 7.30 and 7.90
    }
  
    return { labels: labels, initialData: initialData };
}
  
// Initialize the real time pH line chart
function initializePenPHLineChart(ctx, initialData) {
    const data = {
        labels: initialData.labels,
        datasets: [{
            label: "pH Value",
            borderColor: "rgba(0,123,255,255)",
            borderWidth: 1,
            backgroundColor: "rgba(77, 163, 255, 0.7)",
            data: initialData.initialData,
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
                    max: 8.0,
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
function updatePenPHChartAndCurrent(chart, currentElement) {
    const now = new Date();
    const newTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    chart.data.labels.push(newTime);
    chart.data.labels.shift();
  
    const newPenPH = 7.30 + Math.random() * 0.60; // Generate new pH value between 7.30 and 7.90
    chart.data.datasets[0].data.push(newPenPH);
    chart.data.datasets[0].data.shift();
  
    chart.update();
    currentElement.textContent = newPenPH.toFixed(2); // Update the displayed value
}

// Main function to initialize everything
document.addEventListener("DOMContentLoaded", function() {
    // Initialize Dissolved Oxygen chart
    const doCtx = document.getElementById("realtimePenDO").getContext("2d");
    const doInitialData = generatePenDOInitialData();
    const doChart = initializePenDOLineChart(doCtx, doInitialData);
    const doElement = document.getElementById("penDO");
    doElement.textContent = doInitialData.initialData[doInitialData.initialData.length - 1].toFixed(2);

    setInterval(() => updatePenDOChartAndCurrent(doChart, doElement), 60000);  // Update every 1 minute

    // Initialize pH chart
    const phCtx = document.getElementById("realtimePenPH").getContext("2d");
    const phInitialData = generatePenPHInitialData();
    const phChart = initializePenPHLineChart(phCtx, phInitialData);
    const phElement = document.getElementById("penPH");
    phElement.textContent = phInitialData.initialData[phInitialData.initialData.length - 1].toFixed(2);

    setInterval(() => updatePenPHChartAndCurrent(phChart, phElement), 60000);  // Update every 1 minute

    // Update the logger name based on selected logger from dropdown
    const dropdownLogger = document.getElementById("dropdownLogger");
    const loggerDisplay = document.getElementById("logger");

    // Set initial logger value
    loggerDisplay.textContent = dropdownLogger.value;

    // Update logger when dropdown selection changes
    dropdownLogger.addEventListener("change", function() {
        loggerDisplay.textContent = this.value;
    });
});