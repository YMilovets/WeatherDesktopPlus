const {app, dialog, Menu, Tray} = require('electron');
const path = require('path');
const Window = require('./Window');
const Config = require('./data');
//Возможность подключения клиента к серверу сокетов
const io = require("socket.io-client");
const MenuTrayItem = require('./MenuItems');
//app.setPath("userData", path.join(__dirname, "data"));
const config = new Config();
const { fork } = require("child_process"); //запуск подпроцессов программы
//после запуска программы инициируем работу сервера
let serverProcess = fork(__dirname + "/server.js", [
    "--subprocess",
    app.getVersion()
])

//Object.prototype.isEmpty = isEmpty;
function isEmpty(obj) {
    for (let key in obj) {
      // если тело цикла начнет выполняться - значит в объекте есть свойства
      return false;
    }
    return true;
}

let setting = null, //окно настроек
    about = null, //информационное окно "О программе"
    browse = null; //окно "Подробной обзор прогноза погоды"

function main() {
    const socket = io.connect("ws://localhost:3001")
    let tray = new Tray(__dirname + '/assets/tray/03d.png');

    browse = new Window({
        file: path.join('src', 'browse.html'),
        width: 535,
        height: 250,
        autoHideMenuBar: true,
        //resizable: false,
        icon: __dirname + '/assets/icon/window.ico'
    });
    browse.hide();
    browse.setMenu(null); //Отключить отображение меню после нажатия клавиши Alt

    //Настройки контекстного меню
    const contextMenu = Menu.buildFromTemplate([
        { label: "О программе",
            click()
            {
                if (!about) about = dialog.showMessageBox({
                    type: 'info',
                    buttons: ['OK'],
                    message: 'Версия: ' + app.getVersion() +
                        "\nПрограмма позволяет компактно отображать информацию о погоде в системной области уведомлений" +
                        "\nTheNukerBombs, 2020 - "+ new Date().getFullYear() +". Все права защищены\n" +
                        "\nПри создании были использованы следующие исходные материалы: flaticon.com - iconixar, freepik, Pixel perfect, " +
                        "github.com - CodeDraken",
                    title: "Программа Weather Desktop Plus"
                }).then( result => {
                    if (!result.response) about = null;
                });
            }
        },
        { label: 'Настройки', click()
            {
                if (!setting) {
                    setting = new Window({
                        file: path.join('src', 'config.html'),
                        width: 320,
                        height: 285,
                        autoHideMenuBar: true,
                        resizable: false,
                        icon: __dirname + '/assets/icon/window.ico'
                    });
                    setting.on('closed', () => setting = null);
                    setting.setMenu(null);
                    setting.show();
                    //setting.webContents.openDevTools();
                }
                else {
                    setting.show();
                    setting.focus();
                }

            }
        },
        { label: 'Подробный прогноз', click()
            {
                browse.show();
                browse.on('closed', () => browse = null);
                browse.on('close', (e) => {
                    e.defaultPrevented = true;
                    browse.hide();
                })
            }
        },
        { label: "Закрыть", click()
            {
                browse.on('close', (e) => {
                    e.defaultPrevented = false;
                });
                app.quit();
            }
        }
    ]);

    setTimeout(() => tray.setContextMenu(contextMenu), 1000);
    socket.on("send-weather-params", data => {
        if (isEmpty(data)) getTrayCanceled();
        else {
            if (data.cod && +data.cod === 401) {
                tray.displayBalloon({
                    title: "WeatherDesktopPlus",
                    content: "Ключ аутентификации API не работает"
                })
            }
            else if (data.cod && +data.cod === 429) {
                tray.displayBalloon({
                    title: "WeatherDesktopPlus",
                    content: "Ключ аутентификации API заблокирован"
                })
            }
            else if (data.cod && +data.cod === 404) {
                tray.displayBalloon({
                    title: "WeatherDesktopPlus",
                    content: "Город не найден"
                })
            }
            getTrayAccepted(data);
        }
        
    })
    //Прием ассинхронных событий подтверждения настроек от формы config.html
    socket.on("success", () => {
        setting.close();
    });

    //Изменение отображаемых данных после подтвердения настроек
    function getTrayCanceled() {
        tray.setToolTip("Нет данных");
        tray.setImage(__dirname + '/assets/tray/01d.png');
    }
    function getTrayAccepted(src) {
        tray.setToolTip(src.city + " " + Math.round(src.temperature) + "°C");
        tray.setImage(__dirname + '/assets/tray/' + src.icon + '.png');
    }

}
//Запретить повторный запуск программы
let lockInstance = app.requestSingleInstanceLock();
if (!lockInstance) {
    app.quit();
    return;
}
app.on('second-instance', (event, argv, cwd) => {});

app.on('ready', main);

app.on("window-all-closed", function () {
    if (setting) setting.close();
    if (about) about.close();
});