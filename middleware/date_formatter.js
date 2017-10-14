const moment = require('moment-timezone');

const format_date = (timezone) => (date) => {
    if (date) {
        return moment.tz(date, 'UTC').tz(timezone).format('YYYY-MM-DD HH:mm:ss')
    }
    return '';
};

const add_formatter = (req, res, next) => {
    const timezone = req.cookies.timezone || 'Europe/Minsk';
    res.locals.format_date = format_date(timezone);
    next();
};


module.exports = add_formatter;
