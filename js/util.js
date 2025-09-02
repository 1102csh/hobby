const menu = document.getElementById('menu');
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');

function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    menu.classList.add('active');
    menu.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
}

function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    menu.classList.remove('active');
    menu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
}

menu.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
});

backdrop.addEventListener('click', closeDrawer);

// ESC로 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
});