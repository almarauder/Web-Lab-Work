const registrationButton = document.getElementById('registration-button');
if (registrationButton) {
    registrationButton.addEventListener('click', function() {
        window.location.href = 'register.html';
    });
}

const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = 'Registration form submitted successfully!';
            messageElement.style.display = 'block';

            setTimeout(function() {
                messageElement.textContent = '';
                messageElement.style.display = 'none';
            }, 3000);
        }
    });
}

const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
formInputs.forEach(function(input) {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.classList.add('valid');
            this.classList.remove('invalid');
        } else {
            this.classList.add('invalid');
            this.classList.remove('valid');
        }
    });
    
    input.addEventListener('focus', function() {
        this.classList.remove('invalid');
    });
});