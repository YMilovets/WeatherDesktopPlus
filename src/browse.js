//ToDO: добавить регулярные выражения для обработки маркеров шаблона страницы
const Config = require('../data');

const config = new Config();
const shell = require('electron').shell;

let timeReset = 0, //время обновления запроса
    timeStamp;     //id таймера
let timeMessage = document.querySelector(".time-message");
let serviceLink = document.querySelector(".link_api");
//Подключение клиента к сокету
let socket = io.connect('ws://localhost:8080');
resetInfo();
//Отображение времени последнего полученного запроса
function getTimeReset() {
    timeMessage.textContent = "Обновлено: " + (timeReset < 1 ? "меньше" : timeReset) + " мин. назад";
    timeReset += 1;
}
//Обновление информацию отображения данных запроса
function resetInfo () {
    //После получения JSON запроса выполняется отправка полученной строки в формате экземпляра объекта source
    socket.on("send-weather-params", (source) => {
        if (source !== null) {
            timeReset = 0;
            let params = document.querySelectorAll(".params > ul > li > span");
            let tempUnit = document.querySelector(".temp > span");
            let cityUnit = document.querySelector(".location > span");
            //Работаем со свойствами объекта source
            document.body.style.backgroundImage = "url('../assets/fullscreen/" + source.icon + ".jpg')";
            tempUnit.textContent = Math.round(source.temperature) + "°C";
            cityUnit.textContent = source.city;
            params[0].textContent = source.description;
            params[1].textContent = source.windSpeed + " м/с";
            params[2].textContent = source.pressure !== null ? Math.round(source.pressure * config.mmhg) + " мм рт. ст." : "нет данных";
            params[3].textContent = Math.round(source.feelLikeTemp) + "°C";
            const { name, link } = config.services.find(({ type }) => type === source.service);
            serviceLink.textContent = name;
            serviceLink.href = link;
            //Сбросить таймер обновления запроса
            clearInterval(timeStamp);
            getTimeReset();
            timeStamp = setInterval(() => {
                getTimeReset();
            }, 1000 * config.getTime());
        }
    });

}
//Запуск ссылок в установленном по умолчанию в системе браузере, а не в окне
document.querySelector(".link_api").onclick = function (e) {
    e.preventDefault();
    shell.openExternal(this.href);
};