import '../css/app.css';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll<HTMLElement>('[data-flash-close]').forEach((button) => {
        button.addEventListener('click', () => {
            button.closest('[data-flash]')?.remove();
        });
    });
});
