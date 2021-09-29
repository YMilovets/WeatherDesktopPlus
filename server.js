const https = require("https");
const server = require("http").createServer();  //Инициализация работы сервера http
const io = require("socket.io")(server);        //Подключение сокетов к серверу
const fs = require("fs");                       //Подключение файлового модуля
//Инициализация класса с настройками параметров программы по умолчанию
const Config = require('./data');
const config = new Config();

let city_param, //параметр. хранящий текущий город при работе сервера
    time_param, //параметр. хранящий время обновления при работе сервера
    sourceURL,  //формирование адреса для текущего запроса
    timerStamp, //id таймера
    query; 
try {
    //Проверка на наличие файла
    fs.access('./config.json', (err) => {
        if (err) return;
    });
    //Синхронное чтение файла сохраненных настроек
    query = fs.readFileSync("./config.json", 'utf-8');
    if (!query) throw new Error("Файл пустой"); //Проверка на наличие содержимого файла
} catch(e) {
    //Если файл не был создан или пустой, то записать настройки с городом и временем обновления по умолчанию
    fs.writeFileSync("./config.json", JSON.stringify(config.default));
    query = fs.readFileSync("config.json", 'utf-8');
}
let settings = JSON.parse(query); 
//настройки, извлеченные с файла config.json, записываются в соотвествующие переменные сервера
city_param = settings.city;
time_param = settings.time;
//Формирование URL запроса
sourceURL = config.getOWURL(city_param, config.getAPIKey(), config.getLanguage());

server.listen(3001); //Порт прослушки сервера
//Запрос на получение JSON по URL
getHttpsJSON(sourceURL);

io.sockets.on("connection", socket => {
    //Событие отправки параметров погоды будет отослано после получения данных со стороннего JSON
    getHttpsJSON(sourceURL); //Запрос на получение JSON по URL
    clearInterval(timerStamp);
    timerStamp = setInterval(() => {
        getHttpsJSON(sourceURL); //Запрос на получение JSON по URL
    }, 1000 * config.getTime() * time_param);
    //Обработчик события "Отмена настроек"
    socket.on("cancel_settings", () => {
        io.emit("success"); //Активатор события "Успешное подтверждение"
    });
    //Обработчик события "Изменить настройки"
    socket.on("change_settings", () => {
        io.emit("get_data_config", city_param, time_param);
    });
    //Обработчик события "Подтверждение настроек"
    socket.on("confirm_settings", (city_value, time_value) => {
        const conf = {
            city: city_value,
            time: time_value
        }
        //Записать все изменения в факл конфигурации
        fs.writeFile("config.json", JSON.stringify(conf), err => {
            if (err) console.log(err)
        });
        //Загрузить параметры из файла конфигурации на сервер 
        city_param = city_value;
        time_param = time_value;
        sourceURL = config.getOWURL(city_param, config.getAPIKey(), config.getLanguage()); //Формирование URL запроса
        //Активатор события "Успешное подтверждение"
        io.emit("success");
        //Сбросить таймер времени обновления запроса и перезапустить в дальнейшем
        clearInterval(timerStamp);
        //Запрос на получение JSON по URL
        getHttpsJSON(sourceURL);
        timerStamp = setInterval(() => {
            getHttpsJSON(sourceURL); //Запрос на получение JSON по URL
        }, 1000 * config.getTime() * time_param);
    })
});
//Функция получения JSON по URL
function getHttpsJSON(url) {
    https.get(url, result => {
        try {
            let body = "";
            result.on("data", chunk => {
                body += chunk;
            })
            result.on("end", () => {
                //данные JSON, полученные в результате запроса к стороннему ресурсу
                let data = JSON.parse(body);
               //Активатор события "Отправить параметры погоды"
                io.emit("send-weather-params", data)
            })
        } catch (err) {
            
        }
    }).on("error", err => {
        //Исключение в результате неудачного обращения к внешнему ресурсу
    });
}