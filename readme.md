# pi-nail

pi-nail is an implementation of an **e-nail** controller for the **Raspberry Pi** using **Node.JS** and **TypeScript**.

After much research, I found all the custom solutions out there lacking for PID control under typescript, and very little available period.  I did, however, find the [ArduPID library](https://github.com/Tellicious/ArduPID-Library) by Tellicious, which seemed quite complete and well written, but in the wrong language :)


## Summary

The following are some of the key features of the project:
- Port of the ArduPID library to Typescript
- Implemented in a component based approach to allow replacement of key modules:
  - Temperature Sensor Module
    - MAX6675 K-Type Thermocouple Sensor Implementation
    - MLX90614 IR Temperature Sensor Implementation
    - Multiple Sensor Implementation (allows using average, max, min of multiple sensors)
    - Change MLX90614 Address Program to allow Multiple IR Sensors
  - Heater Module
    - On/Off Heater Implementation for SSR/relay control
    - PWM Heater Implementation for PWM control for induction heaters or DC resistive coils
  - Menu Module
    - Console UI Implemented in [blessed](https://github.com/chjj/blessed) and [blessed-contrib](https://github.com/yaronn/blessed-contrib)
  - Temperature Monitor Service that runs in the background and sends stop signals to the heaters if a maximum temperature is exceeded.


## Demo

![pi-nail Main Screen](https://github.com/J-Cat/pi-nail/docs/images/pinail_blessed_contrib_main_screen.jpg)

![pi-nail Configuration Screen](https://github.com/J-Cat/pi-nail/docs/images/pinail_blessed_contrib_config_screen.jpg)

### Configuring the application

Update configuration for pins and default settings
1. Update pins in app.ts and tempMonitor.ts
2. Update default settings (ie. PID, etc.) in config.json
3. Copy config.json to build folder

### Running the demo

1. Download the package
2. Install npm depencies
3. Build
4. Run

```
git clone https://github.com/J-Cat/pi-nail
npm install
tsc
sudo node build/app.js
```

### Running the temperature monitoring service

The temperature monitoring service can be run with the following command:
```
node build/tempMonitor.js
```
I would also recommend that you install the tempMonitor service to run in the background all the time.  This can be accomplished by installing [PM2 - Advanced, production process manager for Node.js](http://pm2.keymetrics.io/).  Once PM2 is installed it can be used to schedule the service as follows (from the build directory):
1. sudo pm2 start tempMonitor.js --name "tempMonitor"
2. sudo pm2 save

## Upcoming Features
- Express.JS API for UI
- React.JS/Redux/Cordova UI for Mobile