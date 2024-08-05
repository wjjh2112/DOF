// Function to generate initial dummy data
function generateInitialData() {
    const initialData = [];
    const labels = [];
    const now = new Date();
  
    for (let i = 0; i < 10; i++) {
        const time = new Date(now.getTime() - (9 - i) * 60 * 1000);
        const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
        labels.push(formattedTime);
        initialData.push(13100.0000 + Math.random() * 300.0000);  // Values between 13100.0000 and 13400.0000
    }
  
    return { labels: labels, initialData: initialData };
}
  
// Initialize the real time Dissolved Oxygen line chart
function initializeLineChart(ctx, initialData) {
    const data = {
        labels: initialData.labels,
        datasets: [{
        label: "Salinity (ppm)",
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
                min: 13000.0000,
                max: 13500.0000,
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
  
// Initialize the current temperature gauge
function initializeTemperatureGauge(initialTemp) {
    return new JustGage({
        id: "salinity-gauge",
        value: initialTemp,
        min: 12000.0000,
        max: 14000.0000,
        title: "Salinity (ppm)",
        label: "ppm",
        gaugeWidthScale: 0.6,
        decimals: 4,
        gaugeColor: "#f0f0f0", // background color of the gauge
        levelColors: ["#59de59", "#fffb00", "#f03737"] // colors for different ranges
    });
}
  
// Update the chart and gauge with new generated dummy data
function updateChartAndGauge(chart, gauge) {
    const now = new Date();
    const newTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
    chart.data.labels.push(newTime);
    chart.data.labels.shift();
  
    const newTemp = 13100.0000 + Math.random() * 300.0000 // Generate new temperature between 13100.0000 and 13400.0000
    chart.data.datasets[0].data.push(newTemp);
    chart.data.datasets[0].data.shift();
  
    chart.update();
    gauge.refresh(newTemp);
}
  
// Main function to initialize everything
document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById("realtimeSalinity").getContext("2d");
    const initialData = generateInitialData();
    const myChart = initializeLineChart(ctx, initialData);
  
    // Initialize the gauge with the first temperature value
    const initialTemp = initialData.initialData[initialData.initialData.length - 1];
    const myGauge = initializeTemperatureGauge(initialTemp);
  
    setInterval(() => updateChartAndGauge(myChart, myGauge), 60000);  // Update every 1 minute
});


// Temperature Extremes Bar Chart
document.addEventListener('DOMContentLoaded', function() {
    const weeklyChartCtx = document.getElementById('weekly-chart').getContext('2d');
    const monthlyChartCtx = document.getElementById('monthly-chart').getContext('2d');
    const yearlyChartCtx = document.getElementById('yearly-chart').getContext('2d');
    
    let weeklyChart, monthlyChart, yearlyChart;
    let currentWeek = new Date();
    let currentMonth = new Date();
    let currentYear = new Date().getFullYear();

    document.getElementById('prev-week').addEventListener('click', () => navigateWeek(-1));
    document.getElementById('next-week').addEventListener('click', () => navigateWeek(1));
    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));
    document.getElementById('prev-year').addEventListener('click', () => navigateYear(-1));
    document.getElementById('next-year').addEventListener('click', () => navigateYear(1));

    // Initialize the charts
    displayWeeklyChart();
    displayMonthlyChart();
    displayYearlyChart();

    function navigateWeek(offset) {
        currentWeek.setDate(currentWeek.getDate() + offset * 7);
        displayWeeklyChart();
    }

    function navigateMonth(offset) {
        currentMonth.setMonth(currentMonth.getMonth() + offset);
        displayMonthlyChart();
    }

    function navigateYear(offset) {
        currentYear += offset;
        displayYearlyChart();
    }

    function displayWeeklyChart() {
        const weekStart = new Date(currentWeek);
        weekStart.setDate(currentWeek.getDate() - currentWeek.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const labels = [];
        const minSalinity = [];
        const maxSalinity = [];

        for (let date = new Date(weekStart); date <= weekEnd; date.setDate(date.getDate() + 1)) {
            labels.push(date.toLocaleDateString('en-GB').slice(0, 5)); // Compact date format
            minSalinity.push(13134.6720); // Dummy data
            maxSalinity.push(13398.0456); // Dummy data
        }

        if (weeklyChart) {
            weeklyChart.destroy();
        }

        weeklyChart = new Chart(weeklyChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Min Salinity',
                        data: minSalinity,
                        backgroundColor: 'rgba(72, 160, 255, 0.8)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Max Salinity',
                        data: maxSalinity,
                        backgroundColor: 'rgba(243, 93, 93, 0.8)',
                        stack: 'Stack 0'  // Same stack to ensure stacking
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            suggestedMin: 13130.3894,
                            suggestedMax:13353.1002
                        }
                    }]
                }
            }
        });

        document.getElementById('weekly-header').textContent = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    }

    function displayMonthlyChart() {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const nextMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    
        const weeklyLabels = [];
        const minSalinity = [];
        const maxSalinity = [];
    
        let date = new Date(monthStart);
        
        while (date < nextMonthStart) {
            const endDate = new Date(date);
            endDate.setDate(date.getDate() + 6);
            if (endDate >= nextMonthStart) {
                endDate.setDate(nextMonthStart.getDate() - 1);
            }
    
            weeklyLabels.push(`${date.toLocaleDateString('en-GB').slice(0, 5)} - ${endDate.toLocaleDateString('en-GB').slice(0, 5)}`);
            
            const minSalinityForWeek = 13173.8231; // Replace with actual calculation
            const maxSalinityForWeek = 13396.7821; // Replace with actual calculation
            
            minSalinity.push(minSalinityForWeek);
            maxSalinity.push(maxSalinityForWeek);
    
            date.setDate(endDate.getDate() + 1);
        }
    
        if (monthlyChart) {
            monthlyChart.destroy();
        }
    
        monthlyChart = new Chart(monthlyChartCtx, {
            type: 'bar',
            data: {
                labels: weeklyLabels,
                datasets: [
                    {
                        label: 'Min Salinity',
                        data: minSalinity,
                        backgroundColor: 'rgba(72, 160, 255, 0.8)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Max Salinity',
                        data: maxSalinity,
                        backgroundColor: 'rgba(243, 93, 93, 0.8)',
                        stack: 'Stack 0'  // Same stack to ensure stacking
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function(value) {
                                return value.split(' - ')[0] + ' - ' + value.split(' - ')[1];
                            }
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            suggestedMin: 13130.3894,
                            suggestedMax:13353.1002
                        }
                    }]
                }
            }
        });
    
        document.getElementById('monthly-header').textContent = `${monthStart.toLocaleDateString('default', { month: 'long' })} ${monthStart.getFullYear()}`;
    }
    
    function displayYearlyChart() {
        const labels = [];
        const minSalinity = [];
        const maxSalinity = [];

        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(currentYear, month, 1);
            labels.push(monthStart.toLocaleString('default', { month: 'long' }));
            minSalinity.push(13234.8321); // Dummy data
            maxSalinity.push(13452.4352); // Dummy data
        }

        if (yearlyChart) {
            yearlyChart.destroy();
        }

        yearlyChart = new Chart(yearlyChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Min Salinity',
                        data: minSalinity,
                        backgroundColor: 'rgba(72, 160, 255, 0.8)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Max Salinity',
                        data: maxSalinity,
                        backgroundColor: 'rgba(243, 93, 93, 0.8)',
                        stack: 'Stack 0'  // Same stack to ensure stacking
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            suggestedMin: 13130.3894,
                            suggestedMax:13353.1002
                        }
                    }]
                }
            }
        });

        document.getElementById('yearly-header').textContent = `Year ${currentYear}`;
    }
});
