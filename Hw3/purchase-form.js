
const form = document.querySelector('#purchase-form');
const button = document.querySelector('#purchase-button');
const status = document.querySelector('#form-status');

const loading = document.querySelector('#product-loading');
const productInfo = document.querySelector('#product-info');
const productPrice = document.querySelector('#product-price');
const productStock = document.querySelector('#product-stock');
const productError = document.querySelector('#product-error');
const retryButton = document.querySelector('#retry-button');
const soldOutMessage = document.querySelector('#sold-out-message');

let state = 'idle';
let productState = 'loading';

// Demo data. A real application should load this from an API.
const product = {
  price: 199000,
  stock: 5,
};

function showProductError() {
  productState = 'error';
  loading.hidden = true;
  productInfo.hidden = true;
  productError.hidden = false;
  soldOutMessage.hidden = true;
  button.disabled = true;
}

async function loadProduct() {
  productState = 'loading';

  loading.hidden = false;
  productInfo.hidden = true;
  productError.hidden = true;
  soldOutMessage.hidden = true;
  button.disabled = true;
  status.textContent = '';

  try {
    // Simulate loading product information.
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated successful response.
    productPrice.textContent =
      `${product.price.toLocaleString('vi-VN')} VND`;
    productStock.textContent = String(product.stock);

    loading.hidden = true;
    productError.hidden = true;

    if (product.stock <= 0) {
      productState = 'sold-out';
      productInfo.hidden = false;
      soldOutMessage.hidden = false;
      button.disabled = true;
      return;
    }

    productState = 'available';
    productInfo.hidden = false;
    soldOutMessage.hidden = true;
    button.disabled = state !== 'idle';
  } catch {
    showProductError();
  }
}

retryButton.addEventListener('click', () => {
  loadProduct();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (state === 'submitting' || state === 'success') {
    return;
  }

  if (productState !== 'available') {
    status.textContent = 'Product is not available for purchase.';
    return;
  }

  state = 'submitting';
  button.disabled = true;
  status.textContent = 'Processing your purchase...';

  const userName = document.querySelector('#user-name').value.trim();
  const userAddress = document
    .querySelector('#user-address')
    .value.trim();

  try {
    // Demo only: this does not create a real order.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    status.textContent =
      `Purchase submitted for ${userName} at ${userAddress}.`;

    state = 'success';
  } catch {
    status.textContent = 'Purchase failed. Please try again.';
    state = 'idle';
  } finally {
    button.disabled =
      state !== 'idle' || productState !== 'available';
  }
});

// Load product data when the page starts.
loadProduct();

