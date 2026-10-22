const form = document.querySelector('#purchase-form');
const button = document.querySelector('#purchase-button');
const status = document.querySelector('#form-status');

let state = 'idle';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Prevent duplicate submissions.
  if (state === 'submitting') {
    return;
  }

  state = 'submitting';
  button.disabled = true;
  status.textContent = 'Processing your purchase...';

  const userName = document.querySelector('#user-name').value.trim();

  try {
    // Demo async operation; replace with the real purchase request.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Render user input safely as text.
    status.textContent = `Purchase submitted for ${userName}.`;
    state = 'success';
  } catch {
    status.textContent = 'Purchase failed. Please try again.';
    state = 'idle';
  } finally {
    button.disabled = false;
  }
});
