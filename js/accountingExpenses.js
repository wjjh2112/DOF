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
                                max: 1000,
                                callback: function(value, index, values) {
                                    return 'RM' + value;
                                }
                            }
                        }]
                    },
                    plugins: {
                        backgroundColor: '#ffffff'
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
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                let label = data.labels[tooltipItem.index] || '';
                                let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return label + ': RM' + value;
                            }
                        }
                    },
                    plugins: {
                        backgroundColor: '#ffffff'
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

// Bar Chart Buttons
document.getElementById('downloadBarChart').addEventListener('click', () => {
    const canvas = document.getElementById('barChart');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'barChart.png';
    link.click();
});

document.getElementById('printBarChart').addEventListener('click', () => {
    const canvas = document.getElementById('barChart');
    const printWindow = window.open('', '', 'height=500,width=700');
    printWindow.document.write('<html><head><title>Print Chart</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<img src="' + canvas.toDataURL('image/png') + '" />');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});


// Function to export data to CSV
function exportToCSV(chart) {
    const csvData = [];
    const labels = chart.data.labels;
    const datasets = chart.data.datasets;

    // Add header
    csvData.push(['Month', 'Value']);

    // Add data rows
    datasets.forEach((dataset, i) => {
        dataset.data.forEach((data, index) => {
            csvData.push([labels[index], data]);
        });
    });

    // Convert to CSV and download
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chart-data.csv';
    link.click();
}

// Function to export data to Excel
function exportToExcel(chart) {
    const worksheet = XLSX.utils.json_to_sheet(chart.data.datasets[0].data.map((data, i) => ({
        Category: chart.data.labels[i],
        Value: data
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'chart-data.xlsx');
}

// Example of adding export buttons for data
document.getElementById('exportBarCSV').addEventListener('click', () => exportToCSV(window.myBarChart));
document.getElementById('exportBarExcel').addEventListener('click', () => exportToExcel(window.myBarChart));



// Pie Chart Buttons
document.getElementById('downloadPieChart').addEventListener('click', () => {
    const canvas = document.getElementById('pieChart');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pieChart.png';
    link.click();
});

document.getElementById('printPieChart').addEventListener('click', () => {
    const canvas = document.getElementById('pieChart');
    const printWindow = window.open('', '', 'height=500,width=700');
    printWindow.document.write('<html><head><title>Print Chart</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<img src="' + canvas.toDataURL('image/png') + '" />');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});

// Function to export pie chart data to CSV
function exportPieChartToCSV(chart) {
    const csvData = [];
    const labels = chart.data.labels;
    const datasets = chart.data.datasets[0].data;

    // Add header
    csvData.push(['Category', 'Value']);

    // Add data rows
    labels.forEach((label, index) => {
        csvData.push([label, datasets[index]]);
    });

    // Convert to CSV and download
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pie-chart-data.csv';
    link.click();
}

// Function to export pie chart data to Excel
function exportPieChartToExcel(chart) {
    const worksheet = XLSX.utils.json_to_sheet(chart.data.labels.map((label, i) => ({
        Category: label,
        Value: chart.data.datasets[0].data[i]
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'pie-chart-data.xlsx');
}

// Example of adding export button for pie chart data
document.getElementById('exportPieExcel').addEventListener('click', () => exportPieChartToExcel(window.myPieChart));

// Example of adding export button for pie chart data
document.getElementById('exportPieCSV').addEventListener('click', () => exportPieChartToCSV(window.myPieChart));
