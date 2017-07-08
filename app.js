const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bodyValuesParser = require('./middleware/body_values_parser');
const moment = require('moment');
const filters_db = require('./service/filters_db');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyValuesParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    filters_db.getAll().then(filters => {
        res.locals.filters = filters;
        next();
    })
});

const index = require('./routes/index');
const favorites_apartments = require('./routes/favorites');
const saved_apartments = require('./routes/saved');
const details = require('./routes/details');
const sources = require('./routes/sources');
const filters = require('./routes/filters');

app.use('/', index);
app.use('/favorites', favorites_apartments);
app.use('/saved', saved_apartments);
app.use('/details', details);
app.use('/sources', sources);
app.use('/filters', filters);

app.locals.moment = moment;
app.locals.format_date = (date) => {
    return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '';
};

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
