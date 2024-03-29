# Changelog WeatherDesktopPlus
Weather Desktop Plus v.0.9.2-alpha enhancements and bug-fixes:
- Added to the context menu sending feedback about the state program reviews and updating weather data
- Fixed a port of connnection to the socket server and method names of requests
- Added a new window for waiting for the launch updating requests
- Added an operating system check to display program icons

Weather Desktop Plus v.0.9.0-pre-alpha enhancements and bug-fixes:
- Realeased client - server architecture
- Timer loop iteration launched on the server
- Added sockets for interface between server and client when using sockets
- IPC module is replaced by events of socket.io module
- Added file system module (FS) and changed the way and direction of working with JSON files
- Corrected display of browse information window
- Added a tray notification for different states of requests to OpenWeatherMap 

Weather Desktop Plus v.0.4.7 enhancements:
- Disable to repeat launch new instances

Weather Desktop Plus v.0.4.6 enhancements:
- Improved to send request on weather server and report information of network access

Weather Desktop Plus v.0.4.5 enhancements and bug-fixes:
- Constants were stored in a separate file with config class
- Return location of configuration file because errors exist when displaying data after compile project

Weather Desktop Plus v.0.4.3 enhancements and bug-fixes:
- Add the information about time of request data in the browser form
- Add a verification of params after confirm as a separate message
- Change display parameter of the update request time as numericUpDown

Weather Desktop Plus v0.4.1 bug-fixes:
- Change the behavior of window More which does not close after launch program
- Change call window More after clicking point of context menu and closing apps
- Optimize queries from JSON file and set this fixed count

Weather Desktop Plus v0.4.0 enhancements:
- Create browser of weather in the new window where show information about pressure, feels like temperature, state and windy speed

Weather Desktop Plus v0.3.2 enhancements:
- Change directory of configuration files in the path /data

Weather Desktop Plus v0.3.1 enhancements and bug-fixes:
- Add program information in the dialog box format after clicking point of context menu
- Fix create configuration file at the first launch program
- Create new example of object for comfortable work with the windows

Weather Desktop Plus v0.2.1 bug-fixes:
- Fix JSON request path containing cyrillic symbols with using encodeURI() function

Weather Desktop Plus v0.2.0 enhancements:
- Add setting's window containing configs of time update and local weather, dialog buttons
- Add save all settings in the JSON file are located in the path %appdata%\weather\config.json
- Add get and change settings of time update and local weather

Weather Desktop Plus v0.1.0 enhancements:
- Show city and temperature when hovering the cursor at icon of system tray
- Show context menu after clicking at right mouse button and add menu items (settings, close)
