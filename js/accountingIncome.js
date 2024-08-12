// Data Table and Filter Script
$(document).ready(function () {
    // Initialize DataTable with options and buttons
    var table = $('#income-table').DataTable({
        responsive: true, 
        lengthChange: false, 
        autoWidth: false, 
        searching: true,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"]
    });

    // Append buttons to the specified container
    table.buttons().container().appendTo('#income-table_wrapper .col-md-6:eq(0)');

    // Initialize Select2 for the category filter dropdown
    $('#category-filter').select2({
        placeholder: "Select a category",
        allowClear: true
    });

    // Event listener for category filter change
    $('#category-filter').on('change', function () {
        var selectedCategory = $(this).val();
        table.column(3).search(selectedCategory).draw();
    });

    // Reset filter when 'All Categories' is selected (cleared)
    $('#category-filter').on('select2:clear', function () {
        table.column(3).search('').draw();
    });

    // Fetch and populate the table with income records from the database
    fetch('/get-income-records')
        .then(response => response.json())
        .then(data => {
            // Populate the table with data
            populateTable(data);
        })
        .catch(error => console.error('Error fetching income records:', error));

    function populateTable(data) {
        table.clear().draw(); // Clear existing data
            
        data.forEach(record => {
            table.row.add([
                record.incomeRecDateTime,
                record.incomeAmount,
                record.incomeItem,
                record.incomeCategory,
                record.remarks || '-',
                `<a href="/View-Income-Record?id=${record.incomeID}">View</a>`
            ]).draw();
        });
    }
});

// Bar Chart Script
$(function () {
    const ctx = $('#barChart').get(0).getContext('2d');
    let currentYear = new Date().getFullYear();

    const parseIncomeTable = () => {
        const data = {};
        // Parse all rows, not just the displayed ones
        $('#income-table').DataTable().rows().every(function () {
            const row = $(this.node());
            const amount = parseFloat(row.find('td').eq(1).text().replace('$', '').trim());
            const date = row.find('td').eq(0).text().trim();  // Updated index for date column
            const [day, month, year] = date.split('/').map(Number);

            if (!data[year]) data[year] = Array(12).fill(0);
            data[year][month - 1] += amount;
        });
        return data;
    };

    const incomeData = parseIncomeTable();

    const updateChart = (year) => {
        if (!incomeData[year]) {
            alert(`No data available for ${year}`);
            return;
        }

        const barChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: `Income in ${year}`,
                backgroundColor: 'rgba(60,141,188,0.9)',
                borderColor: 'rgba(60,141,188,0.8)',
                data: incomeData[year]
            }]
        };

        if (window.myBarChart) {
            window.myBarChart.destroy();
        }

        window.myBarChart = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: `Income for ${year}`,
                    fontSize: 18,
                    fontColor: '#333'
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 12,
                        fontColor: '#666'
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 1000 // Fixed y-axis maximum value
                        }
                    }]
                }
            }
        });
    };

    $('#prevYear').click(() => {
        currentYear--;
        updateChart(currentYear);
    });

    $('#nextYear').click(() => {
        currentYear++;
        updateChart(currentYear);
    });

    updateChart(currentYear);  // Initialize with the current year data
});

// Pie Chart Script
$(function () {
    const ctxPie = $('#pieChart').get(0).getContext('2d');
    let currentYear = new Date().getFullYear();

    const parseIncomeTable = () => {
        const data = {};

        // Parse all rows, not just the displayed ones
        $('#income-table').DataTable().rows().every(function () {
            const row = $(this.node());
            const amount = parseFloat(row.find('td').eq(1).text().replace('$', '').trim());
            const date = row.find('td').eq(0).text().trim();  // Updated index for date column
            const category = row.find('td').eq(3).text().trim();  // Updated index for category column
            const [day, month, year] = date.split('/').map(Number);

            if (!data[year]) data[year] = {};
            if (!data[year][category]) data[year][category] = 0;
            data[year][category] += amount;
        });
        return data;
    };

    const incomeData = parseIncomeTable();

    const getYearlyPieData = (year) => {
        const yearlyData = incomeData[year];
        if (!yearlyData) {
            alert(`No data available for ${year}`);
            return null;
        }

        const categories = Object.keys(yearlyData);
        const amounts = categories.map(cat => yearlyData[cat]);

        const pieChartData = {
            labels: categories,
            datasets: [{
                backgroundColor: [
                    '#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc',
                    '#d2d6de', '#8a6d3b', '#605ca8', '#78c2ad', '#b66353'
                ],  // Colors for each category
                data: amounts
            }]
        };

        return pieChartData;
    };

    const updatePieChart = (year) => {
        const pieData = getYearlyPieData(year);

        if (!pieData) return;

        if (window.myPieChart) {
            window.myPieChart.destroy();
        }

        window.myPieChart = new Chart(ctxPie, {
            type: 'pie',
            data: pieData,
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: {
                    display: true,
                    text: `Income Categories for ${year}`,
                    fontSize: 18,
                    fontColor: '#333'
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontSize: 12,
                        fontColor: '#666'
                    }
                }
            }
        });
    };

    $('#prevYearPie').click(() => {
        currentYear--;
        updatePieChart(currentYear);
    });

    $('#nextYearPie').click(() => {
        currentYear++;
        updatePieChart(currentYear);
    });

    // Initial load with current year data
    updatePieChart(currentYear);
});
