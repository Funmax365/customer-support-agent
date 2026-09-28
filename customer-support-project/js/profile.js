document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const nameInput = document.getElementById('p-name');
    const emailInput = document.getElementById('p-email');
    const phoneInput = document.getElementById('p-phone');
    const idInput = document.getElementById('p-id'); // Read-only
    const successMsg = document.getElementById('profile-success-msg');

    // 1. Load data from localStorage into inputs
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (userProfile) {
        nameInput.value = userProfile.name;
        emailInput.value = userProfile.email;
        phoneInput.value = userProfile.phone;
        idInput.value = userProfile.customerId;
    }

    // 2. Handle form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update the profile object
        const updatedProfile = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            customerId: idInput.value // Stays constant
        };

        // Save back to localStorage
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

        // Trigger the global dropdown UI update immediately
        if (typeof window.updateProfileDropdownUI === 'function') {
            window.updateProfileDropdownUI();
        }

        // Display confirmation feedback
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    });
});