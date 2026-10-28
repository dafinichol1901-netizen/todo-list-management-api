const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { config } = require('./config/env');
const apiRoutes = require('./routes/apiRoutes');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const swaggerAssetsVersion = require('swagger-ui-dist/package.json').version;
const swaggerAssetRedirects = express.Router();

for (const asset of ['swagger-ui-bundle.js', 'swagger-ui-standalone-preset.js', 'swagger-ui.css']) {
  swaggerAssetRedirects.get(`/${asset}`, (req, res) => (
    res.redirect(`https://cdn.jsdelivr.net/npm/swagger-ui-dist@${swaggerAssetsVersion}/${asset}`)
  ));
}

app.disable('x-powered-by');
app.use(logger);
app.use('/api-docs', 
  helmet({ contentSecurityPolicy: false }), 
  swaggerAssetRedirects,
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, 
    { explorer: true }));
app.use(helmet());
app.use(cors({
  origin: config.corsOrigins.includes('*') ? '*' : config.corsOrigins,
  optionsSuccessStatus: 204,
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

app.use('/api/v1', apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
