function attachEvents() {
    $('#btnLoadTowns').on('click', loadTowns);
}

function loadTowns() {
    let townsData = $('#towns').val()
        .split(', ')
        .reduce((acc, el) => {
            acc.towns.push({town: el});
            return acc;
        }, {towns: []});
    renderTowns(townsData);
}

async function renderTowns(townsData) {
    let source = await $.get('towns-template.hbs');
    let template = Handlebars.compile(source);
    $('#root').html(template(townsData));
}