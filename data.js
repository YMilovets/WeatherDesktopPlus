class Data {
    constructor () {
        this.secReset = 60;
        this.K = 273.15;
        this.lang = "ru";
        this.mmhg = 0.75006156130264;
        this.services = [
            {
                name: "OpenWeatherMap",
                type: "openWeather",
                key: "cd69efeac9ebe9ddb2d6b8c2e030da24",
                link: "https://openweathermap.org/",
            },
            {
                name: "OpenWeatherMap (with HTTPS)",
                type: "openWeatherHttps",
                key: "cd69efeac9ebe9ddb2d6b8c2e030da24",
                link: "https://openweathermap.org/",
            },
            {
                name: "AccuWeather",
                type: "accuWeather",
                key: "kBDiRGPDX0sAPAVtNncEfVNepyE6w2Yj",
                link: "https://www.accuweather.com/",
            },
        ],
        this.default = {
            city: "Moscow",
            time: 5,
            service: "openWeather"
        }
    }
    getTime() {
        return this.secReset;
    }
    getTemperature() {
        return this.K;
    }
    convertTemperatureFromF(temp) {
        return Math.round((temp - 32) / 9 * 5);
    }
    getAPIKey(serviceType) {
        const { key: currentAPIKey } = this.services.find(({ type }) => serviceType === type);
        return currentAPIKey;
    }
    getLanguage() {
        return this.lang;
    }
    getOWURL(city, token, lang, service = "openWeather") {
        switch (service) {          
            case "openWeather":
                return `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${token}&lang=${lang}`;
            case "openWeatherHttps":
                return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${token}&lang=${lang}`;
            case "accuWeather":
                return `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${token}&q=${city}` 
            default:
                return `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${token}&lang=${lang}`;
        }
    }
    getAWURL({ city, token, key, service, lang }) {
        switch (service) {          
            case "getIDAccuWeather":
                return `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${token}&q=${city}`;
            case "accuWeather":
                return `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${key}?apikey=${token}&language=${lang}&details=true` 
            default:
                return `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${key}?apikey=${token}`;
        }

    }
}
module.exports = Data;