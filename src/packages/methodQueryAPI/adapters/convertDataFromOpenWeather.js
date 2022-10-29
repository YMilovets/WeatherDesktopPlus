const { rootPath } = require('electron-root-path');
const path = require('path');
const Config = require(path.join(rootPath, "data"));

function convertWeatherData(resultData, service) {
  const config = new Config();
  return {
    service,
    description: resultData.weather[0].description,
    icon: resultData.weather[0].icon,
    windSpeed: +resultData.wind.speed,
    city: resultData.name,
    ...Object.keys(resultData.main).reduce((memo, currentParams) => {
      if (currentParams.includes("temp"))
        return {
          ...memo,
          temperature: +resultData.main[currentParams] - config.getTemperature()
        };
      if (currentParams.includes("feels_like"))
        return {
          ...memo,
          feelLikeTemp: +resultData.main[currentParams] - config.getTemperature()
        };
      if (currentParams.includes("pressure"))
        return {
          ...memo,
          pressure: +resultData.main[currentParams]
        };
      return memo;
    }, {})
  };
}

module.exports = convertWeatherData;
