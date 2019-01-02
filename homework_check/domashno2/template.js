$(() => {
    renderCatTemplate();

    function renderCatTemplate() {

        let source = $.get('catTemplate.hbs').then((res) => {
            let template = Handlebars.compile(res);

            $('#allCats').html(template({cats}));

            Array.from($('button'))
                .forEach((button) => $(button).on('click', showAndHideInfo));

            function showAndHideInfo() {
                let btn = $(this);

                if (btn.text() === 'Show status code') {
                    btn.next().css('display', 'block');
                    btn.next('Hide status code');
                } else {
                    btn.next().css('display', 'none');
                    btn.next('Show status code');
                }

            }
        });
    }
});
