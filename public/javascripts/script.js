document.addEventListener('DOMContentLoaded', function () {
    $('table').on('click', 'tr:has(td)', function (event) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });

    $('a.showModal').attr('onclick', 'return false').on('click', function (event) {
        const href = $(this).attr('href');

        $.get(('http://localhost:3000/details?target=' + href), function (html) {
            const details = document.getElementById('details');
            details.innerHTML = html;
            details.showModal();
        })
    });


});

function toggle_favorite(apartment, elem) {
    $.post('/favorites/add', apartment, function (data) {
        $(elem).toggleClass('favorite not-favorite');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    $(`nav li a[href='${window.location.pathname}']`).parents('li').addClass('active');
});