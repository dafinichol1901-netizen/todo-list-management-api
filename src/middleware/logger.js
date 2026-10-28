const morgan = require('morgan');
const { config } = require('../config/env');

const loggerFormat = (tokens, req, res) => {
  const duration = tokens['response-time'](req, res);

  return `[${new Date().toISOString()}] 
  ${tokens.method(req, res)} 
  ${req.path} 
  ${tokens.status(req, res)} - 
  ${duration}ms`;
};

const requestLogger = morgan(loggerFormat);

function logger(req, res, next) {
  if (config.nodeEnv === 'test') {
    return next();
  }

  return requestLogger(req, res, next);
}

module.exports = logger;
