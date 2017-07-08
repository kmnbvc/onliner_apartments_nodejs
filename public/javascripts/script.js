function toggle_favorite(apartment, elem) {
    $.post('/favorites/add', apartment, function (data) {
        $(elem).toggleClass('favorite not-favorite');
    })
}

function change_source_state(source, elem) {
    source.active = !(elem.source_state || source.active);
    sendPost('/sources/change_state', source, function (data) {
        elem.source_state = source.active;
        $(elem).children('span.glyphicon').toggleClass('glyphicon-ok glyphicon-remove');
    })
}

function remove_source(name, elem) {
    sendPost('/sources/remove', {name}, function (data) {
        $(elem).parents('tr').remove();
    })
}

function remove_filter(name, elem) {
    sendPost('/filters/remove', {name}, function (data) {
        $(elem).parents('tr').remove();
    })
}

function sendPost(url, data, callback) {
    $.post(url, data, callback).fail(function (response) {
        alert('Error: ' + JSON.stringify(response));
    })
}

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
    $('table.apartments').on('click', 'tr:has(td)', function (event) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });
});