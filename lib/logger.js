var winston = require('winston');
require('winston-daily-rotate-file');
var fs = require('fs');
var cfg = require('./../config.json')

var logDir = cfg.logs.dir;

if (!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
}
var logger = new winston.Logger();
// logger.add(winston.transports.DailyRotateFile,
//     {
//         filename: logDir + '/' + cfg.logs.filename,
//         datePattern: 'yyyyMMdd.',
//         prepend: true,
//         maxFiles: cfg.logs.maxFiles,
//         json: false
//     }
// );
if(cfg.logs.console) {
    logger.add(winston.transports.Console, { timestamp: true });
}
module.exports = logger;
