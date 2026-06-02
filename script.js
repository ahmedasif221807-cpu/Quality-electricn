// Product Database
const products = [
    { id: 1, name: 'LED Bulbs (10-pack)', price: 24.99, category: 'lighting', description: 'Energy-efficient LED bulbs', emoji: '💡', rating: '⭐⭐⭐⭐⭐' },
    { id: 2, name: 'Power Strip', price: 15.99, category: 'electronics', description: '6 outlet surge protector', emoji: '🔌', rating: '⭐⭐⭐⭐' },
    { id: 3, name: 'Electric Drill', price: 79.99, category: 'tools', description: 'Cordless 20V drill/driver', emoji: '🔨', rating: '⭐⭐⭐⭐⭐' },
    { id: 4, name: 'Microwave Oven', price: 129.99, category: 'appliances', description: '1000W digital microwave', emoji: '🔥', rating: '⭐⭐⭐⭐' },
    { id: 5, name: 'Electric Kettle', price: 34.99, category: 'appliances', description: '2.2L stainless steel kettle', emoji: '☕', rating: '⭐⭐⭐⭐⭐' },
    { id: 6, name: 'USB Charging Hub', price: 29.99, category: 'electronics', description: '6-port USB charger', emoji: '🔋', rating: '⭐⭐⭐⭐' },
    { id: 7, name: 'Ceiling Fan', price: 89.99, category: 'appliances', description: '52" remote control fan', emoji: '💨', rating: '⭐⭐⭐⭐' },
    { id: 8, name: 'Flashlight', price: 19.99, category: 'lighting', description: 'LED flashlight with batteries', emoji: '🔦', rating: '⭐⭐⭐⭐⭐' },
    { id: 9, name: 'Extension Cord', price: 12.99, category: 'electronics', description: '50ft heavy-duty extension cord', emoji: '🧵', rating: '⭐⭐⭐⭐' },
    { id: 10, name: 'Electric Saw', price: 149.99, category: 'tools', description: 'Circular saw 7.25" blade', emoji: '⚡', rating: '⭐⭐⭐⭐⭐' },
    { id: 11, name: 'Water Heater', price: 199.99, category: 'appliances', description: '50L electric water heater', emoji: '🌡️', rating: '⭐⭐⭐⭐' },
    { id: 12, name: 'Flashlight Set', price: 25.99, category: 'lighting', description: 'Pack of 4 tactical flashlights', emoji: '🔆', rating: '⭐⭐⭐⭐⭐' }
];

// Shopping Cart
let cart = [];
let filteredProducts = [...products];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.querySelector('.cart-icon').addEventListener('click', openCart);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProducts();
    });
}

// Display Products
function displayProducts(productsToDisplay) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">${product.rating}</div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Products
function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter products
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(p => p.category === category);
    }

    displayProducts(filteredProducts);
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCartItems();
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Open Cart
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    displayCartItems();
}

// Close Cart
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Display Cart Items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalDiv = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        totalDiv.innerHTML = '<h3>Total: $0.00</h3>';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;
    totalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order confirmed! Total: $${total.toFixed(2)}\n\nThank you for your purchase! Your order will be delivered soon.`);
    cart = [];
    updateCartCount();
    closeCart();
}

// Form Submission
function submitForm(event) {
    event.preventDefault();
    alert('Thank you for contacting us! We will respond to your message soon.');
    event.target.reset();
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations for notifications
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Close cart when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}