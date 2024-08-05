// Function to generate initial dummy data
function generateInitialData() {
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
  
// Initialize the real time Dissolved Oxygen line chart
function initializeLineChart(ctx, initialData) {
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
  
// Initialize the current temperature gauge
function initializeTemperatureGauge(initialTemp) {
    return new JustGage({
        id: "pH-gauge",
        value: initialTemp,
        min: 6.0,
        max: 9.0,
        title: "pH Value",
        label: "Value",
        gaugeWidthScale: 0.6,
        decimals: 2,
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
  
    const newTemp = 7.30 + Math.random() * 0.60 // Generate new temperature between 7.30 and 7.90
    chart.data.datasets[0].data.push(newTemp);
    chart.data.datasets[0].data.shift();
  
    chart.update();
    gauge.refresh(newTemp);
}
  
// Main function to initialize everything
document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById("realtimePH").getContext("2d");
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
        const minPH = [];
        const maxPH = [];

        for (let date = new Date(weekStart); date <= weekEnd; date.setDate(date.getDate() + 1)) {
            labels.push(date.toLocaleDateString('en-GB').slice(0, 5)); // Compact date format
            minPH.push(7.36); // Dummy data
            maxPH.push(7.68); // Dummy data
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
                        label: 'Min pH Value',
                        data: minPH,
                        backgroundColor: 'rgba(72, 160, 255, 0.8)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Max pH Value',
                        data: maxPH,
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
                            suggestedMin: 7.40,
                            suggestedMax:7.89
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
        const minPH = [];
        const maxPH = [];
    
        let date = new Date(monthStart);
        
        while (date < nextMonthStart) {
            const endDate = new Date(date);
            endDate.setDate(date.getDate() + 6);
            if (endDate >= nextMonthStart) {
                endDate.setDate(nextMonthStart.getDate() - 1);
            }
    
            weeklyLabels.push(`${date.toLocaleDateString('en-GB').slice(0, 5)} - ${endDate.toLocaleDateString('en-GB').slice(0, 5)}`);
            
            const minPHForWeek = 7.42; // Replace with actual calculation
            const maxPHForWeek = 7.78; // Replace with actual calculation
            
            minPH.push(minPHForWeek);
            maxPH.push(maxPHForWeek);
    
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
                        label: 'Min pH Value',
                        data: minPH,
                        backgroundColor: 'rgba(72, 160, 255, 0.8)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Max pH Value',
                        data: maxPH,
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
                            suggestedMin: 7.40,
                            suggestedMax:7.89
                        }
                    }]
                }
            }
        });
    
        document.getElementById('monthly-header').textContent = `${monthStart.toLocaleDateString('default', { month: 'long' })} ${monthStart.getFullYear()}`;
    }
    
    function displayYearlyChart() {
        const labels = [];
        const minPH = [];
        const maxPH = [];

        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(currentYear, month, 1);
            labels.push(monthStart.toLocaleString('default', { month: 'long' }));
            minPH.push(7.40); // Dummy data
            maxPH.push(7.72); // Dummy data
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
                        label: 'Min pH Value',
                        data: minPH,
                        backgroundColor: 'rgba(72, 160, 255, 0.8)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Max pH Value',
                        data: maxPH,
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
                            suggestedMin: 7.40,
                            suggestedMax:7.89
                        }
                    }]
                }
            }
        });

        document.getElementById('yearly-header').textContent = `Year ${currentYear}`;
    }
});
