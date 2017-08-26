const load_details = (function () {
    let source;

    const start = () => {
        source = new EventSource('/saved/load_details');
        const dialog = create_dialog();

        source.addEventListener('message', function () {
            const current = $('#current', dialog);
            const current_val = parseInt(current.text());
            current.text(current_val + 1);
        }, false);

        source.addEventListener('total', function (msg) {
            $('#total', dialog).text(msg.data);
        }, false);

        source.addEventListener('finish', function () {
            finish();
            $('#total', dialog).append(' (finished)');
        }, false);

        source.addEventListener('error', function (e) {
            dialog.append($('<div class="alert alert-danger">').text(parse_error(e)));
        }, false);
    };

    const parse_error = (err) => {
        return err.data || (source.readyState === EventSource.CONNECTING ? 'An error occurred during a connection' : 'Unknown error occured');
    };

    const finish = () => {
        if (source) source.close();
    };

    const create_dialog = () => {
        const dialog = $('<dialog>');
        dialog.append($('<div class="panel panel-default panel-body">Loading details for apartments: <span id="current">0</span>/<span id="total"></span></div>'));
        dialog.append($('<button id="close">Close</button>'));
        dialog.append($('<button id="reload">Reload page</button>'));
        $('#close', dialog).on('click', () => dialog[0].close());
        $('#reload', dialog).on('click', () => location.reload());
        $(document.body).append(dialog);
        dialog[0].showModal();
        return dialog;
    };

    return {start, finish}
})();
