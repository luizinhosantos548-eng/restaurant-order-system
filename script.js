// Dados do menu
const menu = [
    { id: 1, name: '🍔 Hamburger', price: 15.00, description: 'Delicioso com queijo derretido', emoji: '🍔' },
    { id: 2, name: '🍕 Pizza', price: 25.00, description: 'Massa crocante e coberturas deliciosas', emoji: '🍕' },
    { id: 3, name: '🌭 Hot Dog', price: 12.00, description: 'Pão quentinho com calabresa', emoji: '🌭' },
    { id: 4, name: '🍟 Batata Frita', price: 8.00, description: 'Crocante e quentinha', emoji: '🍟' },
    { id: 5, name: '🥤 Refrigerante', price: 5.00, description: 'Gelado e refrescante', emoji: '🥤' },
    { id: 6, name: '🍰 Sobremesa', price: 10.00, description: 'Doce e irresistível', emoji: '🍰' }
];

let cart = [];

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    loadCart();
});

// Renderizar menu
function renderMenu() {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = menu.map(item => `
        <div class="menu-item">
            <div class="menu-image">${item.emoji}</div>
            <div class="menu-name">${item.name}</div>
            <div class="menu-description">${item.description}</div>
            <div class="menu-price">R$ ${item.price.toFixed(2)}</div>
            <button class="btn-add" onclick="addToCart(${item.id})">Adicionar ao Carrinho ➕</button>
        </div>
    `).join('');
}

// Adicionar ao carrinho
function addToCart(itemId) {
    const item = menu.find(m => m.id === itemId);
    const cartItem = cart.find(c => c.id === itemId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showAddAnimation(event.target);
}

// Remover do carrinho
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

// Alterar quantidade
function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Atualizar UI do carrinho
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');

    // Atualizar contagem
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Renderizar itens
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-emoji">🛒</div>
                <p>Seu carrinho está vazio!</p>
            </div>
        `;
        cartSummary.innerHTML = '<p>Nenhum item no carrinho</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)} × ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">Remover ❌</button>
                </div>
            </div>
        `).join('');

        // Renderizar resumo
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxa = subtotal * 0.1;
        const total = subtotal + taxa;

        cartSummary.innerHTML = `
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Taxa (10%):</span>
                <span>R$ ${taxa.toFixed(2)}</span>
            </div>
            <div class="summary-line summary-total">
                <span>TOTAL:</span>
                <span>R$ ${total.toFixed(2)}</span>
            </div>
            <button class="btn-checkout" onclick="checkout()">FINALIZAR PEDIDO 🎉</button>
        `;
    }
}

// Finalizar pedido
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Calcular totais
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxa = subtotal * 0.1;
    const total = subtotal + taxa;

    // Gerar número de comprovante
    const receiptNumber = 'BURGER-' + Date.now();

    // Mostrar modal com comprovante
    showReceipt(receiptNumber, subtotal, taxa, total);

    // Salvar pedido
    savePedido({
        numero: receiptNumber,
        itens: JSON.parse(JSON.stringify(cart)),
        subtotal: subtotal,
        taxa: taxa,
        total: total,
        data: new Date().toLocaleString('pt-BR'),
        status: 'Preparando'
    });

    // Limpar carrinho
    cart = [];
    saveCart();
    updateCartUI();
}

// Mostrar comprovante
function showReceipt(receiptNumber, subtotal, taxa, total) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="receipt-title">✅ PEDIDO CONFIRMADO!</div>
            <div class="receipt-number">Nº ${receiptNumber}</div>
            
            <div class="receipt-items">
                ${cart.map(item => `
                    <div class="receipt-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>

            <div class="summary-line">
                <span>Subtotal:</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Taxa:</span>
                <span>R$ ${taxa.toFixed(2)}</span>
            </div>
            
            <div class="receipt-total">
                TOTAL: R$ ${total.toFixed(2)}
            </div>

            <div class="receipt-message">
                👨‍🍳 Seu pedido foi enviado para a cozinha!<br>
                ⏱️ Tempo de preparo: 15-20 minutos<br>
                📱 Acompanhe seu pedido no painel!
            </div>

            <button class="btn-close-receipt" onclick="closeReceipt()">Voltar ao Menu 🏠</button>
        </div>
    `;

    document.body.appendChild(modal);
}

// Fechar comprovante
function closeReceipt() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
    showSection('menu');
}

// Trocar seção
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Esconder todos os botões ativos
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar seção selecionada
    document.getElementById(sectionId).classList.add('active');

    // Ativar botão
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

function savePedido(pedido) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Animação de adição
function showAddAnimation(button) {
    button.textContent = '✅ Adicionado!';
    button.style.animation = 'pulse 0.6s, spin 0.6s';
    
    setTimeout(() => {
        button.textContent = 'Adicionar ao Carrinho ➕';
        button.style.animation = 'glow 2s ease-in-out infinite';
    }, 800);
}

// Ir para admin
function goToAdmin() {
    window.location.href = 'admin.html';
}
