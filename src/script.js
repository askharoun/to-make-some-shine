// DOM Elements
const openModalBtn = document.getElementById('openModal');
const navCTA = document.getElementById('navCTA');
const contactCTA = document.getElementById('contactCTA');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const contactForm = document.getElementById('contactForm');
const selectedPlanInput = document.getElementById('selectedPlan');
const privacyModal = document.getElementById('privacyModal');
const termsModal = document.getElementById('termsModal');

// Modal functionality
function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first form input after animation
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 300);
}

function openModalWithPlan(plan) {
    selectedPlanInput.value = plan;
    openModal();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form when closing
    contactForm.reset();
    selectedPlanInput.value = '';
    removeSuccessMessage();
}

// Legal modal functions
function showPrivacyPolicy(e) {
    e.preventDefault();
    privacyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePrivacyPolicy() {
    privacyModal.classList.remove('active');
    document.body.style.overflow = '';
}

function showTermsOfService(e) {
    e.preventDefault();
    termsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTermsOfService() {
    termsModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners
openModalBtn.addEventListener('click', openModal);
navCTA.addEventListener('click', openModal);
contactCTA.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
        closePrivacyPolicy();
    }
});

termsModal.addEventListener('click', (e) => {
    if (e.target === termsModal) {
        closeTermsOfService();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modalOverlay.classList.contains('active')) {
            closeModal();
        }
        if (privacyModal.classList.contains('active')) {
            closePrivacyPolicy();
        }
        if (termsModal.classList.contains('active')) {
            closeTermsOfService();
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Update active navigation on scroll
window.addEventListener('scroll', () => {
    const sections = ['home', 'services', 'pricing'];
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const link = document.querySelector(`[href="#${sectionId}"]`);
        
        if (section && link) {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    
    // Update button state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(contactForm);
        
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showSuccessMessage();
            contactForm.reset();
            selectedPlanInput.value = '';
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage();
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Success message
function showSuccessMessage() {
    removeSuccessMessage(); // Remove any existing message
    
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <strong>Success!</strong> Your message has been sent. We'll get back to you within 24 hours.
    `;
    
    const modalBody = document.querySelector('.modal-body');
    modalBody.insertBefore(successMessage, contactForm);
    
    // Auto-close modal after success
    setTimeout(() => {
        closeModal();
    }, 3000);
}

// Error message
function showErrorMessage() {
    removeSuccessMessage(); // Remove any existing message
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-success';
    errorMessage.style.background = '#fee2e2';
    errorMessage.style.color = '#991b1b';
    errorMessage.style.borderColor = '#fecaca';
    errorMessage.innerHTML = `
        <strong>Error!</strong> There was a problem sending your message. Please try again.
    `;
    
    const modalBody = document.querySelector('.modal-body');
    modalBody.insertBefore(errorMessage, contactForm);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        removeSuccessMessage();
    }, 5000);
}

// Remove success/error message
function removeSuccessMessage() {
    const existingMessage = document.querySelector('.form-success');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Form validation enhancements
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.style.borderColor = '';
    
    // Basic validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#dc3545';
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
    
    const errorMessage = field.parentNode.querySelector('.field-error');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Page load animations
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Add interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add animation observer for service cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe service cards and pricing cards
    document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
});

console.log('ToMakeSome website loaded successfully!');
