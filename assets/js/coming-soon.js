/* ================= COMING SOON COUNTDOWN LOGIC ================= */

document.addEventListener('DOMContentLoaded', () => {
    // Target Launch Date: June 1, 2026
    const targetDate = new Date("2026-06-01T00:00:00").getTime();

    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const gap = targetDate - now;

        // Time Calculations
        const d = Math.floor(gap / (1000 * 60 * 60 * 24));
        const h = Math.floor((gap / (1000 * 60 * 60)) % 24);
        const m = Math.floor((gap / (1000 * 60)) % 60);
        const s = Math.floor((gap / 1000) % 60);

        // Update DOM Elements
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl && hoursEl && minutesEl && secondsEl) {
            daysEl.innerText = String(d).padStart(2, '0');
            hoursEl.innerText = String(h).padStart(2, '0');
            minutesEl.innerText = String(m).padStart(2, '0');
            secondsEl.innerText = String(s).padStart(2, '0');
        }

        // If countdown finishes
        if (gap <= 0) {
            clearInterval(countdownTimer);
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
        }

    }, 1000);

    // Notification Form Basic Interaction
    const notifyBtn = document.getElementById('notify-btn');
    const emailInput = document.getElementById('subscriber-email');

    if (notifyBtn && emailInput) {
        notifyBtn.addEventListener('click', () => {
            const email = emailInput.value;
            if (validateEmail(email)) {
                notifyBtn.innerText = "Check your mail";
                notifyBtn.disabled = true;
                emailInput.disabled = true;
                notifyBtn.style.background = "#fff";
                notifyBtn.style.color = "#000";
            } else {
                emailInput.style.borderColor = "red";
                setTimeout(() => emailInput.style.borderColor = "rgba(255,255,255,0.1)", 2000);
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Cinematic Mouse Glow Effect
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        glow.animate({
            left: `${x}px`,
            top: `${y}px`
        }, { duration: 1500, fill: "forwards" });
    });
});
