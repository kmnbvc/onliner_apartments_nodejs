function sse(req, res, next) {
    req.socket.setKeepAlive(true);
    req.socket.setTimeout(0);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.status(200);

    // export a function to send server-side-events
    res.sse = function sse(string, event) {
        if (event) {
            res.write(`event: ${event}\n`);
        }
        res.write(string);

        // support running within the compression middleware
        if (res.flush && string.match(/\n\n$/)) {
            res.flush();
        }
    };

    // write 2kB of padding (for IE) and a reconnection timeout
    // then use res.sse to send to the client
    res.write(':' + Array(2049).join(' ') + '\n');
    res.sse('retry: 2000\n\n');

    // keep the connection open by sending a comment
    const keepAlive = setInterval(function () {
        if (!res.finished)
            res.sse(':keep-alive\n\n');
        else {
            console.log('sse: response is already finished, stoping sse');
            clearInterval(keepAlive);
        }
    }, 20000);

    // cleanup on close
    res.on('finish', function close() {
        console.log('closing sse');
        clearInterval(keepAlive);
    });

    next();
}

module.exports = sse;