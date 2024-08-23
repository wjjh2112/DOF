document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData) {
        // Control dashboard based on user organization
        if (userData.userOrg === 'DOF') {
            document.getElementById('DOF-history').style.display = 'block';
        }
        else if (userData.userOrg === 'Penang Institute') {
            document.getElementById('PenangInstitute-history').style.display = 'block';
        }
        
    } 
});

$(function () {
    // Initialize Date Range Picker
    $('#penDateRangePicker').daterangepicker({
      opens: 'left',
      locale: {
        format: 'DD/MM/YYYY',
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        weekLabel: 'W',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        firstDay: 1
      },
      autoUpdateInput: false
    });
  
    // Handle Apply button click on Date Range Picker
    $('#penDateRangePicker').on('apply.daterangepicker', function (ev, picker) {
      $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
      fetchDataAndUpdateTable();
    });
  
    // Handle Cancel button click on Date Range Picker
    $('#penDateRangePicker').on('cancel.daterangepicker', function (ev, picker) {
      $(this).val('');
      fetchDataAndUpdateTable();
    });
  
    // Handle Dropdown change
    $('#dropdownPenLogger').on('change', function () {
      fetchDataAndUpdateTable();
    });
  
    // Fetch Data and Update Table
    function fetchDataAndUpdateTable() {
      const tankValue = $('#dropdownPenLogger').val();
      const dateRange = $('#penDateRangePicker').val();
      const tank = mapDropdownValueToTank(tankValue);
  
      let startDate = '';
      let endDate = '';
  
      if (dateRange) {
        const dates = dateRange.split(' - ');
        startDate = moment(dates[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
        endDate = moment(dates[1], 'DD/MM/YYYY').format('YYYY-MM-DD');
      }
  
      if (tank) {
        const doLogger = `${tank}_DO`;
        const phLogger = `${tank}_PH`;
        fetchTableData(doLogger, startDate, endDate);
        fetchTableData(phLogger, startDate, endDate);
      } else {
        ['PEN1', 'PEN2', 'PEN3'].forEach((tank) => {
          fetchTableData(`${tank}_DO`, startDate, endDate);
          fetchTableData(`${tank}_PH`, startDate, endDate);
        });
      }
    }
  
    // Fetch data from server and update table
    async function fetchTableData(logger, startDate, endDate) {
      const url = `/api/data?logger=${logger}&startDate=${startDate}&endDate=${endDate}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        updateTable(data, logger);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    // Function to update table
    function updateTable(data, logger) {
      const tableBody = $('#penHistory');
      tableBody.empty(); // Clear existing table rows
  
      data.forEach((entry) => {
        const row = `
          <tr>
            <td>${logger.split('_')[0]}</td>
            <td>${moment(entry.timestamp).format('DD/MM/YYYY')}</td>
            <td>${moment(entry.timestamp).format('HH:mm:ss')}</td>
            <td>${entry.payload}</td>
            <td>${entry.payload}</td> <!-- Assuming DO and pH data is stored similarly, adjust as needed -->
          </tr>
        `;
        tableBody.append(row);
      });
  
      // Display "No records found" message if no data is available
      if (data.length === 0) {
        tableBody.append('<tr><td colspan="5" style="text-align: center;">No records found</td></tr>');
      }
    }
  
    // Initial call to fetch data on page load
    fetchDataAndUpdateTable();
  });
  