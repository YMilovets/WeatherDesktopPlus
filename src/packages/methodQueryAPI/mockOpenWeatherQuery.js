const mockData = {
  coord: { lon: 87.1099, lat: 53.7557 },
  weather: [{ id: 804, main: "Clouds", description: "пасмурно", icon: "04n" }],
  base: "stations",
  main: {
    temp: 284.37,
    feels_like: 283.04,
    temp_min: 284.37,
    temp_max: 284.37,
    pressure: 1010,
    humidity: 57,
    sea_level: 1010,
    grnd_level: 985
  },
  visibility: 10000,
  wind: { speed: 2.52, deg: 157, gust: 3.35 },
  clouds: { all: 100 },
  dt: 1666458963,
  sys: {
    type: 2,
    id: 69385,
    country: "RU",
    sunrise: 1666486386,
    sunset: 1666522708
  },
  timezone: 25200,
  id: 1496990,
  name: "Новокузнецк",
  cod: 200
};
async function MockQuery(url = "") {
  return new Promise((resolve) => {
    try {
      setTimeout(() => {
        resolve(mockData);
      }, 200);
    } catch (err) {
      throw err;
    }
  });
}

module.exports = MockQuery;
