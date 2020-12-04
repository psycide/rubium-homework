const burgerButtonOpen = document.querySelector('#burgerButtonOpen');
const burgerButtonClose = document.querySelector('#burgerButtonClose');
const burger = document.querySelector('.burger');

burgerButtonOpen.onclick = function() {
    if (burger.classList.contains('burger_visible')) return;
    burger.classList.add('burger_visible');
};

burgerButtonClose.onclick = function() {
    if (!burger.classList.contains('burger_visible')) return;
    burger.classList.remove('burger_visible');
};