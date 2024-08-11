$(function () {
    // Initialize DataTable
    const table = $("#users").DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#users_wrapper .col-md-6:eq(0)');

    // Initialize Select2 for the user type filter
    $('#usertype-filter').select2();

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

        // Rebuild DataTable with new data
        table.clear().rows.add(userTableBody.querySelectorAll('tr')).draw();

        // Attach event listeners for edit and delete buttons
        attachEventListeners();
    }

    // Function to attach event listeners to the edit and delete buttons
    function attachEventListeners() {
        // Add your event listener logic here for edit and delete buttons
    }

    // Event listener for the user type filter
    $('#usertype-filter').on('change', function () {
        const selectedUserType = $(this).val();

        // Filter the DataTable based on selected user type
        if (selectedUserType) {
            table.column(2).search(selectedUserType).draw();
        } else {
            table.column(2).search('').draw();
        }
    });
});
