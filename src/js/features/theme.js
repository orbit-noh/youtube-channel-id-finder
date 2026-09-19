const THEME_STORAGE_KEY = 'theme';

export function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');

  themeToggle.addEventListener('click', toggleTheme);

  applyTheme(
    localStorage.getItem(THEME_STORAGE_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  );
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
  } else {
    delete document.documentElement.dataset.theme;
  }
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}
