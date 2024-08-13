document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    if (userData) {
        // Populate user profile fields
        document.getElementById('firstNameInput').value = userData.firstname;
        document.getElementById('lastNameInput').value = userData.lastname;
        document.getElementById('emailInput').value = userData.email;
    } else {
        // Redirect to login page if user data is not found
        window.location.href = '/login';
    }
});
