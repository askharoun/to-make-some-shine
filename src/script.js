
// DOM Elements
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const contactForm = document.getElementById('contactForm');

// Modal functionality
function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first form input after animation
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 300);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form when closing
    contactForm.reset();
    removeSuccessMessage();
}

// Event listeners
openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
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
    errorMessage.style.background = '#f8d7da';
    errorMessage.style.color = '#721c24';
    errorMessage.style.borderColor = '#f5c6cb';
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

// Smooth scroll and page load animations
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to CTA button
    const ctaButton = document.getElementById('openModal');
    
    ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = '';
    });
    
    // Add subtle animation to modal container on hover
    modalContainer.addEventListener('mouseenter', () => {
        modalContainer.style.transform = 'scale(1.01) translateY(-2px)';
    });
    
    modalContainer.addEventListener('mouseleave', () => {
        modalContainer.style.transform = '';
    });
});

console.log('ToMakeSome website loaded successfully!');
