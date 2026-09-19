const elements = {
  search: {
    form: document.querySelector('form.search'),
    submitButton: document.querySelector('.search__submit'),
  },
  result: {
    section: document.querySelector('.result'),
    success: {
      element: document.querySelector('.result__message--success'),
      channelId: document.querySelector('.result__channel-id'),
      copy: {
        button: document.querySelector('.result__copy'),
        label: document.querySelector('.result__copy-label'),
        resetTimer: null,
      },
    },
    warning: {
      element: document.querySelector('.result__message--warning'),
      description: document.querySelector('.result__message--warning .result__description'),
    },
    error: {
      element: document.querySelector('.result__message--error'),
      description: document.querySelector('.result__message--error .result__description'),
    },
  },
};

export function initSearchForm() {
  const exampleItems = document.querySelectorAll('.examples__item');

  elements.search.form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitUrl(e.currentTarget.elements.url.value);
  });

  exampleItems.forEach((item) => {
    item.addEventListener('click', () => {
      submitUrl(item.querySelector('.examples__value').textContent);
    });
  });

  elements.result.success.copy.button.addEventListener('click', copyChannelUrl);
}

async function submitUrl(url) {
  elements.search.submitButton.disabled = true;

  try {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      showWarning();
      return;
    }

    const res = await fetch(`/api?url=${encodeURIComponent(trimmedUrl)}`);

    if (res.status === 400) {
      showWarning();
      return;
    }

    if (res.status === 502) {
      showError('Could not retrieve the channel ID from YouTube.');
      return;
    }

    if (res.status === 504) {
      showError('The request to YouTube timed out — please try again.');
      return;
    }

    if (!res.ok) {
      showError();
      return;
    }

    const { channelId } = await res.json();
    showSuccess(channelId);
  } catch {
    showError();
  } finally {
    elements.search.submitButton.disabled = false;
  }
}

async function copyChannelUrl() {
  const { channelId, copy } = elements.result.success;
  const channelUrl = channelId.textContent.trim();

  try {
    await navigator.clipboard.writeText(channelUrl);
  } catch {
    showError('Could not copy the channel URL — please try again.');
    return;
  }

  clearTimeout(copy.resetTimer);

  copy.button.classList.add('is-copied');
  copy.label.textContent = 'Copied!';

  copy.resetTimer = setTimeout(() => {
    copy.button.classList.remove('is-copied');
    copy.label.textContent = 'Copy URL';
  }, 3000);
}

function showSuccess(channelId) {
  elements.result.success.channelId.textContent = channelId;

  elements.result.section.hidden = false;
  elements.result.success.element.hidden = false;
  elements.result.warning.element.hidden = true;
  elements.result.error.element.hidden = true;
}

function showWarning() {
  elements.result.section.hidden = false;
  elements.result.success.element.hidden = true;
  elements.result.warning.element.hidden = false;
  elements.result.error.element.hidden = true;
}

function showError(message = 'Something went wrong — please try again') {
  elements.result.error.description.textContent = message;

  elements.result.section.hidden = false;
  elements.result.success.element.hidden = true;
  elements.result.warning.element.hidden = true;
  elements.result.error.element.hidden = false;
}
