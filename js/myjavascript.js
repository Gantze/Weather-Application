let themes = document.getElementById('floatingSelect');

themes.addEventListener('change', changeTheme);

function changeTheme() {
    let theme = themes.value;

    document.querySelector('body').style.backgroundImage = `url('./images/${theme}.jpg')`;

    let title = document.querySelector('h1');
    switch (theme) {
        case 'night':
            title.style.color = '#b5b3b3';
            break;
        case 'rain':
            title.style.color = '#571b1b';
            break;
        case 'snow':
            title.style.color = '#d62626';
            break;
        default:
            title.style.color = '#000000';
    }
}
