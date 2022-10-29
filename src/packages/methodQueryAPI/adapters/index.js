const { rootPath } = require('electron-root-path');
const path = require('path');
const convertDataFromOpenWeather = require(path.join(rootPath, "src/packages/methodQueryAPI/adapters/convertDataFromOpenWeather.js"));
const convertDataFromAccuWeather = require(path.join(rootPath, "src/packages/methodQueryAPI/adapters/convertDataFromAccuWeather.js"));

module.exports = {convertDataFromAccuWeather, convertDataFromOpenWeather};
