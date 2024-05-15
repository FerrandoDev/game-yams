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
getQueryParams();

function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(function(part) {
        const [key, value] = part.split("=");
        params[key] = decodeURIComponent(value);
    });
    return params;
}

const params = getQueryParams();
if (params.showModal === 'true') {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('afterSign').style.display = 'block';
}
