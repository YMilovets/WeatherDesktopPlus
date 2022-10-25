const {
  convertDataFromAccuWeather,
  convertDataFromOpenWeather
} = require("../packages/methodQueryAPI/adapters");
const {
  httpNPMQuery,
  httpsNPMQuery,
  mockQuery
} = require("../packages/methodQueryAPI");

async function setParamsOfWeatherFromAPI(
  city,
  sendParams,
  serviceType = "openWeather"
) {
  const Config = require("../../data");

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
      ); 
      if (requestData.length > 0) {
        const [{ Key: locationKey, LocalizedName: city }] = requestData;    
        resultData = await httpNPMQuery(sourceAccuWeatherURL(locationKey));
        sendParams("send-weather-params", convertDataFromAccuWeather(resultData, city, serviceType));
      }
      break;
    default:
      resultData = await httpNPMQuery(sourceOpenWeatherURL);
      sendParams("send-weather-params", convertDataFromOpenWeather(resultData, serviceType));
  }
}

module.exports = setParamsOfWeatherFromAPI;
