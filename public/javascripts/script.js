

function toggle_favorite(apartment, elem) {
    $.post('/favorites/add', apartment, function (data) {
        $(elem).toggleClass('favorite not-favorite');
    });
}

function change_source_state(source, value) {
    source.active = value;
    $.post('/sources/change_state', source, function (data) {});
}

function remove_source(name, elem) {
    $.post('/sources/remove', {name}, function (data) {
        $(elem).parents('tr').remove();
    });
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