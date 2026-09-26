document.addEventListener('DOMContentLoaded', () => {
    // Select UI elements
    const menuBtn = document.querySelector('.menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const body = document.body;

    // Function to toggle sidebar open/closed
    function toggleSidebar() {
        body.classList.toggle('sidebar-open');
    }

    // Attach event listeners if the elements exist on the page
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
    }
    
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', toggleSidebar);
    }

    // Allow user to close the menu by clicking the dark overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    // --- Profile Dropdown Logic ---
    const profileToggleBtn = document.getElementById('profile-toggle-btn');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileToggleBtn && profileDropdown) {
        // Toggle dropdown on avatar click
        profileToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from bubbling to the document
            profileDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside of it
        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && !profileToggleBtn.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        }); 
        }
    }
);