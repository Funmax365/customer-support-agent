document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar Logic ---
    const menuBtn = document.querySelector('.menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const body = document.body;

    function toggleSidebar() {
        body.classList.toggle('sidebar-open');
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);
    
    // --- Profile Data Management ---
    const defaultProfile = {
        name: "Jane Doe",
        phone: "+1 (555) 123-4567",
        email: "jane.doe@example.com",
        customerId: "CUST-90210"
    };

    let userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (!userProfile) {
        userProfile = defaultProfile;
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }

    window.updateProfileDropdownUI = function() {
        const profileData = JSON.parse(localStorage.getItem('userProfile'));
        if (!profileData) return;

        const nameEl = document.querySelector('.profile-dropdown .profile-name');
        const infoValues = document.querySelectorAll('.profile-dropdown .info-value');
        
        if (nameEl) nameEl.textContent = profileData.name;
        
        // Ensure we are targeting the Phone, Email, and ID elements respectively
        if (infoValues.length >= 3) {
            infoValues[0].textContent = profileData.phone;
            infoValues[1].textContent = profileData.email;
            infoValues[2].textContent = profileData.customerId;
        }
    };

    // Initialize UI with stored data
    updateProfileDropdownUI();

    // --- Profile Dropdown Toggle Logic ---
    const profileToggleBtn = document.getElementById('profile-toggle-btn');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileToggleBtn && profileDropdown) {
        profileToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && !profileToggleBtn.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        }); 
    }
});