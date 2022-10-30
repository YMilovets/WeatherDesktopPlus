const { rootPath } = require('electron-root-path');
const path = require('path');
const httpNPMQuery = require(path.join(rootPath, "src/packages/methodQueryAPI/httpNPMQuery"));
const httpsNPMQuery = require(path.join(rootPath, "src/packages/methodQueryAPI/httpsNPMQuery"));
const mockQuery = require(path.join(rootPath, "src/packages/methodQueryAPI/mockOpenWeatherQuery"));

module.exports = { httpNPMQuery, httpsNPMQuery, mockQuery };
