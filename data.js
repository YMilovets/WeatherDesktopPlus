class Data {
  constructor() {
    this.secReset = 60;
    this.K = 273.15;
    this.lang = "ru";
    this.mmhg = 0.75006156130264;
    this.delay = 3000;
    this.email =
      "mailto:thenukerbombs@gmail.com?subject=BugFix: сообщение об ошибке";
    this.icon = [
      {
        type: "Linux",
        path: "linux/256.png",
      },
      {
        type: "other",
        path: "window.ico",
      },
    ];
    this.services = [
      {
        name: "OpenWeatherMap",
        type: "openWeather",
        key: "cd69efeac9ebe9ddb2d6b8c2e030da24",
        link: "https://openweathermap.org/",
        apiRequest: (city, token, lang, key) =>
          `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
            city
          )}&appid=${token}&lang=${lang}`,
      },
      {
        name: "OpenWeatherMap (with HTTPS)",
        type: "openWeatherHttps",
        key: "cd69efeac9ebe9ddb2d6b8c2e030da24",
        link: "https://openweathermap.org/",
        apiRequest: (city, token, lang, key) =>
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
            city
          )}&appid=${token}&lang=${lang}`,
      },
      {
        name: "AccuWeather",
        type: "accuWeather",
        key: "Hudd4BaOmv5mKR44pNrvpAYJSNi5xIKD",
        link: "https://www.accuweather.com/",
        apiRequest: (city, token, lang, key) =>
          `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${key}?apikey=${token}&language=${lang}&details=true`,
      },
    ];
    this.trayStyles = [
      {
        name: "Стандартная тема",
        type: "default",
      },
      {
        name: "Темная тема",
        type: "dark",
      },
      {
        name: "Светлая тема",
        type: "light",
      },
    ];
    this.default = {
      city: "Moscow",
      time: 5,
      service: "openWeather",
      trayStyle: "default",
    };
  }
  getIcon(typeOS) {
    const linuxOS = this.icon.find(({ type }) => type === typeOS);
    const otherOS = this.icon.find(({ type }) => type === "other");
    if (linuxOS && Object.keys(linuxOS).length > 0) return linuxOS.path;
    return otherOS.path;
  }
  getTime() {
    return this.secReset;
  }
  getTemperature() {
    return this.K;
  }
  convertTemperatureFromF(temp) {
    return Math.round(((temp - 32) / 9) * 5);
  }
  getAPIKey(serviceType) {
    const { key: currentAPIKey } = this.services.find(
      ({ type }) => serviceType === type
    );
    return currentAPIKey;
  }
  getLanguage() {
    return this.lang;
  }
  getOWURL(city, token, lang, service = "openWeather") {
    return this.services
      .find(({ type }) => type === service)
      .apiRequest(city, token, lang);
  }
  getAWURL({ city, token, key, service, lang }) {
    if (service === "getIDAccuWeather")
      return `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${token}&q=${city}`;
    return this.services
      .find(({ type }) => type === service)
      .apiRequest(city, token, lang, key);
  }
}
module.exports = Data;
