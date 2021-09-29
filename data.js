class Data {
    constructor () {
        this.secReset = 60;
        this.K = 273.15;
        //this.apiOpenWeather = "928c3029e7b877e24ceaaa33f870cdae";
        this.apiOpenWeather = "edd889032740cb14b8b088326823a079";
        this.lang = "ru";
        this.mmhg = 0.75006156130264;
        this.default = {
            city: "Moscow",
            time: 5
        }
    }
    getTime() {
        return this.secReset;
    }
    getTemperature() {
        return this.K;
    }
    getAPIKey() {
        return this.apiOpenWeather;
    }
    getLanguage() {
        return this.lang;
    }
    getOWURL(city, token, lang) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${token}&lang=${lang}`
    }
}
module.exports = Data;