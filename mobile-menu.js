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
    // Uses event delegation to capture taps reliably on mobile.
    
    // Create elements once
    const backdrop = document.createElement('div');
    backdrop.id = 'mobile-tooltip-backdrop';
    Object.assign(backdrop.style, {
        display: 'none',
        position: 'fixed',
        inset: '0',
        zIndex: '999998',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(3px)',
        '-webkit-backdrop-filter': 'blur(3px)'
    });

    const floatingBox = document.createElement('div');
    floatingBox.id = 'mobile-tooltip-float';
    Object.assign(floatingBox.style, {
        display: 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '88vw',
        maxWidth: '360px',
        background: 'rgba(15, 15, 15, 0.98)',
        backdropFilter: 'blur(16px)',
        '-webkit-backdrop-filter': 'blur(16px)',
        border: '1px solid var(--gold-primary, #D4AF37)',
        borderRadius: '12px',
        padding: '24px 20px',
        color: '#f5f5f5',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        zIndex: '999999',
        boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
        fontFamily: "'Inter', sans-serif",
        textAlign: 'center'
    });

    // Only append on first use or at load
    document.body.appendChild(backdrop);
    document.body.appendChild(floatingBox);

    function closeTooltip() {
        floatingBox.style.display = 'none';
        backdrop.style.display = 'none';
        floatingBox.innerHTML = '';
    }

    backdrop.addEventListener('click', closeTooltip);

    // Event Delegation
    document.addEventListener('click', (e) => {
        // Only active on mobile
        if (window.innerWidth > 850) return;

        const icon = e.target.closest('.info-icon');
        if (icon) {
            e.preventDefault();
            e.stopPropagation();

            const originalBox = icon.closest('.tooltip-container')?.querySelector('.tooltip-box');
            if (!originalBox) return;

            floatingBox.innerHTML = originalBox.innerHTML;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '12px',
                right: '15px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                lineHeight: '1',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });
            closeBtn.addEventListener('click', closeTooltip);
            floatingBox.appendChild(closeBtn);

            floatingBox.style.display = 'block';
            backdrop.style.display = 'block';
        }
    });
});

