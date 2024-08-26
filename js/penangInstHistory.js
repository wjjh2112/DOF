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

    // Helper function to map dropdown value to tank identifier
    function mapDropdownValueToTank(dropdownValue) {
        switch (dropdownValue) {
            case 'Tank 1':
                return 'PEN1';
            case 'Tank 2':
                return 'PEN2';
            case 'Tank 3':
                return 'PEN3';
            case 'All Tanks':
            default:
                return '';  // Return empty to indicate all tanks
        }
    }

    // Helper function to map tank identifier to device ID (if needed)
    function mapTankToDeviceID(tankID) {
        switch (tankID) {
            case 'PEN1_DO':
            case 'PEN1_PH':
                return 'Tank 1';
            case 'PEN2_DO':
            case 'PEN2_PH':
                return 'Tank 2';
            case 'PEN3_DO':
            case 'PEN3_PH':
                return 'Tank 3';
        }
    }

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
                        const row = `
                            <tr>
                                <td>${mapTankToDeviceID(record._id)}</td>
                                <td>${date}</td>
                                <td>${time}</td>
                                <td>${record.payload}</td>
                                <td>${record.payload}</td>
                            </tr>
                        `;
                        tbody.innerHTML += row;
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
