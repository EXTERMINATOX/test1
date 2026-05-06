// --- GLOBAL MOBILE MENU BEHAVIOR ---

function toggleMobileMenu() {
    const menu = document.getElementById("navMenu");
    const btn = document.querySelector(".mobile-menu-btn");
    const overlay = document.getElementById("mobileOverlay");
    
    if (menu) menu.classList.toggle("open");
    if (btn) btn.classList.toggle("open");
    if (overlay) overlay.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {
    // Close the menu when any nav link is clicked
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById("navMenu");
            if (menu && menu.classList.contains("open")) {
                toggleMobileMenu();
            }
        });
    });
});
