$(document).ready(function () {
    // Initialize DataTable and store the instance
    var table = $('#users').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#users_wrapper .col-md-6:eq(0)');

    // Initialize Select2 for the filter dropdown
    $('#usertype-filter').select2();

    // Fetch users from the server and populate the table
    fetch('/users')
        .then(response => response.json())
        .then(users => {
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
                <td>${user.user_id}</td>
                <td>
                    <div class="table-data__info">
                        <h4>${user.firstname} ${user.lastname}</h4>
                        <span><a href="#">${user.email}</a></span>
                    </div>
                </td>
                <td>${user.usertype}</td>
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

        // Re-initialize DataTable after populating
        table.rows().invalidate().draw();

        // Attach filtering to the usertype filter dropdown
        $('#usertype-filter').on('change', function () {
            var selectedType = $(this).val();
            if (selectedType) {
                table.column(2).search('^' + selectedType + '$', true, false).draw();
            } else {
                table.column(2).search('').draw();
            }
        });
    }

    // Function to attach event listeners to the edit and delete buttons
    function attachEventListeners() {
        // Add your event listener logic here for edit and delete buttons
    }
});
