$(document).ready(function () {
    // Initialize DataTable with options and buttons
    var table = $('#expense-table').DataTable({
        responsive: true, 
        lengthChange: false, 
        autoWidth: false, 
        searching: true,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"]
    });

    // Append buttons to the specified container
    table.buttons().container().appendTo('#expense-table_wrapper .col-md-6:eq(0)');

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

    // Fetch and populate the table with expense records from the database
    fetch('/get-expense-records')
        .then(response => response.json())
        .then(data => {
            // Populate the table with data
            populateTable(data);
            // Update charts with new data
            updateExpenseCharts(data);
        })
        .catch(error => console.error('Error fetching expense records:', error));

    function populateTable(data) {
        table.clear().draw(); // Clear existing data
            
        data.forEach(record => {
            const formattedDate = new Date(record.expRecDateTime).toLocaleDateString('en-GB');
            const formattedAmount = `RM${record.expenseAmount}`;

            table.row.add([
                formattedDate,
                formattedAmount,
                record.expenseItem,
                record.expCategory,
                record.remarks || '-',
                `<a href="/View-Expense-Record?id=${record.expenseID}">View</a>`
            ]).draw();
        });
    }

    function updateExpenseCharts(data) {
        const parseExpenseData = () => {
            const dataByYear = {};
            data.forEach(record => {
                const amount = parseFloat(record.expenseAmount);
                const date = new Date(record.expRecDateTime);
                const year = date.getFullYear();
                const month = date.getMonth();

                if (!dataByYear[year]) dataByYear[year] = Array(12).fill(0);
                dataByYear[year][month] += amount;
            });
            return dataByYear;
        };

        const expenseData = parseExpenseData();

        const updateBarChart = (year) => {
            if (!expenseData[year]) {
                alert(`No data available for ${year}`);
                return;
            }

            const barChartData = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [{
                    label: `Expenses in ${year}`,
                    backgroundColor: 'rgba(60,141,188,0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    data: expenseData[year]
                }]
            };

            if (window.myBarChart) {
                window.myBarChart.destroy();
            }

            window.myBarChart = new Chart($('#barChart'), {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: `Expenses for ${year}`,
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

        const updatePieChart = (year) => {
            const pieData = {};
            data.forEach(record => {
                const amount = parseFloat(record.expenseAmount);
                const date = new Date(record.expRecDateTime);
                const yearRecord = date.getFullYear();
                const category = record.expCategory;

                if (!pieData[yearRecord]) pieData[yearRecord] = {};
                if (!pieData[yearRecord][category]) pieData[yearRecord][category] = 0;
                pieData[yearRecord][category] += amount;
            });

            const yearlyData = pieData[year];
            if (!yearlyData) {
                alert(`No data available for ${year}`);
                return;
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

            if (window.myPieChart) {
                window.myPieChart.destroy();
            }

            window.myPieChart = new Chart($('#pieChart'), {
                type: 'pie',
                data: pieChartData,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    title: {
                        display: true,
                        text: `Expenses Categories for ${year}`,
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

        let currentYear = new Date().getFullYear();

        $('#prevYear').click(() => {
            currentYear--;
            updateBarChart(currentYear);
        });

        $('#nextYear').click(() => {
            currentYear++;
            updateBarChart(currentYear);
        });

        $('#prevYearPie').click(() => {
            currentYear--;
            updatePieChart(currentYear);
        });

        $('#nextYearPie').click(() => {
            currentYear++;
            updatePieChart(currentYear);
        });

        updateBarChart(currentYear);
        updatePieChart(currentYear);
    }
});
