document.getElementById('showSignModal').addEventListener('click', function (e) {
    e.preventDefault()
    document.getElementById('signModal').style.display = 'block'
});
document.getElementById('showLoginModal').addEventListener('click', function (e) {
    e.preventDefault()
    document.getElementById('loginModal').style.display = 'block'
});

document.getElementById('closeModalLogin').addEventListener('click', function () {
    document.getElementById('loginModal').style.display = 'none';
});document.getElementById('closeModalSign').addEventListener('click', function () {
    document.getElementById('signModal').style.display = 'none';
});

