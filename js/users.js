$(document).ready(function () {
    // Initialize DataTable for users-table
    var table = $('#users-table').DataTable({
        responsive: true,
        lengthChange: false,
        autoWidth: false,
        searching: true,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"]
    });

    // Initialize Select2 for the user type filter dropdown
    $('#usertype-filter').select2({
        placeholder: "Select user type",
        allowClear: true
    });

    // Event listener for user type filter change
    $('#usertype-filter').on('change', function () {
        var selectedUserType = $(this).val();
        table.column(2).search(selectedUserType).draw();  // Assuming the usertype is in the 3rd column (index 2)
    });

    // Reset filter when 'All Users' is selected (cleared)
    $('#usertype-filter').on('select2:clear', function () {
        table.column(2).search('').draw();  // Clear the search on user type column
    });

    // Fetch users from the server and populate the table
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            // Populate the table with users
            populateTable(users);
        })
        .catch(error => console.error('Error fetching users:', error));

    // Function to populate the table with users
    function populateTable(users) {
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            const row = document.createElement('tr');
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

        // Re-draw the DataTable after adding new rows
        table.draw();
    }
});
