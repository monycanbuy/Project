const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        new transports.Console({ format: format.simple() }),
        new transports.File({ filename: 'logs/error.log', level: 'error' })
    ]
});

module.exports = logger;
