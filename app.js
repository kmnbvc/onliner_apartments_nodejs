const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bodyValuesParser = require('./middleware/body_values_parser');
const filters_db = require('./service/filters_db');
const dateFormatter = require('./middleware/date_formatter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyValuesParser);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(dateFormatter);

app.use(function (req, res, next) {
    filters_db.getAll().then(filters => {
        res.locals.filters = filters;
        next();
    }, err => res.send(err))
});

const health = (req, res) => {
    res.writeHead(200);
    res.end();
};
const index = require('./routes/index');
const favorites_apartments = require('./routes/favorites');
const saved_apartments = require('./routes/saved');
const sources = require('./routes/sources');
const filters = require('./routes/filters');
const ignored_apartments = require('./routes/ignored');

app.use('/health', health);
app.use('/', index);
app.use('/favorites', favorites_apartments);
app.use('/saved', saved_apartments);
app.use('/sources', sources);
app.use('/filters', filters);
app.use('/ignored', ignored_apartments);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
