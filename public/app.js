const state = {
  search: '',
  categories: [],
  page: 1,
  limit: 8,
  totalPages: 1,
  total: 0,
  requestId: 0,
  controller: null,
  debounceTimer: null,
  cart: loadCart()
};

const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const clearFilters = document.getElementById('clearFilters');
const resetEmpty = document.getElementById('resetEmpty');
const resultSummary = document.getElementById('resultSummary');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsGrid = document.getElementById('resultsGrid');
const emptyState = document.getElementById('emptyState');
const pagination = document.getElementById('pagination');
const searchStatus = document.getElementById('searchStatus');
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const purchaseTotal = document.getElementById('purchaseTotal');
const purchaseButton = document.getElementById('purchaseButton');
const continueShopping = document.getElementById('continueShopping');
const toast = document.getElementById('toast');

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('liveQueryCart') || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch (_error) {
    return {};
  }
}

function saveCart() {
  localStorage.setItem('liveQueryCart', JSON.stringify(state.cart));
}

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderCategories(categories) {
  categoryFilters.innerHTML = categories.map((category) => `
    <label class="category-chip">
      <input type="checkbox" value="${escapeHtml(category)}" />
      <span>${escapeHtml(category)}</span>
    </label>
  `).join('');

  categoryFilters.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', () => {
      state.categories = [...categoryFilters.querySelectorAll('input:checked')].map((item) => item.value);
      state.page = 1;
      fetchProducts();
    });
  });
}

function renderSkeletons() {
  resultsGrid.innerHTML = Array.from({ length: state.limit }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-media shimmer"></div>
      <div class="skeleton-line large shimmer"></div>
      <div class="skeleton-line shimmer"></div>
      <div class="skeleton-line short shimmer"></div>
      <div class="skeleton-footer shimmer"></div>
    </div>
  `).join('');
  resultsGrid.hidden = false;
  emptyState.hidden = true;
  resultsGrid.setAttribute('aria-busy', 'true');
}

function cartQuantity(productId) {
  return Number(state.cart[productId] || 0);
}

function renderCards(items) {
  resultsGrid.innerHTML = items.map((item) => {
    const quantity = cartQuantity(item.id);
    return `
      <article class="card">
        <div class="card-media">
          <span class="card-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
          <span class="card-category">${escapeHtml(item.category)}</span>
        </div>
        <div class="card-content">
          <div class="rating">★ ${item.rating.toFixed(1)}</div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
        <div class="card-bottom">
          <span class="price">${formatPrice(item.price)}</span>
          <button class="add-button ${quantity ? 'is-added' : ''}" type="button" data-add-id="${item.id}">
            ${quantity ? `<span class="mini-cart">🛒</span> Added${quantity > 1 ? ` · ${quantity}` : ''}` : '<span class="plus">+</span> Add to cart'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  resultsGrid.setAttribute('aria-busy', 'false');

  resultsGrid.querySelectorAll('[data-add-id]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.addId)));
  });
}

function pageList(current, total) {
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 4) pages.push('…');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (current < total - 3) pages.push('…');
  pages.push(total);
  return pages;
}

