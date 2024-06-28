// Import our custom CSS
function showPage(pageClass) {
    const pages = document.querySelectorAll('.starting-page, .game-page, .stats-page, .tournaments-page');
    pages.forEach(page => {
        page.style.display = page.classList.contains(pageClass) ? 'block' : 'none';
    });
}

function navigateTo(page) {
    history.pushState({ page: page }, null, `#${page}`);
    showPage(`${page}-page`);
}

window.addEventListener('popstate', (event) => {
    const page = event.state ? event.state.page : 'starting';
    showPage(`${page}-page`);
});

document.addEventListener('DOMContentLoaded', () => {
    // Показать стартовую страницу по умолчанию или страницу из URL
    const initialPage = location.hash ? location.hash.substring(1) : 'starting';
    showPage(`${initialPage}-page`);
});