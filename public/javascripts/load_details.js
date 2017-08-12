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
            dialog.append($('<div class="alert alert-danger">').text(e.data));
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