function renderPagination() {
  if (state.total === 0 || state.totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  const pages = pageList(state.page, state.totalPages);
  pagination.innerHTML = `
    <button class="page-btn" data-page="${state.page - 1}" ${state.page <= 1 ? 'disabled' : ''}>Prev</button>
    ${pages.map((page) => page === '…'
      ? '<span class="page-ellipsis">…</span>'
      : `<button class="page-btn ${page === state.page ? 'active' : ''}" data-page="${page}" ${page === state.page ? 'aria-current="page"' : ''}>${page}</button>`).join('')}
    <button class="page-btn" data-page="${state.page + 1}" ${state.page >= state.totalPages ? 'disabled' : ''}>Next</button>
  `;

  pagination.querySelectorAll('.page-btn:not(:disabled)').forEach((button) => {
    button.addEventListener('click', () => {
      state.page = Number(button.dataset.page);
      fetchProducts();
      window.scrollTo({ top: document.querySelector('.results-head').offsetTop - 20, behavior: 'smooth' });
    });
  });
}

function setLoading(isLoading) {
  loadingIndicator.hidden = !isLoading;
  searchStatus.textContent = isLoading ? 'Searching…' : '';
}

async function fetchProducts() {
  const requestId = ++state.requestId;
  if (state.controller) state.controller.abort();
  state.controller = new AbortController();

  const params = new URLSearchParams({
    search: state.search,
    category: state.categories.join(','),
    page: String(state.page),
    limit: String(state.limit)
  });

  renderSkeletons();
  setLoading(true);

  try {
    const result = await fetchJSON(`/api/products?${params.toString()}`, { signal: state.controller.signal });
    if (requestId !== state.requestId) return;

    state.page = result.pagination.page;
    state.totalPages = result.pagination.totalPages;
    state.total = result.pagination.total;

    if (state.total === 0) {
      resultsGrid.hidden = true;
      emptyState.hidden = false;
      resultSummary.textContent = '0 results';
    } else {
      resultsGrid.hidden = false;
      emptyState.hidden = true;
      renderCards(result.data);
      const first = ((state.page - 1) * state.limit) + 1;
      const last = Math.min(state.page * state.limit, state.total);
      resultSummary.textContent = `Showing ${first}–${last} of ${state.total} result${state.total === 1 ? '' : 's'}`;
    }
    renderPagination();
  } catch (error) {
    if (error.name === 'AbortError') return;
    resultsGrid.innerHTML = `
      <div class="error-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">!</div>
        <h3>Couldn’t load products</h3>
        <p>Please check the API and try again.</p>
        <button id="retryButton" class="primary-button" type="button">Retry</button>
      </div>
    `;
    resultsGrid.setAttribute('aria-busy', 'false');
    document.getElementById('retryButton').addEventListener('click', fetchProducts);
    resultSummary.textContent = 'Unable to load results';
    pagination.innerHTML = '';
  } finally {
    if (requestId === state.requestId) setLoading(false);
  }
}

function scheduleSearch() {
  clearTimeout(state.debounceTimer);
  searchStatus.textContent = searchInput.value.trim() ? 'Waiting…' : '';
  state.debounceTimer = setTimeout(() => {
    state.search = searchInput.value.trim();
    state.page = 1;
    fetchProducts();
  }, 400);
}

function resetFilters() {
  clearTimeout(state.debounceTimer);
  searchInput.value = '';
  state.search = '';
  state.categories = [];
  state.page = 1;
  categoryFilters.querySelectorAll('input').forEach((input) => { input.checked = false; });
  fetchProducts();
}

function addToCart(productId) {
  state.cart[productId] = cartQuantity(productId) + 1;
  saveCart();
  renderCart();
  refreshVisibleCartButtons();
  showToast('Added to cart');
}

function changeQuantity(productId, delta) {
  const nextQuantity = cartQuantity(productId) + delta;
  if (nextQuantity <= 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = nextQuantity;
  }
  saveCart();
  renderCart();
  refreshVisibleCartButtons();
}

function removeFromCart(productId) {
  delete state.cart[productId];
  saveCart();
  renderCart();
  refreshVisibleCartButtons();
  showToast('Removed from cart');
}

function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({ id: Number(id), quantity: Number(quantity) }))
    .filter((entry) => entry.quantity > 0);
}

function refreshVisibleCartButtons() {
  resultsGrid.querySelectorAll('[data-add-id]').forEach((button) => {
    const quantity = cartQuantity(Number(button.dataset.addId));
    button.classList.toggle('is-added', quantity > 0);
    button.innerHTML = quantity
      ? `<span class="mini-cart">🛒</span> Added${quantity > 1 ? ` · ${quantity}` : ''}`
      : '<span class="plus">+</span> Add to cart';
  });
}

