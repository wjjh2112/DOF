$(document).ready(function () {
    // Initialize DataTable
    var table = $('#income-table').DataTable({
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        searching: true,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"]
    });

    // Append buttons to the specified container
    table.buttons().container().appendTo('#income-table_wrapper .col-md-6:eq(0)');

    // Fetch income data from the server
    $.getJSON('/incomes', function (data) {
        // Populate the table
        data.forEach(function (income) {
            const date = new Date(income.incomeRecDateTime).toLocaleDateString();
            const amount = '$' + income.incomeAmount.toFixed(2);
            const item = income.incomeItem;
            const category = income.incomeCategory;
            const remarks = income.remarks || '';

            const viewRecordButton = '<button class="btn btn-primary view-record" data-id="' + income.incomeID + '">View</button>';

            // Append the row to the table
            table.row.add([date, amount, item, category, remarks, viewRecordButton]).draw();
        });
        
        // Initialize Select2 for category filtering
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

        // Bar Chart Initialization (after table is populated)
        initBarChart();
    });
});

function initBarChart() {
    const ctx = $('#barChart').get(0).getContext('2d');
    let currentYear = new Date().getFullYear();

    const parseIncomeTable = () => {
        const data = {};
        $('#income-table').DataTable().rows().every(function () {
            const row = $(this.node());
            const amount = parseFloat(row.find('td').eq(1).text().replace('$', '').trim());
            const date = row.find('td').eq(0).text().trim();
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
                            max: 1000 
                        }
                    }]
                }
            }
        });
    };

    updateChart(currentYear);

    $('#year-filter').on('change', function () {
        const selectedYear = parseInt($(this).val(), 10);
        updateChart(selectedYear);
    });
}
