$(() => {
    renderCatTemplate();

    async function renderCatTemplate() {

        let source = await $.get('templateCats.hbs');
        let template = Handlebars.compile(source);

        $('#allCats').html(template({cats}));


        Array.from($('button'))
            .forEach(
                btn => $(btn).click(showStatusInfo));

    }
    function showStatusInfo() {
        let $btn = $(this);

        if ($btn.text() === 'Show status code') {
            $btn.next().show();
            $btn.text('Hide status code');
        } else {
            $btn.next().hide();
            $btn.text('Show status code');
        }
    }

})
