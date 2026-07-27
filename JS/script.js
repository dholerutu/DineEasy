// ======================================
// DineEasy
// script.js
// ======================================

// Wait until page loads
document.addEventListener("DOMContentLoaded", function () {

    // Fade-in animation
    document.body.classList.add("loaded");

    // Animate steps one by one
    const steps = document.querySelectorAll(".step");

    steps.forEach((step, index) => {

        step.style.opacity = "0";
        step.style.transform = "translateY(20px)";

        setTimeout(() => {

            step.style.transition = "0.6s ease";
            step.style.opacity = "1";
            step.style.transform = "translateY(0)";

        }, 300 + index * 200);

    });

    // Animate welcome card
    const card = document.querySelector(".welcome-card");

    if (card) {

        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";

        setTimeout(() => {

            card.style.transition = "0.8s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 150);

    }

});

// ======================================
// Get Started Button
// ======================================

function startOrder() {

    const button = document.querySelector(".start-btn");

    if (button) {

        button.innerHTML =
            'Loading <i class="bi bi-arrow-repeat"></i>';

        button.disabled = true;

    }

    setTimeout(() => {

        window.location.href = "Menu.html";

    }, 900);

}

// ======================================
// Restaurant Image Hover Effect
// ======================================

const image = document.querySelector(".restaurant-img");

if (image) {

    image.addEventListener("mouseenter", () => {

        image.style.transform = "scale(1.03)";

    });

    image.addEventListener("mouseleave", () => {

        image.style.transform = "scale(1)";

    });

}

// ======================================
// Button Ripple Effect
// ======================================

const startBtn = document.querySelector(".start-btn");

if (startBtn) {

    startBtn.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        ripple.classList.add("ripple");

        const rect = this.getBoundingClientRect();

        ripple.style.left = e.clientX - rect.left + "px";
        ripple.style.top = e.clientY - rect.top + "px";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

}

// ======================================
// Scroll Reveal Animation
// ======================================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.2

});

document.querySelectorAll(".step").forEach((element) => {

    observer.observe(element);

});

// ======================================
// Console Message
// ======================================

console.log("%cWelcome to DineEasy 🍽️", "color:#61764B;font-size:18px;font-weight:bold;");
console.log("Developed by Team DineEasy");