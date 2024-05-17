getQueryParams();

function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(function (part) {
        const [key, value] = part.split("=");
        params[key] = decodeURIComponent(value);
    });
    return params;
}

const params = getQueryParams();
if (params.showModal === 'true') {
    alert('true')

    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('afterSign').style.display = 'block';
}
let htlmConnectCOntent = `<h1>Bienvenue</h1>
<p>Vous êtes connecté.</p>`
if (params.connect === 'true') {
    alert('true')
    document.getElementById('connect').innerHTML = htlmConnectCOntent
}

