document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Gather form data
    const formData = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        sex: document.getElementById('sex').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        birthday: document.getElementById('birthday').value,
        address: document.querySelector('input[placeholder="Address"]').value,
    };

    // Client-side validation
    if (!formData.firstname || !formData.lastname || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword || !formData.birthday || !formData.address) {
        alert('Please fill in all required fields!');
        return;
    }

    // Check first and last name for invalid characters (no digits or special characters)
    if (/[^a-zA-Z ]/.test(formData.firstname) || /[^a-zA-Z ]/.test(formData.lastname)) {
        alert('First and Last names must contain only letters and spaces!');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
        alert('Invalid email format!');
        return;
    }

    // Check if phone contains only digits
    if (!/^\d+$/.test(formData.phone)) {
        alert('Phone number must contain only digits!');
        return;
    }

    // Address validation: only letters, numbers, spaces, dots, commas, and dashes are allowed
    if (/[^a-zA-Z0-9.,\- ]/.test(formData.address)) {
        alert('Address contains invalid characters! Only letters, numbers, spaces, dots, commas, and dashes are allowed.');
        return;
    }

    // Send data to server if validation passes
    axios.post('/register', formData)
        .then(response => {
            if (response.status === 200) {
                alert('Registration successful!');
                window.location.href = '/login'; // Redirect to login page
            } else {
                alert('Unexpected response: ' + response.data.message || 'Please try again.');
            }
        })
        .catch(error => {
            if (error.response) {
                alert(`Error: ${error.response.data.message || 'Registration failed. Please try again.'}`);
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
