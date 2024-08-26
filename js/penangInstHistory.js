$(function() {
    // Initialize Date Range Picker
    $('#penDateRangePicker').daterangepicker({
        opens: 'left',
        locale: {
            format: 'YYYY-MM-DD',
            separator: ' - ',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            weekLabel: 'W',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        },
        autoUpdateInput: false
    });

    function fetchDataAndDisplayTable() {
        const tank = $('#dropdownPenLogger').val();
        const dateRange = $('#penDateRangePicker').val();
        let startDate = '';
        let endDate = '';

        if (dateRange) {
            const dates = dateRange.split(' - ');
            startDate = dates[0];
            endDate = dates[1];
        }

        $.ajax({
            url: '/api/data',
            method: 'GET',
            data: {
                tank: mapDropdownValueToTank(tank),
                startDate: startDate,
                endDate: endDate
            },
            success: function(data) {
                console.log('Data received from server:', data);
                const tbody = $('#penHistoryBody');
                tbody.empty(); // Clear existing rows

                if (data.length === 0) {
                    tbody.append('<tr><td colspan="5" style="text-align: center;">No records found</td></tr>');
                } else {
                    data.forEach(record => {
                        const date = moment(record.timestamp).format('DD/MM/YYYY');
                        const time = moment(record.timestamp).format('HH:mm:ss');
                        const tankName = record.collection.split('_')[0]; // Extract 'PEN1', 'PEN2', etc.

                        tbody.append(`
                            <tr>
                                <td>${tankName}</td>
                                <td>${date}</td>
                                <td>${time}</td>
                                <td>${record.payload}</td>
                                <td>${record.payload}</td>
                            </tr>
                        `);
                    });
                }
            },
            error: function(err) {
                console.error('Error fetching data:', err);
            }
        });
    }

    // Event listeners for dropdown and date range picker
    $('#dropdownPenLogger').change(fetchDataAndDisplayTable);
    $('#penDateRangePicker').on('apply.daterangepicker', fetchDataAndDisplayTable);
    $('#penDateRangePicker').on('cancel.daterangepicker', function() {
        $(this).val('');
        fetchDataAndDisplayTable();
    });

    // Fetch data on page load
    fetchDataAndDisplayTable();
});
