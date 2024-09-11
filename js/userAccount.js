document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData) {
        // Control visibility based on user type
        if (userData.usertype === 'Viewer') {
            document.getElementById('sidebar-users-item').style.display = 'none';
            document.getElementById('mobile-users-item').style.display = 'none';
        }

        if (userData.userOrg === 'Penang Institute') {
            document.getElementById('sidebar-dof-accounting').style.display = 'none';
            document.getElementById('mobile-dof-accounting').style.display = 'none';
        }
        


        
    } else {
        // Redirect to login page if user data is not found
        window.location.href = '/login';
    }

    // Logout functionality for mobile and sidebar
    ['logoutBtnMobile', 'logoutBtnSidebar'].forEach(id => {
        const logoutBtn = document.getElementById(id);
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior

                // Clear sessionStorage
                sessionStorage.removeItem('userData');

                // Redirect to login page
                window.location.href = '/login';
            });
        }
    });
});
