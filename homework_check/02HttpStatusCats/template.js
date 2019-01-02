$(() => {
    renderCatTemplate();

    async function renderCatTemplate() {
        let source = await $.get('cat-template.hbs');
        let template = Handlebars.compile(source);
        $('#allCats').append(template({cats}));

        attachEvents();
    }

    function attachEvents() {
        Array.from($('button')).forEach(btn => {
            let $btn = $(btn);
            $btn.on('click', () => {
                if ($btn.text() === 'Show status code') {
                    $btn.text('Hide status code');
                    $btn.next().css('display', 'block');
                } else {
                    $btn.text('Show status code');
                    $btn.next().css('display', 'none');
                }
            })
        });
    }
})