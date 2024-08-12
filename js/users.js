$(document).ready(function () {
    // Initialize DataTable
    var table = $('#users-table').DataTable({
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        searching: true,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        columnDefs: [
            { targets: 2, searchable: true } // Ensure the user type column is searchable
        ]
    });

    // Append buttons to the specified container
    table.buttons().container().appendTo('#users-table_wrapper .col-md-6:eq(0)');

    // Initialize Select2 for the user type filter dropdown
    $('#usertype-filter').select2({
        placeholder: "Select a user type",
        allowClear: true
    });

    // Event listener for user type filter change
    $('#usertype-filter').on('change', function () {
        var selectedUserType = $(this).val();
        table.column(2).search(selectedUserType).draw(); // Filter on the 3rd column (user type)
    });

    // Reset filter when 'All Users' is selected (cleared)
    $('#usertype-filter').on('select2:clear', function () {
        table.column(2).search('').draw();
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
        table.clear().draw(); // Clear existing data

        users.forEach(user => {
            table.row.add([
                user.user_id,
                `<div class="table-data__info">
                    <h4>${user.firstname} ${user.lastname}</h4>
                    <span><a href="#">${user.email}</a></span>
                </div>`,
                user.usertype,
                `<span class="more">
                    <i class="zmdi zmdi-edit editUserBtn"></i>
                </span>
                <span class="more">
                    <i class="zmdi zmdi-delete deleteUserBtn"></i>
                </span>`
            ]).draw();
        });
    }
});
