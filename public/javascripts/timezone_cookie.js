$(function () {
    setTimezoneCookie();
});

function setTimezoneCookie() {
    const timezone_cookie = "timezone";
    const storedTz = Cookies.get(timezone_cookie);

    if (!storedTz || (storedTz && storedTz !== getClientTz())) {
        Cookies.set(timezone_cookie, getClientTz());
        // location.reload();
        alert('reload to update timezone')
    }
}

function getClientTz() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}