const {format} = require('date-fns');
const {v4: uuid} = require('uuid');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const logevents = async (messages,logFileName) => {
    const dateTime= format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logId = uuid();
    try {
        if(!fs.existsSync(path.join(__dirname, '../logs'))){
            await fsPromises.mkdir(path.join(__dirname, '../logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '../logs',logFileName), `${dateTime} - ${logId} - ${messages}\n`);
    }
    catch (err) {
        console.error(err);
    }
}

const logger    = (req, res, next) => {
    logevents(`Method: ${req.method} - URL: ${req.originalUrl} - IP: ${req.ip}`,'access.log');
    next();
}

module.exports = {logger, logevents};