document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');
    const logoutButton = document.getElementById('logout');
    const usernameSpan = document.getElementById('username');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Persist theme preference across page reloads
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }

    // Theme toggle with debounce
    let themeToggleTimeout;
    themeToggle.addEventListener('click', () => {
        clearTimeout(themeToggleTimeout);
        themeToggleTimeout = setTimeout(() => {
            body.classList.toggle('dark');
            localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
        }, 300); // Adjust delay as needed
    });

    // Signup form handling
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value; // Matching ID for signup form
            const password = document.getElementById('password').value; // Matching ID for signup form

            try {
                const response = await fetch('/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();
                messageDiv.textContent = result.message;
            } catch (error) {
                console.error('Error during signup:', error);
                messageDiv.textContent = 'Failed to signup. Please try again.';
            }
        });
    }

    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value; // Matching ID for login form
            const password = document.getElementById('password').value; // Matching ID for login form

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();
                if (result.success) {
                    localStorage.setItem('token', result.token);
                    window.location.href = 'student.html';
                } else {
                    messageDiv.textContent = result.message;
                }
            } catch (error) {
                console.error('Error during login:', error);
                messageDiv.textContent = 'Failed to login. Please try again.';
            }
        });
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }

    // Username display for logged-in users
    if (usernameSpan) {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('/student', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Invalid token or user not authenticated');
                }

                const data = await response.json();
                if (data.username) {
                    usernameSpan.textContent = data.username;
                } else {
                    localStorage.removeItem('token'); // Clear invalid token
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error('Error during token validation:', error);
                localStorage.removeItem('token'); // Clear token on error
                window.location.href = 'login.html';
            }
        } else {
            window.location.href = 'login.html'; // Redirect if no token
        }
    }
});
