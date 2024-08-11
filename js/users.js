$(function () {
    const table = $("#users").DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#users_wrapper .col-md-6:eq(0)');

    // Initialize Select2 for enhanced multi-select
    $('#userTypeFilter').select2({
        placeholder: 'Select user types',
        allowClear: true
    });

    // Fetch users from the server
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            // Populate the table with users
            populateTable(users);
        })
        .catch(error => console.error('Error fetching users:', error));

    // Function to populate the table with users
    function populateTable(users) {
        const userTableBody = $('#userTableBody');
        userTableBody.empty(); // Clear existing rows

        users.forEach(user => {
            const row = $('<tr>')
                .attr('data-id', user.user_id)
                .append(`
                    <td><p>${user.user_id}</p></td>
                    <td>
                        <div class="table-data__info">
                            <h4>${user.firstname} ${user.lastname}</h4>
                            <span><a href="#">${user.email}</a></span>
                        </div>
                    </td>
                    <td><p>${user.usertype}</p></td>
                    <td class="text-center">
                        <span class="more">
                            <i class="zmdi zmdi-edit editUserBtn"></i>
                        </span>
                        <span class="more">
                            <i class="zmdi zmdi-delete deleteUserBtn"></i>
                        </span>
                    </td>
                `);
            userTableBody.append(row);
        });

        // Attach event listeners for edit and delete buttons
        attachEventListeners();
    }

    // Function to attach event listeners to the edit and delete buttons
    function attachEventListeners() {
        // Add your event listener logic here for edit and delete buttons
    }

    // Custom filter function for DataTables
    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        const selectedTypes = $('#userTypeFilter').val();
        const userType = data[2]; // User Type is in the third column (index 2)

        if (selectedTypes === null || selectedTypes.length === 0 || selectedTypes.includes('all')) {
            return true; // Show all rows if no filter is selected or "All Users" is selected
        }

        return selectedTypes.includes(userType);
    });

    // Filter table on change
    $('#userTypeFilter').on('change', function() {
        table.draw();
    });
});
