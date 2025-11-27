document.getElementById('cart-button')?.addEventListener('click', function() {
    document.getElementById('cart-modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeCartModal() {
    document.getElementById('cart-modal-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('cart-close')?.addEventListener('click', closeCartModal);
document.getElementById('continue-shopping-btn')?.addEventListener('click', closeCartModal);

document.getElementById('cart-modal-overlay')?.addEventListener('click', function(e) {
    if (e.target === this) closeCartModal();
});

document.getElementById('clear-cart-btn')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart.clearCart();
    }
});

document.getElementById('checkout-btn')?.addEventListener('click', function() {
    if (cart.isEmpty()) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout...');
});