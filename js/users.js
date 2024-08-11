$(function () {
    const table = $("#users").DataTable({
        "responsive": true, 
        "lengthChange": false, 
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#users_wrapper .col-md-6:eq(0)');

    // Fetch users from the server
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            // Populate the table with users
            populateTable(users);
        })
        .catch(error => console.error('Error fetching users:', error));

    // Function to populate the table with users
    document.addEventListener('DOMContentLoaded', function() {
        const userTableBody = document.getElementById('userTableBody');
    
        function populateTable(users) {
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

            // Initialize Select2 for the dropdown
            $('#usertype-filter').select2();

            // Apply filter when user type is selected
            $('#usertype-filter').on('change', function () {
                var selectedUserType = $(this).val();
                table.column(2).search(selectedUserType).draw(); // Filter by user type
            });

            // Reset filter when 'All Categories' is selected
            $('#category-filter').on('select2:clear', function () {
                table.column(3).search('').draw();
            });

            // Attach event listeners for edit and delete buttons
            attachEventListeners();
        }

        // Function to attach event listeners to the edit and delete buttons
        function attachEventListeners() {
            // Add your event listener logic here for edit and delete buttons
        }
    });
});
