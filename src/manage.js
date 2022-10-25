//ToDo: заменить require на fs.readFileSync
const Config = require('../data');
const config = new Config();

//Подключение клиента к сокету
let socket = io.connect('ws://localhost:3001');

let cityInput = document.getElementById("city");
let timeList = document.querySelector("input[name=time]");
let message = document.querySelector(".message");
let serviceContainer = document.querySelector(".services-data");

function displayServices(container, listServices, defaultService) {
    listServices.forEach(({ name, type }, index) => {
        const groupService = document.createElement("div");
        const radioBtn = document.createElement("input");
        const label = document.createElement("label");
        if (type === defaultService) radioBtn.checked = true;
        radioBtn.type = "radio";
        radioBtn.className = "services-selector";
        radioBtn.id = label.htmlFor = `checkbox_0${index}`;
        radioBtn.name = 'checkbox';
        radioBtn.setAttribute("data-service-name", type);
        label.innerText = name;
        groupService.append(radioBtn);
        groupService.append(label);
        container.append(groupService);
    });
}
//Активатор события "Изменить настройки"
socket.emit("change_settings");
//Обработчик события "Получить данные конфигурации"
socket.on("get_data_config", (city, time, service) => {
    //Заполняем поля настроек после прочтения конфигурационного файла, предварительно проверив их наличие
    cityInput.value = city || config.default.city;
    timeList.value = time || config.default.time;
  
    displayServices(serviceContainer, config.services, service)
    //Выполнение запроса на API OpenWeatherMap
    function queryJSONWeather (sourceURL) {
        let xmlHttp = new XMLHttpRequest();
        //ToDO: Реализовать асинхронный запрос
        xmlHttp.open("GET", sourceURL, false);
        try {
            xmlHttp.send() //Если запрос не может быть отправлен, то вызываем исключение
        } catch (e) {
            throw new Error("Невозможно проверить наличие указанного города, поскольку нет доступа к сети");
        }
        if (xmlHttp.status === 404) { //Если указанный в настройках город не найден (ошибка 404), то вызываем исключение
            cityInput.focus();
            throw new Error("Указанный город не найден");
        }
    }
    //Добавляем событие нажатия на кнопку OK
    document.getElementById("btn_confirm").addEventListener('click', () => {
        try {  
            //Присваиваем значение веденных данных в текстовых полях
            let timeConfig = timeList.value,
                cityConfig = cityInput.value;
            //Вызываем исключение при вводе пустых данных в текстом поле, исключая пробельные символы функцией trim()
            if (cityConfig.trim() === "") {
                cityInput.focus();
                throw new Error("Введите название города");
            }
            //Формируем URL запрос на наличие города в базе погоды OpenWeather
            let source = config.getOWURL(cityConfig, config.getAPIKey(service), config.lang, service);
            socket.emit("check_exists_city", cityConfig);
            queryJSONWeather (source);
            //Проверяем вручную введенное время обновления запроса в numericUpDown
            if (timeConfig < 2 || timeConfig > 60) {
                timeList.focus();
                throw new Error("Время обновления должно быть в пределах от 2 минут до 1 часа");
            }
            //Если ошибки не найдены или исправлен - очищаем сообщение об ошибке, заранее установив визуальную задержку перед закрытием окна
            message.textContent = "";
            //Отправляем сообщение о изменении настроек при помощи события confirm_settings
            socket.emit("confirm_settings", cityConfig, timeConfig);
        } catch (e) {
            message.textContent = e.message;
        }
    });
    document.getElementById("btn_service_confirm").onclick = () => {
        //Присваиваем значение веденных данных в текстовых полях
        let timeConfig = timeList.value,
            cityConfig = cityInput.value;
        let changedServicesConfig = "openWeather";
        Array.prototype.forEach.call(document.querySelectorAll(".services-selector"), (group) => {   
            if (group.checked)
                changedServicesConfig = group.dataset.serviceName;
        })
        socket.emit("confirm_settings", cityConfig, timeConfig, changedServicesConfig);
    };
    document.getElementById("btn_cancel").addEventListener('click', () => socket.emit("cancel_settings"));
});