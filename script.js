document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);
    
    // PEN UNCAPPING — near top of page
    gsap.set(".pen-cap", { y: 0 });
    gsap.set(".pen-body", { y: 0 });
    
    const uncapTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".intro-title",
            start: "bottom center",
            end: "bottom top",
            scrub: 0.5,
            markers: false
        }
    });
    
    uncapTimeline.to(".pen-cap", { y: "-64vh" }, 0);
    uncapTimeline.to(".pen-body", { y: "20vh" }, 0);
    
    // PEN RECAP — near bottom of project section
    const recapTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".recap-trigger",
            start: "top bottom",
            end: "bottom center",
            scrub: 0.5,
        }
    });
    
    recapTimeline.to(".pen-cap", { y: 0 }, 0);
    recapTimeline.to(".pen-body", { y: 0 }, 0);
    recapTimeline.to(".bottom-bar-mask", {
        y: "0vh",
        height: "50vh",
        ease: "none"
    }, 0);
    
    ScrollTrigger.create({
        trigger: ".recap-trigger",
        start: "top bottom",
        end: "bottom center",
        scrub: true,
        onLeaveBack: () => {
            gsap.to(".bottom-bar-mask", { 
                y: "0vh",
                height: "75px",
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
    
    
    // Modal image sets
    const modalImageSets = {
        "modal-unsung-hero": [
            "Images/unsung-hero-mockup.jpg",
            "Images/driving-license-inner.jpg",
            "Images/driving-license-outer.jpg",
            "Images/social-security-card-front.jpg",
            "Images/social-security-card-back.jpg",
            "Images/marriage-certificate.jpg",
            "Images/birth-announcement-front.jpg",
            "Images/birth-announcement-back.jpg",
            "Images/newspaper.jpg",
            "Images/medical-file.jpg"
        ],
        
        "modal-baskerville": [
            "Images/baskerville-mockup.jpg",
            "Images/baskerville-front-page.jpg",
            "Images/baskerville-page2.jpg",
            "Images/baskerville-page3.jpg",
            "Images/baskerville-page4.jpg",
            "Images/baskerville-page5.jpg",
            "Images/baskerville-page6.jpg",
            "Images/baskerville-page7.jpg"
        ],
        
        "modal-signage": [
            "Images/signage-editorial-mockup.jpg",
            "Images/signage-page1.jpg",
            "Images/signage-page2.jpg"
        ],
        
        "modal-karl-gerstner": [
            "Images/akzidenz-grotesk-mockup.jpg",
            "Images/karl-gerstner-spread.jpg"
        ],
        
        "modal-chronocraft": [
            "Images/chronocraft-front-page.jpg",
            "Images/chronocraft-logo-primary.jpg",
            "Images/chronocraft-logo-secondary.jpg",
            "Images/chronocraft-brandpalette.jpg",
            "Images/chronocraft-mockups.jpg"
        ],
        
        "modal-american-psycho": [
            "Images/american-psycho-mockup.jpg",
            "Images/american-psycho-poster-01.webp",
            "Images/american-psycho-poster-02.webp",
            "Images/american-psycho-poster-03.webp",
            "Images/american-psycho-logo-11.jpg"
        ],
        
        "modal-valletta-vibes": [
            "Images/valletta-vibes-mockup.jpg",
            "Images/valletta-vibes-18.jpg",
            "Images/valletta-vibes-poster-14-mockup.jpg",
            "Images/valletta-vibes-poster-14.jpg",
            "Images/valletta-vibes-brochure-together.jpg",
            "Images/valletta-vibes-brochure-mockup.jpg",
            "Images/valletta-vibes-brochure-pages.jpg"
        ],
    };
    
    const buttons = document.querySelectorAll(".project-btn");
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            const images = modalImageSets[modalId];
            let index = 0;
            const imgEl = modal.querySelector('#carousel-image');
            
            // Show modal
            modal.style.display = 'flex';
            
            // Load first image
            imgEl.src = images[index];
            
            // Reset zoom toggle state
            magnifierToggled[modalId] = false;
            const toggleBtn = modal.querySelector('.toggle-magnifier');
            if (toggleBtn) toggleBtn.textContent = 'Zoom';
            
            // Replace old listeners to avoid duplicates
            const prev = modal.querySelector('.prev');
            const next = modal.querySelector('.next');
            const newPrev = prev.cloneNode(true);
            const newNext = next.cloneNode(true);
            prev.parentNode.replaceChild(newPrev, prev);
            next.parentNode.replaceChild(newNext, next);
            
            newPrev.onclick = () => {
                index = (index - 1 + images.length) % images.length;
                switchImage(modal, imgEl, images, index, modalId);
            };
            
            newNext.onclick = () => {
                index = (index + 1) % images.length;
                switchImage(modal, imgEl, images, index, modalId);
            };
            
            // Close modal via close button
            const closeBtn = modal.querySelector('.close-btn');
            closeBtn.onclick = () => closeModal(modalId);
            
            // Close modal by clicking outside content
            modal.onclick = (e) => {
                if (e.target === modal) {
                    closeModal(modalId);
                }
            };
        });
    });
    
    function switchImage(modal, imgEl, images, newIndex, modalId) {
        imgEl.src = images[newIndex];
        
        // ✅ Remove any existing magnifier lens
        const lens = modal.querySelector('.magnifier-lens');
        if (lens) lens.remove();
        
        // ✅ Remove magnifier listeners
        imgEl.onmousemove = null;
        imgEl.onmouseleave = null;
        
        // ✅ Reset toggle state and button label
        magnifierToggled[modalId] = false;
        const toggleBtn = modal.querySelector('.toggle-magnifier');
        if (toggleBtn) toggleBtn.textContent = 'Zoom';
    }
    
    function enableMagnifier(img, modalId) {
        const lens = document.createElement("div");
        lens.className = "magnifier-lens";
        
        const zoomedImg = new Image();
        zoomedImg.src = img.src;
        const zoomLevel = 2;
        
        lens.appendChild(zoomedImg);
        img.parentElement.appendChild(lens);
        lens.style.display = "block";
        
        zoomedImg.onload = () => {
            img.onmousemove = moveLens;
            lens.onmousemove = moveLens;
            
            img.onmouseleave = () => {
                if (!magnifierToggled[modalId]) lens.remove(); // Only remove lens if toggle is OFF
            };
        };
        
        function moveLens(e) {
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const lensSize = lens.offsetWidth;
            const cx = zoomedImg.naturalWidth / rect.width;
            const cy = zoomedImg.naturalHeight / rect.height;
            
            lens.style.left = `${x - lensSize / 2}px`;
            lens.style.top = `${y - lensSize / 2}px`;
            
            zoomedImg.style.left = `-${x * cx - lensSize / 2}px`;
            zoomedImg.style.top = `-${y * cy - lensSize / 2}px`;
            zoomedImg.style.width = `${zoomedImg.naturalWidth}px`;
            zoomedImg.style.height = `${zoomedImg.naturalHeight}px`;
        }
    }
    
    const magnifierToggled = {};
    
    document.querySelectorAll('.toggle-magnifier').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            const img = modal.querySelector('.modal-img');
            
            if (magnifierToggled[modalId]) {
                // Turn OFF zoom
                const lens = modal.querySelector('.magnifier-lens');
                if (lens) lens.remove();
                img.onmousemove = null;
                img.onmouseleave = null;
                
                magnifierToggled[modalId] = false;
                button.textContent = 'Zoom';
            } else {
                // Turn ON zoom
                enableMagnifier(img, modalId); // pass modalId too
                magnifierToggled[modalId] = true;
                button.textContent = 'Disable Zoom';
            }
        });
    });
    
    
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const img = modal.querySelector('.modal-img');
        const lens = modal.querySelector('.magnifier-lens');
        
        modal.style.display = 'none';
        
        // Clean up magnifier
        if (lens) lens.remove();
        img.onmousemove = null;
        img.onmouseleave = null;
        
        // Reset zoom toggle
        magnifierToggled[modalId] = false;
        const toggleBtn = modal.querySelector('.toggle-magnifier');
        if (toggleBtn) toggleBtn.textContent = 'Zoom';
    }
    
    // Contact Modal Logic
    const openContactBtn = document.getElementById('open-contact-modal');
    const contactModal = document.getElementById('contact-modal');
    
    if (openContactBtn && contactModal) {
        const contactCloseBtn = contactModal.querySelector('.contact-close');
        
        openContactBtn.addEventListener('click', () => {
            contactModal.style.display = 'flex';
        });
        
        contactCloseBtn.addEventListener('click', () => {
            contactModal.style.display = 'none';
        });
        
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.style.display = 'none';
            }
        });
    }
    
    const copyEmailBtn = document.getElementById('copy-email-btn');
    
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = "nicole-micallef@outlook.com";
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyEmailBtn.textContent;
                copyEmailBtn.textContent = "Copied!";
                
                setTimeout(() => {
                    copyEmailBtn.textContent = originalText;
                }, 2000);
            });
        });
    }
    
});