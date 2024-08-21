// Dissolved Oxygen
// Function to generate initial dummy data
function generateDOInitialData() {
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
function initializeDOLineChart(ctx, initialData) {
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
                    min: 4.0,
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
function updateDOChartAndCurrent(chart, currentElement) {
    const now = new Date();
    const newTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    chart.data.labels.push(newTime);
    chart.data.labels.shift();
  
    const newDO = 4.30 + Math.random() * 2.58; // Generate new dissolved oxygen value between 4.30 and 6.88
    chart.data.datasets[0].data.push(newDO);
    chart.data.datasets[0].data.shift();
  
    chart.update();
    currentElement.textContent = newDO.toFixed(2); // Update the displayed value
}

// PH Value
// Function to generate initial dummy data
function generatePHInitialData() {
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
function initializePHLineChart(ctx, initialData) {
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
                    min: 7.2,
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
function updatePHChartAndCurrent(chart, currentElement) {
    const now = new Date();
    const newTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    chart.data.labels.push(newTime);
    chart.data.labels.shift();
  
    const newPH = 7.30 + Math.random() * 0.60; // Generate new pH value between 7.30 and 7.90
    chart.data.datasets[0].data.push(newPH);
    chart.data.datasets[0].data.shift();
  
    chart.update();
    currentElement.textContent = newPH.toFixed(2); // Update the displayed value
}

// Main function to initialize everything
document.addEventListener("DOMContentLoaded", function() {
    // Initialize Dissolved Oxygen chart
    const doCtx = document.getElementById("realtimeDO").getContext("2d");
    const doInitialData = generateDOInitialData();
    const doChart = initializeDOLineChart(doCtx, doInitialData);
    const doElement = document.getElementById("do");
    doElement.textContent = doInitialData.initialData[doInitialData.initialData.length - 1].toFixed(2);
  
    setInterval(() => updateDOChartAndCurrent(doChart, doElement), 60000);  // Update every 1 minute

    // Initialize pH chart
    const phCtx = document.getElementById("realtimePH").getContext("2d");
    const phInitialData = generatePHInitialData();
    const phChart = initializePHLineChart(phCtx, phInitialData);
    const phElement = document.getElementById("ph");
    phElement.textContent = phInitialData.initialData[phInitialData.initialData.length - 1].toFixed(2);
  
    setInterval(() => updatePHChartAndCurrent(phChart, phElement), 60000);  // Update every 1 minute
});
