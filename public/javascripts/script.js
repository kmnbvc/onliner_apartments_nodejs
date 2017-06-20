function toggle_favorite(apartment, elem) {
    $.post('/favorites/add', apartment, function (data) {
        $(elem).toggleClass('favorite not-favorite');
    });
}

function change_source_state(source, elem) {
    source.active = !(elem.source_state || source.active);
    $.post('/sources/change_state', source, function (data) {
        elem.source_state = source.active;
        $(elem).children('span.glyphicon').toggleClass('glyphicon-ok glyphicon-remove');
    });
}

function remove_source(name, elem) {
    $.post('/sources/remove', {name}, function (data) {
        $(elem).parents('tr').remove();
    });
}

const load_details = (function () {
    let source;

    const start = () => {
        source = new EventSource('/saved/load_details');
        const dialog = create_dialog();

        source.addEventListener('message', function (e) {
            const current = $('#current', dialog);
            const current_val = parseInt(current.text());
            current.text(current_val + 1);
        }, false);

        source.addEventListener('total', function (e) {
            $('#total', dialog).text(e.data);
        }, false);

        source.addEventListener('finish', function (e) {
            finish();
            $('#total', dialog).append(' (finished)');
        }, false);

        source.addEventListener('error', function (e) {
            dialog.append($('<div class="alert alert-danger">').text(e.data || JSON.stringify(e)));
        }, false);
    };

    const finish = () => {
        if (source) source.close();
    };

    const create_dialog = () => {
        const dialog = $('<dialog>');
        dialog.append($('<div class="panel panel-default panel-body">Loading details for apartments: <span id="current">0</span>/<span id="total"></span></div>'));
        dialog.append($('<button>Close</button>'));
        $('button', dialog).on('click', () => dialog[0].close());
        $(document.body).append(dialog);
        dialog[0].showModal();
        return dialog;
    };

    return {start, finish}
})();

function show_modal(id) {
    document.getElementById(id).showModal();
}

function hide_modal(id) {
    document.getElementById(id).close();
}

document.addEventListener('DOMContentLoaded', function () {
    $(`nav li a[href='${window.location.pathname}']`).parents('li').addClass('active');
});

document.addEventListener('DOMContentLoaded', function () {
    $('table').on('click', 'tr:has(td)', function (event) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
});