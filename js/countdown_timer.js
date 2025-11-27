class CountdownTimer {
    constructor(targetDate, containerId) {
        this.targetDate = new Date(targetDate).getTime();
        this.container = document.getElementById(containerId);
        this.interval = null;
        
        if (!this.container) {
            console.error(`Container with id '${containerId}' not found!`);
            return;
        }
        
        this.init();
    }

    init() {
        this.createTimerElements();
        this.startTimer();
    }

    createTimerElements() {
        this.container.innerHTML = `
            <div class="countdown-container">
                <div class="countdown-header">
                    <h2>🔥 Black Friday Sale 🔥</h2>
                    <p>Hurry up! Limited time offer</p>
                </div>
                <div class="countdown-timer" id="timer-display">
                    <div class="time-unit">
                        <span class="time-value" id="days">00</span>
                        <span class="time-label">Days</span>
                    </div>
                    <div class="time-separator">:</div>
                    <div class="time-unit">
                        <span class="time-value" id="hours">00</span>
                        <span class="time-label">Hours</span>
                    </div>
                    <div class="time-separator">:</div>
                    <div class="time-unit">
                        <span class="time-value" id="minutes">00</span>
                        <span class="time-label">Minutes</span>
                    </div>
                    <div class="time-separator">:</div>
                    <div class="time-unit">
                        <span class="time-value" id="seconds">00</span>
                        <span class="time-label">Seconds</span>
                    </div>
                </div>
                <div class="countdown-message" id="countdown-message" style="display: none;">
                    <h2>The Sale has ended.</h2>
                    <p>Thank you for your interest! Stay tuned for our next sale.</p>
                </div>
            </div>
        `;
    }

    calculateTimeRemaining() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            return null; 
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }

    updateDisplay() {
        const timeRemaining = this.calculateTimeRemaining();

        if (timeRemaining === null) {
            this.showEndMessage();
            return;
        }

        this.updateTimeUnit('days', timeRemaining.days);
        this.updateTimeUnit('hours', timeRemaining.hours);
        this.updateTimeUnit('minutes', timeRemaining.minutes);
        this.updateTimeUnit('seconds', timeRemaining.seconds);
    }

    updateTimeUnit(id, value) {
        const element = document.getElementById(id);
        if (element) {
            const paddedValue = String(value).padStart(2, '0');

            if (element.textContent !== paddedValue) {
                element.classList.add('flip');
                setTimeout(() => {
                    element.classList.remove('flip');
                }, 300);
                element.textContent = paddedValue;
            }
        }
    }

    showEndMessage() {
        clearInterval(this.interval);
        
        const timerDisplay = document.getElementById('timer-display');
        const message = document.getElementById('countdown-message');
        
        if (timerDisplay && message) {
            timerDisplay.style.display = 'none';
            message.style.display = 'block';
            message.classList.add('fade-in');
        }

        this.triggerCelebration();
    }

    startTimer() {
        this.updateDisplay();
  
        this.interval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    triggerCelebration() {
        console.log('🎉 Sale has ended! Thank you!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const blackFridayDate = 'November 21, 2025 13:07:40';

    const countdown = new CountdownTimer(blackFridayDate, 'countdown-timer-container');
    
    console.log('⏰ Black Friday countdown timer started!');
});

function createCountdown(targetDate, containerId) {
    return new CountdownTimer(targetDate, containerId);
}

function getTimeUntil(targetDate) {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const distance = target - now;
    
    if (distance < 0) {
        return 'Target date has passed';
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CountdownTimer, createCountdown, getTimeUntil };
}