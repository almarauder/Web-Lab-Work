const productCards = document.querySelectorAll('.product');
productCards.forEach(function(product) {
    product.addEventListener('click', function() {
        this.classList.toggle('selected');
     
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(0, 210, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(function() {
            ripple.remove();
        }, 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(50);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

window.addEventListener('load', function() {
    const catalogProducts = document.querySelectorAll('.catalog .product');
    if (catalogProducts.length > 0) {
        catalogProducts[0]?.classList.add('new');
        catalogProducts[1]?.classList.add('new');

        catalogProducts[2]?.classList.add('featured');
        catalogProducts[4]?.classList.add('featured');
    }
});