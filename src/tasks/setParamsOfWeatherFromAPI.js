const { rootPath } = require("electron-root-path");
const path = require("path");
const fs = require("fs");
const {
  convertDataFromAccuWeather,
  convertDataFromOpenWeather,
} = require(path.join(rootPath, "src/packages/methodQueryAPI/adapters"));
const { httpNPMQuery, httpsNPMQuery, mockQuery } = require(path.join(
  rootPath,
  "src/packages/methodQueryAPI"
));

async function setParamsOfWeatherFromAPI(
  city,
  sendParams,
  serviceType = "openWeather",
  trayStyleType = "default"
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
    service: "getIDAccuWeather",
  });

  const sourceAccuWeatherURL = (key) =>
    config.getAWURL({
      key,
      token: config.getAPIKey(serviceType),
      service: serviceType,
      lang: config.getLanguage(),
    });

  let resultData;
  switch (serviceType) {
    case "openWeather":
      resultData = await httpNPMQuery(sourceOpenWeatherURL);
      if (+resultData.cod === 401) {
        sendParams(
          "send-error",
          "WeatherDesktopPlus",
          "Ключ аутентификации API не работает"
        );
        break;
      }
      if (+resultData.cod === 429) {
        sendParams(
          "send-error",
          "WeatherDesktopPlus",
          "Ключ аутентификации API заблокирован"
        );
        break;
      }
      if (+resultData.cod === 404) {
        sendParams("send-error", "WeatherDesktopPlus", "Город не найден");
        break;
      }
      sendParams("send-weather-params", {
        data: convertDataFromOpenWeather(resultData, serviceType),
        trayStyle: trayStyleType,
      });
      break;
    case "openWeatherHttps":
      resultData = await httpsNPMQuery(sourceOpenWeatherURL);
      if (+resultData.cod === 401) {
        sendParams(
          "send-error",
          "WeatherDesktopPlus",
          "Ключ аутентификации API не работает"
        );
        break;
      }
      if (+resultData.cod === 429) {
        sendParams(
          "send-error",
          "WeatherDesktopPlus",
          "Ключ аутентификации API заблокирован"
        );
        break;
      }
      if (+resultData.cod === 404) {
        sendParams("send-error", "WeatherDesktopPlus", "Город не найден");
        break;
      }
      sendParams("send-weather-params", {
        data: convertDataFromOpenWeather(resultData, serviceType),
        trayStyle: trayStyleType,
      });
      break;
    case "accuWeather":
      const requestData = await httpNPMQuery(sourceExistsAccuWeatherURL).catch(
        () => sendParams("send-error", "Город не найден")
      );

      if (requestData.Code === "Unauthorized")
        sendParams(
          "send-error",
          "AccuWeather",
          "Ключ аутентификации API заблокирован"
        );
      if (requestData.Code === "ServiceUnavailable")
        sendParams(
          "send-error",
          "AccuWeather",
          "Разрешенное количество запросов API закончилось"
        );

      if (requestData.length > 0) {
        const [{ Key: locationKey, LocalizedName: city }] = requestData;
        resultData = await httpNPMQuery(
          sourceAccuWeatherURL(locationKey)
        ).catch(() =>
          sendParams("send-error", "Ошибка при подключении к AccuWeather")
        );
        sendParams("send-weather-params", {
          data: convertDataFromAccuWeather(resultData, city, serviceType),
          trayStyle: trayStyleType,
        });
      }
      break;
    default:
      resultData = await httpNPMQuery(sourceOpenWeatherURL);
      sendParams("send-weather-params", {
        data: convertDataFromOpenWeather(resultData, serviceType),
        trayStyle: trayStyleType,
      });
  }
}

module.exports = setParamsOfWeatherFromAPI;
