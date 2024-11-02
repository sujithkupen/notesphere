const {logevents} = require('./logger');

const errorHandler = async (err, req, res, next) => {
    logevents(err.stack,'error.log');

    const status = err.status || 500;

    res.status(status);

    res.json({message:err.message})
}

module.exports = {errorHandler};