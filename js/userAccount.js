document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (!userData) {
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
