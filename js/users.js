$(function () {
    // Initialize DataTable
    var table = $("#users").DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#users_wrapper .col-md-6:eq(0)');

    // Event listener for User Type filter
    $('#userTypeFilter').on('change', function () {
        var selectedValue = $(this).val();

        // Custom filter for the User Type column (assuming it's the 3rd column, index 2)
        if (selectedValue) {
            table.column(2).search('^' + selectedValue + '$', true, false).draw();
        } else {
            table.column(2).search('').draw();
        }
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
        var userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            var row = document.createElement('tr');
            row.setAttribute('data-id', user.user_id);

            row.innerHTML = `
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
            `;

            userTableBody.appendChild(row);
        });

        // Redraw the DataTable to ensure the data is loaded and filters work
        table.draw();
    }
});
