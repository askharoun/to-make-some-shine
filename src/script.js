
// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const closeModal = document.getElementById('closeModal');
const openModalButtons = [
    document.getElementById('openModal'),
    document.getElementById('navCTA'),
    document.getElementById('contactCTA')
];

// Open modal
openModalButtons.forEach(button => {
    if (button) {
        button.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
});

// Close modal
closeModal.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Open modal with specific plan
function openModalWithPlan(plan) {
    document.getElementById('selectedPlan').value = plan;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Custom error display function
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
    
    // Scroll error into view
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Clear error when user starts typing
function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv.style.display !== 'none') {
        errorDiv.style.display = 'none';
    }
}

// Add event listeners to clear errors when user starts typing
document.getElementById('name').addEventListener('input', clearError);
document.getElementById('email').addEventListener('input', clearError);
document.getElementById('message').addEventListener('input', clearError);

// Form validation and submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Check if all fields are filled
    if (!name || !email || !message) {
        showError('Please fill out all required fields to continue.');
        return;
    }
    
    // Validate name (at least 2 characters, no numbers)
    if (name.length < 2) {
        showError('Please enter a valid name (at least 2 characters).');
        return;
    }
    
    if (/\d/.test(name)) {
        showError('Your name shouldn\'t contain numbers. Please enter a valid name.');
        return;
    }
    
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address (e.g., john@company.com).');
        return;
    }
    
    // Check for common fake emails
    const commonFakeEmails = ['test@test.com', 'fake@fake.com', 'example@example.com', 'asdf@asdf.com'];
    if (commonFakeEmails.includes(email.toLowerCase())) {
        showError('Please provide your real email address so we can contact you.');
        return;
    }
    
    // Validate message (at least 20 characters)
    if (message.length < 20) {
        showError('Please provide more details about your business (at least 20 characters).');
        return;
    }
    
    // Check for gibberish in message
    const words = message.toLowerCase().split(/\s+/);
    const validWords = words.filter(word => {
        // Check for reasonable word length (2-20 characters)
        if (word.length < 2 || word.length > 20) return false;
        // Check for reasonable vowel-consonant ratio
        const vowels = (word.match(/[aeiou]/g) || []).length;
        const consonants = word.length - vowels;
        return vowels > 0 && consonants > 0;
    });
    
    if (validWords.length < words.length * 0.7) {
        showError('Please provide a meaningful description of your business in proper English.');
        return;
    }
    
    // Check for keyboard mashing patterns
    const repeatingChars = /(.)\1{3,}/; // 4 or more repeating characters
    const keyboardMash = /^[a-z]{1,4}$/; // Very short words
    
    if (repeatingChars.test(message.toLowerCase()) || 
        words.filter(word => keyboardMash.test(word)).length > words.length * 0.3) {
        showError('Please provide a genuine description of your business needs.');
        return;
    }
    
    // If all validation passes, submit the form
    this.submit();
});

// Privacy Policy Functions
function showPrivacyPolicy(event) {
    event.preventDefault();
    document.getElementById('privacyModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePrivacyPolicy() {
    document.getElementById('privacyModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Terms of Service Functions
function showTermsOfService(event) {
    event.preventDefault();
    document.getElementById('termsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTermsOfService() {
    document.getElementById('termsModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close modals when clicking outside
document.getElementById('privacyModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('privacyModal')) {
        closePrivacyPolicy();
    }
});

document.getElementById('termsModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('termsModal')) {
        closeTermsOfService();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
