class Product {
    constructor(id, name, price, image, description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
    }

    getFormattedPrice() {
        return `${this.price} ₸`;
    }
}

class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    increaseQuantity() {
        this.quantity++;
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    setQuantity(newQuantity) {
        if (newQuantity > 0) {
            this.quantity = newQuantity;
        }
    }

    getSubtotal() {
        return this.product.price * this.quantity;
    }

    getFormattedSubtotal() {
        return `${this.getSubtotal()} ₸`;
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push(new CartItem(product, quantity));
        }
        
        this.saveToStorage();
        this.updateUI();
        return true;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveToStorage();
        this.updateUI();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.setQuantity(newQuantity);
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    increaseQuantity(productId) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.increaseQuantity();
            this.saveToStorage();
            this.updateUI();
        }
    }

    decreaseQuantity(productId) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            if (item.quantity === 1) {
                this.removeItem(productId);
            } else {
                item.decreaseQuantity();
                this.saveToStorage();
                this.updateUI();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
    }

    getFormattedTotal() {
        return `${this.getTotalPrice()} ₸`;
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateUI();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    saveToStorage() {
        const cartData = this.items.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));
        localStorage.setItem('shoppingCart', JSON.stringify(cartData));
    }

    loadFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.map(data => 
                new CartItem(
                    new Product(
                        data.product.id,
                        data.product.name,
                        data.product.price,
                        data.product.image,
                        data.product.description
                    ),
                    data.quantity
                )
            );
        }
    }

    updateUI() {
        this.updateCartBadge();
        this.updateCartModal();
        this.updateCartPage();
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const totalItems = this.getTotalItems();
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    }

    updateCartModal() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (this.isEmpty()) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block';
            }
            if (cartTotal) {
                cartTotal.textContent = '0 ₸';
            }
            return;
        }

        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }

        this.items.forEach(item => {
            const cartItemElement = this.createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });

        if (cartTotal) {
            cartTotal.textContent = this.getFormattedTotal();
        }
    }

    createCartItemElement(cartItem) {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${cartItem.product.image}" alt="${cartItem.product.name}">
            <div class="cart-item-details">
                <h4>${cartItem.product.name}</h4>
                <p class="cart-item-price">${cartItem.product.getFormattedPrice()}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${cartItem.product.id}">-</button>
                <input type="number" class="quantity-input" value="${cartItem.quantity}" min="1" data-id="${cartItem.product.id}">
                <button class="quantity-btn increase" data-id="${cartItem.product.id}">+</button>
            </div>
            <div class="cart-item-subtotal">${cartItem.getFormattedSubtotal()}</div>
            <button class="remove-item" data-id="${cartItem.product.id}">×</button>
        `;

        this.attachCartItemListeners(div, cartItem.product.id);

        return div;
    }

    attachCartItemListeners(element, productId) {
        const decreaseBtn = element.querySelector('.decrease');
        const increaseBtn = element.querySelector('.increase');
        const quantityInput = element.querySelector('.quantity-input');
        const removeBtn = element.querySelector('.remove-item');

        decreaseBtn.addEventListener('click', () => this.decreaseQuantity(productId));
        increaseBtn.addEventListener('click', () => this.increaseQuantity(productId));
        removeBtn.addEventListener('click', () => this.removeItem(productId));
        
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            this.updateQuantity(productId, newQuantity);
        });
    }

    updateCartPage() {
        const cartPageContainer = document.getElementById('cart-page-items');
        if (cartPageContainer) {
            this.renderCartPage();
        }
    }

    renderCartPage() {
        const container = document.getElementById('cart-page-items');
        const totalElement = document.getElementById('cart-page-total');
        
        if (!container) return;

        container.innerHTML = '';

        if (this.isEmpty()) {
            container.innerHTML = `
                <div class="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Add some books to get started!</p>
                    <a href="catalog.html" class="btn">Browse Catalog</a>
                </div>
            `;
            return;
        }

        this.items.forEach(item => {
            const itemElement = this.createCartItemElement(item);
            container.appendChild(itemElement);
        });

        if (totalElement) {
            totalElement.textContent = this.getFormattedTotal();
        }
    }
}

const cart = new ShoppingCart();

document.addEventListener('DOMContentLoaded', function() {
    cart.updateUI();

    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();

            const productCard = this.closest('.product');
            const productId = productCard.dataset.productId || Date.now().toString();
            const productName = productCard.querySelector('h3').textContent;
            const productPriceText = productCard.querySelector('.price').textContent;
            const productPrice = parseInt(productPriceText.replace(/[^\d]/g, ''));
            const productImage = productCard.querySelector('img').src;
            const productDescription = productCard.querySelector('.description')?.textContent || '';

            const product = new Product(
                productId,
                productName,
                productPrice,
                productImage,
                productDescription
            );

            cart.addItem(product);

            this.classList.add('clicked');
            const originalText = this.textContent;
            this.textContent = '✓ Added to Cart!';
            this.style.background = 'linear-gradient(135deg, #00d2ff, #3a7bd5)';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
                this.classList.remove('clicked');
            }, 1500);
        });
    });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Product, CartItem, ShoppingCart, cart };
}