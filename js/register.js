document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const registrationTokenElement = document.getElementById('registration-token');
    const registerForm = document.getElementById('registerForm');
    const registrationStatus = document.getElementById('registrationStatus');
    const redirectLogin = document.getElementById('redirectLogin');

    if (token) {
        registrationTokenElement.textContent = token;
    } else {
        registrationStatus.textContent = 'Invalid or missing registration token.';
        registrationStatus.style.color = 'red';
        registerForm.style.display = 'none';
        return;
    }

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const formData = new FormData(registerForm);
        const password = formData.get('password');
        const confirmpassword = formData.get('confirmpassword');

        // Check if passwords match
        if (password !== confirmpassword) {
            registrationStatus.textContent = 'Passwords do not match.';
            registrationStatus.style.color = 'red';
            return;
        }

        // Collect form data into an object
        const data = {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            password: password,
            confirmpassword: confirmpassword,
            token: token
        };

        console.log('Submitting registration data:', data);

        // Send registration data to the server
        fetch('/registerUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(result => {
            console.log('Server response:', result);
            if (result.success) {
                registrationStatus.textContent = 'Registration successful!';
                registrationStatus.style.color = 'green';

                // Create a link to the login page
                const loginLink = document.createElement('a');
                loginLink.href = '/login';
                loginLink.textContent = 'here';
                loginLink.style.textDecoration = 'underline';
                loginLink.style.color = '#007bff';

                redirectLogin.innerHTML = 'Login to IkanMeter with your new account ';
                redirectLogin.appendChild(loginLink);
                redirectLogin.innerHTML += '.';

                registerForm.reset();
            } else {
                registrationStatus.textContent = 'Registration failed: ' + result.message;
                registrationStatus.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error during registration:', error);
            registrationStatus.textContent = 'An error occurred. Please try again later.';
            registrationStatus.style.color = 'red';
        });
    });
});
