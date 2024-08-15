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
                `<div class="row align-items-center justify-content-center">
                    <button type="button" class="au-btn--users">
                        <i class="zmdi zmdi-edit editUserBtn"></i>
                    </button> &nbsp; &nbsp;
                    <button type="button" class="au-btn--users">
                        <i class="zmdi zmdi-delete deleteUserBtn"></i>
                    </button>
                </div>`
            ]).draw();
        });
    }

    // Close modals when clicking outside or on close button
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        };
    });

    // Existing code for add user modal and link generation
    const modal = document.getElementById('addUserModal');
    const addUserBtn = document.getElementById('addUserBtn');
    const closeBtn = document.getElementById('closeAddUserModal');
    const generateLinkBtn = document.getElementById('generateLinkBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const generatedLinkArea = document.getElementById('generatedLinkArea');
    const generatedLink = document.getElementById('generatedLink');
    const expiryDaysInput = document.getElementById('expiryDays');
    const roleRadios = document.getElementsByName('role');

    // Show the modal
    addUserBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Disable scrolling
    });

    // Close the modal and reset form
    function closeModalAndReset() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
        // Reset form fields here
        expiryDaysInput.value = '';
        generatedLinkArea.style.display = 'none';
        generatedLink.value = '';
        // Uncheck radio buttons
        roleRadios.forEach(radio => {
            radio.checked = false;
        });
    }

    // Close the modal on close button click
    closeBtn.addEventListener('click', closeModalAndReset);

    // Close the modal if user clicks outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModalAndReset();
        }
    });

    // Generate link button click
    generateLinkBtn.addEventListener('click', function() {
        const expiryDays = expiryDaysInput.value;
        const selectedRole = document.querySelector('input[name="role"]:checked');
    
        if (!expiryDays || !selectedRole) {
            alert('Please fill in all fields.');
            return;
        }
    
        const role = selectedRole.value;
        
        // Use async/await to handle the promise
        (async function() {
            try {
                const link = await generateLink(expiryDays, role); // Await the promise
                generatedLink.value = link;
                generatedLinkArea.style.display = 'block';
            } catch (error) {
                alert('Failed to generate link.');
            }
        })();
    });

    // Copy link to clipboard
    copyLinkBtn.addEventListener('click', function() {
        generatedLink.select();
        document.execCommand('copy');
        alert('Link copied to clipboard.');
    });

    // Function to generate the link
    async function generateLink(expiryDays, role) {
        const token = generateToken();
        
        try {
            const response = await fetch('/generateLink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, expiryDays, role })
            });
            const data = await response.json();
            if (data.success) {
                const baseUrl = window.location.origin;
                return `${baseUrl}/Register?token=${token}`;
            } else {
                throw new Error('Failed to generate link.');
            }
        } catch (error) {
            console.error('Error generating link:', error);
            throw error;
        }
    }

    // Function to generate a unique token
    function generateToken() {
        return Math.random().toString(36).substr(2, 9); // Simple token generation (you may want to use a more secure method)
    }
    
});
