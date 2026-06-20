// Portfolio JavaScript - Krishna Soni

// Current date from user metadata (June 15, 2026)
const CURRENT_DATE = new Date("2026-06-15");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Navigation Scroll Effect
    const header = document.querySelector(".topbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 2. Mobile Nav Menu Toggle
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-links a");

    mobileToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const icon = mobileToggle.querySelector("i");
        if (navMenu.classList.contains("active")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            mobileToggle.querySelector("i").className = "fa-solid fa-bars";
        });
    });

    // 3. Scroll Spy (Active Links)
    const sections = document.querySelectorAll("section");
    const scrollOptions = {
        threshold: 0.25,
        rootMargin: "-90px 0px 0px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, scrollOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 4. Hero Section Typing Effect
    const words = [
        "Data Science Enthusiast",
        "Machine Learning Student",
        "IoT & Hardware Developer",
        "Problem Solver"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingElement = document.getElementById("typing-text");
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIdx];
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing effect
    typeEffect();

    // 5. Generate Dynamic GitHub Contribution Heatmap
    generateGitHubCalendar();

    // 6. Intersection Observer for Fade-in Animations
    const fadeElements = document.querySelectorAll(".glass-card, .section-header, .hero-copy, .hero-avatar-container");
    const fadeObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated-fade-in");
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    // Add CSS initial state for animations
    fadeElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        fadeObserver.observe(el);
    });

    // Define the animation class style injection
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .animated-fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);
});

// Featured Project Tab Switcher
function switchTab(event, tabId) {
    // Hide all tabs
    const tabPanes = document.querySelectorAll(".tab-pane-content");
    tabPanes.forEach(pane => pane.classList.add("d-none"));
    
    // Remove active state from buttons
    const buttons = document.querySelectorAll(".tab-button");
    buttons.forEach(btn => btn.classList.remove("active"));
    
    // Show selected tab
    document.getElementById(tabId).classList.remove("d-none");
    
    // Set active state on button
    event.currentTarget.classList.add("active");
}

// Lightbox Modal for Certificate Expand
function openLightbox(imgSrc, title, subtitle) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxSubtitle = document.getElementById("lightbox-subtitle");
    
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxSubtitle.textContent = subtitle;
    
    lightbox.classList.remove("d-none");
    document.body.style.overflow = "hidden"; // Lock scroll
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.add("d-none");
    document.body.style.overflow = ""; // Unlock scroll
}

// GitHub Calendar Generator
function generateGitHubCalendar() {
    const calendarContainer = document.getElementById("heatmap-calendar");
    if (!calendarContainer) return;
    
    // Create the grid element
    const grid = document.createElement("div");
    grid.className = "heatmap-grid";
    
    // Calculate dates for 365 days ending at CURRENT_DATE
    const totalDays = 371; // 53 weeks * 7 days
    const startDate = new Date(CURRENT_DATE);
    startDate.setDate(startDate.getDate() - totalDays + 1);
    
    // Tooltip elements
    const tooltip = document.createElement("div");
    tooltip.className = "heatmap-tooltip";
    document.body.appendChild(tooltip);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const cell = document.createElement("div");
        cell.className = "heatmap-cell";
        
        // Generate a simulated commit distribution
        // 0: no commits, 1-4: color levels
        // Weekdays get more commits, weekends fewer, with occasional busy spurts
        const dayOfWeek = currentDate.getDay();
        let commits = 0;
        
        // Random distribution model
        const rand = Math.random();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
            if (rand > 0.8) commits = Math.floor(Math.random() * 3) + 1; // 1-3 commits
        } else { // Weekday
            if (rand > 0.3) {
                commits = Math.floor(Math.random() * 6) + 1; // 1-6 commits
            }
        }
        
        // Map commits to color levels
        let level = 0;
        if (commits === 0) level = 0;
        else if (commits <= 2) level = 1;
        else if (commits <= 4) level = 2;
        else if (commits <= 6) level = 3;
        else level = 4;
        
        // Color mapping variable
        const colors = ["#0d1117", "#0e4429", "#006d32", "#26a641", "#39d353"];
        cell.style.backgroundColor = colors[level];
        
        // Date formatting for tooltip
        const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
        const commitText = commits === 0 ? "No contributions" : `${commits} contribution${commits > 1 ? "s" : ""}`;
        
        // Mouse event handlers for tooltip
        cell.addEventListener("mouseenter", (e) => {
            tooltip.innerHTML = `<strong>${commitText}</strong> on ${formattedDate}`;
            tooltip.style.opacity = "1";
            
            const rect = cell.getBoundingClientRect();
            // Align tooltip above the cell
            tooltip.style.left = `${rect.left + window.scrollX - (tooltip.offsetWidth / 2) + 5}px`;
            tooltip.style.top = `${rect.top + window.scrollY - 38}px`;
        });
        
        cell.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
        });
        
        grid.appendChild(cell);
    }
    
    calendarContainer.appendChild(grid);
}

// Contact Form Handling (Simulate Submit)
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById("portfolio-form");
    const nameInput = document.getElementById("form-name").value;
    const emailInput = document.getElementById("form-email").value;
    const subjectInput = document.getElementById("form-subject").value;
    const messageInput = document.getElementById("form-message").value;
    const submitBtn = document.getElementById("submit-btn");
    
    // Change button state to sending
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>`;
    submitBtn.style.opacity = "0.7";
    
    // Simulate sending message
    setTimeout(() => {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.style.opacity = "";
        
        // Trigger a custom glassmorphism modal popup
        showPopupMessage(nameInput);
        
        // Reset form
        form.reset();
    }, 1500);
}

// Custom Success Popup Message
function showPopupMessage(userName) {
    const popupOverlay = document.createElement("div");
    popupOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(3, 7, 18, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px;
        animation: fadeIn 0.3s ease;
    `;
    
    const card = document.createElement("div");
    card.className = "glass-card";
    card.style.cssText = `
        padding: 40px;
        max-width: 450px;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        border: 1px solid rgba(0, 242, 254, 0.2);
        box-shadow: 0 0 30px rgba(0, 242, 254, 0.15), var(--shadow-premium);
    `;
    
    const icon = document.createElement("div");
    icon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
    icon.style.cssText = `
        font-size: 3.5rem;
        color: #10b981;
        animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    const title = document.createElement("h3");
    title.textContent = "Message Sent Successfully!";
    title.style.cssText = `
        font-family: var(--font-heading);
        font-size: 1.5rem;
        font-weight: 700;
    `;
    
    const desc = document.createElement("p");
    desc.innerHTML = `Thank you, <strong>${userName}</strong>! Your message has been routed to Krishna Soni. You will receive a response at your email address shortly.`;
    desc.style.cssText = `
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.6;
    `;
    
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close Window";
    closeBtn.className = "primary-button";
    closeBtn.style.cssText = `
        cursor: pointer;
        border: none;
        align-self: center;
        padding: 10px 24px;
        font-size: 0.9rem;
    `;
    
    closeBtn.addEventListener("click", () => {
        document.body.removeChild(popupOverlay);
    });
    
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(closeBtn);
    popupOverlay.appendChild(card);
    
    document.body.appendChild(popupOverlay);
    
    // Inject keyframes if not existing
    if (!document.getElementById("popup-keyframes")) {
        const style = document.createElement("style");
        style.id = "popup-keyframes";
        style.innerText = `
            @keyframes scaleUp {
                from { transform: scale(0); }
                to { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}
