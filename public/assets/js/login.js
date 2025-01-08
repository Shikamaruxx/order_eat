document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Gather form data
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    // Client-side validation
    if (!formData.email || !formData.password) {
        alert('Please fill in all required fields!');
        return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
        alert('Invalid email format!');
        return;
    }

    // Send data to server if validation passes
    axios.post('/login', formData)
        .then(response => {
            if (response.status === 200) {
                alert('Login successful!');
                window.location.href = '/'; // Redirect to dashboard or home page
            } else {
                alert('Unexpected response: ' + response.data.message || 'Please try again.');
            }
        })
        .catch(error => {
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'Login failed. Please try again.'}`);
            } else if (error.request) {
                alert('No response from the server. Please check your internet connection.');
            } else {
                alert(`Error: ${error.message}`);
            }
        });
});

// Helper function to validate email format
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
