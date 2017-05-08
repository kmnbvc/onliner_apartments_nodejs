document.addEventListener('DOMContentLoaded', function () {
    $('table').on('click', 'tr:has(td)', function (event) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });

    $('a').attr('onclick', 'return false').on('click', function (event) {
        const href = $(this).attr('href');

        $.get(('http://localhost:3000/details?target=' + href), function (html) {
            const details = document.getElementById('details');
            details.innerHTML = html;
            details.showModal();

            /*const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            iframe.style.width = "640px";
            iframe.style.height = "480px";
            iframe.style.position = 'absolute';
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();*/
        })
    });
});
