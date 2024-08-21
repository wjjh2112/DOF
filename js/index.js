document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData) {
        // Control dashboard based on user organization
        if (userData.userOrg === 'DOF') {
            document.getElementById('DOF-dashboard').style.display = 'block';
        }
        else if (userData.userOrg === 'Penang Institute') {
            document.getElementById('PenangInstitute-dashboard').style.display = 'block';
        }
        
    } else {
        // Redirect to login page if user data is not found
        window.location.href = '/login';
    }
});

