function toggle_favorite(id, elem) {
    sendPost('/favorites/toggle', {id}, function (data) {
        $(elem).toggleClass('glyphicon-star glyphicon-star-empty');
    })
}

function toggle_ignored(id, elem) {
    sendPost('/ignored/toggle', {id}, function (data) {
        $(elem).toggleClass('glyphicon-ok glyphicon-ban-circle');
    })
}

function change_source_state(source, elem) {
    source.active = !(elem.source_state || source.active);
    sendPost('/sources/change_state', source, function (data) {
        elem.source_state = source.active;
        $(elem).children('span.glyphicon').toggleClass('glyphicon-ok glyphicon-remove');
    })
}

function add_source() {
    $('form', '#add_source')[0].reset();
    $('form', '#add_source').attr('action', '/sources/add');
    show_modal('add_source');
}

function edit_source(source) {
    for (let [key, value] of entries(source)) {
        $(`:input[name=${key}]`, '#add_source').val(value);
    }
    $('form', '#add_source').attr('action', '/sources/update');
    show_modal('add_source');
}

function remove_source(name, elem) {
    sendPost('/sources/remove', {name}, function (data) {
        $(elem).parents('tr').remove();
    })
}

function add_filter() {
    $('form', '#add_filter')[0].reset();
    $('form', '#add_filter').attr('action', '/filters/add');
    show_modal('add_filter');
}

function edit_filter(filter) {
    for (let [key, value] of entries(filter)) {
        $(`:input[name=${key}]`, '#add_filter').val(value);
    }
    $('form', '#add_filter').attr('action', '/filters/update');
    show_modal('add_filter');
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

function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
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