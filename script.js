const menu = [
    { id: 1, name: '🍔 Burger Clássico', desc: 'Hambúrguer suculento com queijo derretido', price: 24.90, emoji: '🍔' },
    { id: 2, name: '🥓 Burger Bacon', desc: 'Com bacon crocante e cheddar', price: 29.90, emoji: '🥓' },
    { id: 3, name: '🌮 Burger Especial', desc: 'Receita secreta da casa', price: 32.90, emoji: '🌮' },
    { id: 4, name: '🍟 Combo Fritas', desc: 'Fritas crocantes e salgadinhos', price: 19.90, emoji: '🍟' },
    { id: 5, name: '🥤 Bebida Gelada', desc: 'Refrigerante ou suco natural', price: 8.90, emoji: '🥤' },
    { id: 6, name: '🍰 Sobremesa Doce', desc: 'Brownie ou pudim da casa', price: 14.90, emoji: '🍰' }
];

let cart = [];

function renderMenu() {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = menu.map(item => `
        <div class="menu-item" onclick="addToCart(${item.id})">
            <div class="menu-item-image">${item.emoji}</div>
            <div class="menu-item-content">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-desc">${item.desc}</div>
                <div class="menu-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <button class="menu-item-btn" onclick="event.stopPropagation(); addToCart(${item.id})">Adicionar</button>
            </div>
        </div>
    `).join('');
}

function addToCart(itemId) {
    const item = menu.find(m => m.id === itemId);
    const existing = cart.find(c => c.id === itemId);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    updateCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function changeQty(itemId, delta) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').textContent = count;
    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--gray);">Seu carrinho está vazio 😔</p>';
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }
    
    document.getElementById('checkoutBtn').disabled = false;
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-qty">
                    <button onclick="changeQty(${item.id}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('totalPrice').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function openCart() {
    document.getElementById('cartModal').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    renderCartItems();
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
}

function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemsList = cart.map(item => `${item.qty}x ${item.name}`).join(', ');
    const message = `Olá! Gostaria de fazer um pedido:\n${itemsList}\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    const whatsappLink = `https://wa.me/5547991804694?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappLink, '_blank');
    cart = [];
    updateCart();
    closeCart();
}

document.getElementById('cartBtn').addEventListener('click', openCart);

renderMenu();
updateCart();
