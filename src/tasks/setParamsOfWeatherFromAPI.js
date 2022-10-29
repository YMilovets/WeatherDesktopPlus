const { rootPath } = require('electron-root-path');
const path = require('path');
const {
  convertDataFromAccuWeather,
  convertDataFromOpenWeather
} = require(path.join(rootPath, "src/packages/methodQueryAPI/adapters"));
const {
  httpNPMQuery,
  httpsNPMQuery,
  mockQuery
} = require(path.join(rootPath, "src/packages/methodQueryAPI"));

async function setParamsOfWeatherFromAPI(
  city,
  sendParams,
  serviceType = "openWeather"
) {
  const Config = require(path.join(rootPath, "data"));

  const config = new Config();
  const sourceOpenWeatherURL = config.getOWURL(
    city,
    config.getAPIKey(serviceType),
    config.getLanguage(),
    serviceType
  );

  const sourceExistsAccuWeatherURL = config.getAWURL({
    city,
    token: config.getAPIKey(serviceType),
    service: "getIDAccuWeather"
  });

  const sourceAccuWeatherURL = key =>
    config.getAWURL({
      key,
      token: config.getAPIKey(serviceType),
      service: serviceType,
      lang: config.getLanguage()
    });

  let resultData;
  switch (serviceType) {
    case "openWeather":
      resultData = await httpNPMQuery(sourceOpenWeatherURL);
      sendParams("send-weather-params", convertDataFromOpenWeather(resultData, serviceType));
      break;
    case "openWeatherHttps":
      resultData = await httpsNPMQuery(sourceOpenWeatherURL);
      sendParams("send-weather-params", convertDataFromOpenWeather(resultData, serviceType));
    case "accuWeather":
      const requestData = await httpNPMQuery(
        sourceExistsAccuWeatherURL
      ).catch(() => sendParams("send-error", "Город не найден")); 
        
      if (requestData.Code === "Unauthorized")
        sendParams("send-error", "AccuWeather", "Ключ аутентификации API заблокирован");
      if (requestData.Code === "ServiceUnavailable")
        sendParams("send-error", "AccuWeather", "Разрешенное количество запросов API закончилось");
    
      if (requestData.length > 0) {
        const [{ Key: locationKey, LocalizedName: city }] = requestData;    
        resultData = await httpNPMQuery(sourceAccuWeatherURL(locationKey))
          .catch(() => sendParams("send-error", "Ошибка при подключении к AccuWeather"));      
        sendParams("send-weather-params", convertDataFromAccuWeather(resultData, city, serviceType));
      }
      break;
    default:
      resultData = await httpNPMQuery(sourceOpenWeatherURL);
      sendParams("send-weather-params", convertDataFromOpenWeather(resultData, serviceType));
  }
}

module.exports = setParamsOfWeatherFromAPI;
