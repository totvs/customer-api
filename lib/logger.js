var winston = require('winston');
require('winston-daily-rotate-file');
var fs = require('fs');
require('dotenv').config();

var logDir = process.env.LOG_DIR;

if (!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}
var logger = new winston.Logger();
logger.add(winston.transports.DailyRotateFile,
    {
        filename: logDir + '/customer-api.log',
        datePattern: 'yyyyMMdd.',
        prepend: true,
        maxFiles: process.env.LOG_MAX_FILES,
        json: false
    }
);
if(process.env.LOG_CONSOLE) {
    logger.add(winston.transports.Console, { timestamp: true });
}
module.exports = logger;