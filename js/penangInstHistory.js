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

    // Event listeners for dropdown and date range picker
    // $('#dropdownPenLogger').change(fetchDataAndDisplayTable);
    // $('#penDateRangePicker').on('apply.daterangepicker', fetchDataAndDisplayTable);
    // $('#penDateRangePicker').on('cancel.daterangepicker', function() {
    //     $(this).val('');
    //     fetchDataAndDisplayTable();
    // });

    // // Fetch data on page load
    // fetchDataAndDisplayTable();
});
