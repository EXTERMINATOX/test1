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

    // ── MOBILE TOOLTIP TAP HANDLER ──
    // Only active on small screens (≤850px).
    // On desktop, CSS :hover handles everything — this code is never triggered.
    if (window.matchMedia('(max-width: 850px)').matches) {

        // Create a full-screen backdrop that closes the tooltip when tapped
        const backdrop = document.createElement('div');
        backdrop.id = 'mobile-tooltip-backdrop';
        Object.assign(backdrop.style, {
            display: 'none',
            position: 'fixed',
            inset: '0',
            zIndex: '999998',
            background: 'rgba(0,0,0,0.55)'
        });
        document.body.appendChild(backdrop);

        // Create a centered tooltip wrapper that lives in the body
        const floatingBox = document.createElement('div');
        floatingBox.id = 'mobile-tooltip-float';
        Object.assign(floatingBox.style, {
            display: 'none',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '88vw',
            maxWidth: '340px',
            background: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(16px)',
            webkitBackdropFilter: 'blur(16px)',
            border: '1px solid #D4AF37',
            borderRadius: '12px',
            padding: '18px',
            color: '#f5f5f5',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            zIndex: '999999',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
            fontFamily: "'Inter', sans-serif"
        });
        document.body.appendChild(floatingBox);

        function closeTooltip() {
            floatingBox.style.display = 'none';
            backdrop.style.display = 'none';
            floatingBox.innerHTML = '';
        }

        backdrop.addEventListener('click', closeTooltip);

        const infoIcons = document.querySelectorAll('.info-icon');
        infoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                // Get the original tooltip-box content
                const originalBox = icon.closest('.tooltip-container')?.querySelector('.tooltip-box');
                if (!originalBox) return;

                // Copy its inner content into our floating box
                floatingBox.innerHTML = originalBox.innerHTML;

                // Add a close button at the top-right
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '✕';
                Object.assign(closeBtn.style, {
                    position: 'absolute',
                    top: '10px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#a0a0a0',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    lineHeight: '1'
                });
                closeBtn.addEventListener('click', closeTooltip);
                floatingBox.style.position = 'fixed';
                floatingBox.appendChild(closeBtn);

                // Show
                floatingBox.style.display = 'block';
                backdrop.style.display = 'block';
            });
        });
    }
});
