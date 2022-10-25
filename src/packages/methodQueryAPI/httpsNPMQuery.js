const https = require("https");
/* Функция получения JSON по URL */
async function HttpsNPMQuery(url) {
  return new Promise((resolve) => {
    https.get(url, result => {
        try {
          let body = "";
          result.on("data", chunk => {
            body += chunk;
          });
          result.on("end", () => {
            //данные JSON, полученные в результате запроса к стороннему ресурсу
            let data = JSON.parse(body);
            //Активатор события "Отправить параметры погоды"
            resolve(data);
          });
        } catch (err) {}
      })
      .on("error", err => {
        //Исключение в результате неудачного обращения к внешнему ресурсу
      });
  });
};

module.exports = HttpsNPMQuery;
