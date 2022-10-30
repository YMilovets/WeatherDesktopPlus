const server = require("http").createServer();  //Инициализация работы сервера http
const io = require("socket.io")(server);        //Подключение сокетов к серверу
const fs = require("fs");                       //Подключение файлового модуля
const { rootPath } = require('electron-root-path');
const path = require('path');
const setParamsOfWeatherFromAPI = require(path.join(rootPath, 'src/tasks/setParamsOfWeatherFromAPI'));
//Инициализация класса с настройками параметров программы по умолчанию
const Config = require(path.join(rootPath, "data"));
const config = new Config();

let city_param, //параметр. хранящий текущий город при работе сервера
    time_param, //параметр. хранящий время обновления при работе сервера
    service_param,
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
service_param = settings.service;

server.listen(8080); //Порт прослушки сервера
//Запрос на получение JSON по URL
setParamsOfWeatherFromAPI(city_param, io.emit.bind(io), service_param);

io.sockets.on("connection", socket => {
    //Событие отправки параметров погоды будет отослано после получения данных со стороннего JSON
    setParamsOfWeatherFromAPI(city_param, io.emit.bind(io), service_param); //Запрос на получение JSON по URL
    clearInterval(timerStamp);
    timerStamp = setInterval(() => {
        setParamsOfWeatherFromAPI(city_param, io.emit.bind(io), service_param); //Запрос на получение JSON по URL
    }, 1000 * config.getTime() * time_param);
    //Обработчик события "Отмена настроек"
    socket.on("cancel_settings", () => {
        io.emit("success"); //Активатор события "Успешное подтверждение"
    });
    //Обработчик события "Изменить настройки"
    socket.on("change_settings", () => {
        io.emit("get_data_config", city_param, time_param, service_param);
    });
    //Обработчик события "Подключение к сервису погоды"
    socket.on("update_connection", () => {
        setParamsOfWeatherFromAPI(city_param, io.emit.bind(io), service_param); //Запрос на получение JSON по URL
        clearInterval(timerStamp);
        timerStamp = setInterval(() => {
            setParamsOfWeatherFromAPI(city_param, io.emit.bind(io), service_param); //Запрос на получение JSON по URL
        }, 1000 * config.getTime() * time_param);
    })
    socket.on("check_exists_city", (city) => {
    });
    //Обработчик события "Подтверждение настроек"
    socket.on("confirm_settings", (city_value, time_value, services_value) => {        
        const conf = {
            city: city_value,
            time: time_value,
            service: services_value || service_param,
        }
        //Записать все изменения в факл конфигурации
        fs.writeFile("config.json", JSON.stringify(conf), err => {
            if (err) console.log(err)
        });
        //Загрузить параметры из файла конфигурации на сервер 
        city_param = city_value;
        time_param = time_value;
        service_param = services_value || service_param;
        //Активатор события "Успешное подтверждение"
        io.emit("success");
        //Сбросить таймер времени обновления запроса и перезапустить в дальнейшем
        clearInterval(timerStamp);
        //Запрос на получение JSON по URL
        setParamsOfWeatherFromAPI(city_param, io.emit.bind(io), service_param);
        timerStamp = setInterval(() => {
            setParamsOfWeatherFromAPI(city_param, io.emit.bind(io), service_param);; //Запрос на получение JSON по URL
        }, 1000 * config.getTime() * time_param);
    })
});