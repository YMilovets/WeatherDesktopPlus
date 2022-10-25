const Config = require("../../../../data");
function convertAccuWeatherIcon(iconID) {
  const thumbs = {
    1: "01d",
    2: "01d",
    3: "02d",
    4: "02d",
    5: "50d",
    6: "02d",
    7: "03d",
    8: "04d",
    11: "50d",
    12: "09d",
    13: "10d",
    14: "10d",
    15: "11d",
    16: "11d",
    17: "11d",
    18: "10n",
    19: "13d",
    22: "13d",
    23: "13d",
    33: "01n",
    34: "01n",
    35: "02n",
    36: "02n",
    38: "03n",
    39: "09n",
    40: "09n",
    41: "11n",
    42: "11n",
    43: "13n",
    44: "13n",
  };
  return thumbs[iconID] || "03d"
}

function convertWeatherData(resultData, city, service) {
  if (resultData.length > 0) {
    const [findData] = resultData;
    const config = new Config();
    return {
      service,
      city,
      pressure: null,
      ...Object.keys(findData).reduce((memo, currentParams) => {
        if (currentParams === "Temperature")
          return {
            ...memo,
            temperature: config.convertTemperatureFromF(
              +findData[currentParams].Value
            )
          };
        if (currentParams === "WeatherIcon")
          return {
            ...memo,
            icon: convertAccuWeatherIcon(
              +findData[currentParams]
            )
          };
        if (currentParams === "RealFeelTemperature")
          return {
            ...memo,
            feelLikeTemp: config.convertTemperatureFromF(
              +findData[currentParams].Value
            )
          };
        if (currentParams === "Wind")
          return {
            ...memo,
            windSpeed: +findData[currentParams].Speed.Value
          };
        if (currentParams.includes("IconPhrase"))
          return {
            ...memo,
            description: findData[currentParams]
          };
        return memo;
      }, {})
    };
  }
}

module.exports = convertWeatherData;