function renderCart() {
  const entries = cartEntries();
  const itemCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  cartCount.textContent = itemCount;
  cartCount.hidden = itemCount === 0;

  if (entries.length === 0) {
    cartItems.innerHTML = '';
    cartItems.hidden = true;
    cartEmpty.hidden = false;
    cartSummary.hidden = true;
    return;
  }

  const productLookup = new Map(stateCatalog.map((product) => [product.id, product]));
  cartItems.hidden = false;
  cartEmpty.hidden = true;
  cartSummary.hidden = false;

  let subtotal = 0;
  cartItems.innerHTML = entries.map(({ id, quantity }) => {
    const product = productLookup.get(id);
    if (!product) return '';
    const lineTotal = product.price * quantity;
    subtotal += lineTotal;
    return `
      <article class="cart-item">
        <div class="cart-item-icon">${escapeHtml(product.icon)}</div>
        <div class="cart-item-info">
          <div class="cart-item-top">
            <div>
              <span class="cart-category">${escapeHtml(product.category)}</span>
              <h3>${escapeHtml(product.name)}</h3>
            </div>
            <button class="remove-button" type="button" data-remove-id="${product.id}" aria-label="Remove ${escapeHtml(product.name)}">×</button>
          </div>
          <div class="cart-item-bottom">
            <div class="quantity-control" aria-label="Quantity for ${escapeHtml(product.name)}">
              <button type="button" data-quantity-id="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
              <span>${quantity}</span>
              <button type="button" data-quantity-id="${product.id}" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
            <strong>${formatPrice(lineTotal)}</strong>
          </div>
        </div>
      </article>
    `;
  }).join('');

  cartSubtotal.textContent = formatPrice(subtotal);
  cartTotal.textContent = formatPrice(subtotal);
  purchaseTotal.textContent = formatPrice(subtotal);

  cartItems.querySelectorAll('[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.removeId)));
  });
  cartItems.querySelectorAll('[data-quantity-id]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(Number(button.dataset.quantityId), Number(button.dataset.delta)));
  });
}

function openCart() {
  renderCart();
  cartPanel.classList.add('open');
  cartPanel.setAttribute('aria-hidden', 'false');
  cartButton.setAttribute('aria-expanded', 'true');
  cartOverlay.hidden = false;
  document.body.classList.add('cart-open');
  requestAnimationFrame(() => cartOverlay.classList.add('visible'));
}

function closeCartPanel() {
  cartPanel.classList.remove('open');
  cartPanel.setAttribute('aria-hidden', 'true');
  cartButton.setAttribute('aria-expanded', 'false');
  cartOverlay.classList.remove('visible');
  document.body.classList.remove('cart-open');
  setTimeout(() => { cartOverlay.hidden = true; }, 220);
}

async function handlePurchase() {
  const entries = cartEntries();
  if (entries.length === 0) return;

  purchaseButton.disabled = true;
  purchaseButton.querySelector('span:first-child').textContent = 'Processing…';

  try {
    const result = await fetchJSON('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: entries })
    });

    state.cart = {};
    saveCart();
    renderCart();
    refreshVisibleCartButtons();
    showToast(`${result.orderId} confirmed • ${formatPrice(result.total)}`);
    closeCartPanel();
  } catch (_error) {
    showToast('Purchase could not be completed. Try again.');
  } finally {
    purchaseButton.disabled = false;
    purchaseButton.querySelector('span:first-child').textContent = 'Purchase';
  }
}

let stateCatalog = [];

searchInput.addEventListener('input', scheduleSearch);
clearFilters.addEventListener('click', resetFilters);
resetEmpty.addEventListener('click', resetFilters);
cartButton.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartPanel);
cartOverlay.addEventListener('click', closeCartPanel);
continueShopping.addEventListener('click', closeCartPanel);
purchaseButton.addEventListener('click', handlePurchase);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cartPanel.classList.contains('open')) closeCartPanel();
});

async function init() {
  try {
    const [categoryResult, firstPage, secondPage] = await Promise.all([
      fetchJSON('/api/categories'),
      fetchJSON('/api/products?page=1&limit=24'),
      fetchJSON('/api/products?page=2&limit=24')
    ]);
    renderCategories(categoryResult.categories);
    stateCatalog = [...firstPage.data, ...secondPage.data];
  } catch (_error) {
    categoryFilters.innerHTML = '<span class="load-error">Could not load categories.</span>';
    stateCatalog = [];
  }

  renderCart();
  await fetchProducts();
}

init();
