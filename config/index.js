const env = process.env.NODE_ENV || 'development',
    cfg = require('./config')[env];

const apply_env_params = (cfg) => {
    const result = {};
    for (let [key, value] of entries(cfg)) {
        if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
            const param = value.substring(2, value.length - 1);
            result[key] = env[param] || value;
        } else
            result[key] = value;
    }

    return result;
};

function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

module.exports = apply_env_params(cfg);