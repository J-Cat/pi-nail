# pi-nail

pi-nail is an implementation of an **e-nail** controller for the **Raspberry Pi** using **Node.JS** and **TypeScript**, with an accompanying mobile app written in React.JS/Redux/SocketIO.

After much research, I found all the custom solutions out there lacking for PID control under typescript, and very little available period.  I did, however, find the [ArduPID library](https://github.com/Tellicious/ArduPID-Library) by Tellicious, which seemed quite complete and well written, but in the wrong language :)


## Summary

The following are some of the key features of the project:
<ul>
  <li>Port of the ArduPID library to Typescript</li>
  <li>Implemented in a component based approach to allow replacement of key modules:
    <ul>
      <li>Temperature Sensor Module
        <ul>
          <li>MAX6675 K-Type Thermocouple Sensor Implementation</li>
          <li>MLX90614 IR Temperature Sensor Implementation</li>
          <li>Multiple Sensor Implementation (allows using average, max, min of multiple sensors)</li>
          <li>Change MLX90614 Address Program to allow Multiple IR Sensors</li>
        </ul>
      </li>
      <li>Heater Module
        <ul>
          <li>On/Off Heater Implementation for SSR/relay control</li>
          <li>PWM Heater Implementation for PWM control for induction heaters or DC resistive coils</li>
        </ul>
      </li>
      <li>Socket.IO Service</li>
      <li>React.JS/Redux Web Front End for Mobile</li>
      <li>Console UI Module Implemented in [blessed](https://github.com/chjj/blessed) and [blessed-contrib](https://github.com/yaronn/blessed-contrib)</li>
      <li>Can run as service without Console UI</li>
      <li>Temperature Monitor Service that runs in the background and sends stop signals to the heaters if a maximum temperature is exceeded.</li>
    </ul>
  </li>
</ul>


## Demo
<div class="imgContainer" style="display: float; float-direction: horizontal">
<img style="float:1" alt="pi-nail Main Screen" src="https://github.com/J-Cat/pi-nail/blob/master/docs/images/pinail_blessed_contrib_main_screen.jpg" width="400px" />

<img style="float:1" alt="pi-nail Configuration Screen" src="https://github.com/J-Cat/pi-nail/blob/master/docs/images/pinail_blessed_contrib_config_screen.jpg" width="400px" />
</div>

<div class="imgContainer" style="display: float; float-direction: horizontal">
<img style="float:1" alt="Mobile Main Screen" src="https://github.com/J-Cat/pi-nail/blob/master/docs/images/mobile_home.PNG" width="200x" />

<img style="float:1" alt="Mobile Settings" src="https://github.com/J-Cat/pi-nail/blob/master/docs/images/mobile_settings.PNG" width="200px" />

<img style="float:1" alt="Mobile Graph" src="https://github.com/J-Cat/pi-nail/blob/master/docs/images/mobile_chart.PNG" width="400px" />
</div>


### Configuring the application

#### Server
Update configuration for pins and default settings
<ol>
  <li>Update pins in app.ts and tempMonitor.ts</li>
  <li>Update default settings (ie. PID, etc.) in config.json</li>
  <li>Copy config.json to build folder</li>
</ol>

#### Client
<ol>
  <li>Update configuration in config/config.json</li>
</ol>

### Running the demo
<ol>
  <li>Download the package</li>
  <li>Server
    <ol type="a">
      <li>Install npm dependencies (npm install)</li>
      <li>Build (node_modules/.bin/tsc)</li>
      <li>Run (node build/app.ts)</li>
    </ol>
  </li>
  <li>Client
    <ol type="a">
      <li>Install npm dependencies (npm install)</li>
      <li>Build (npm run build)</li>
      <li>Run (npm run start-ts)</li>
    </ol>
  </li>
</ol>

#### Server (run from Raspberry Pi -- Runs well on PiZeroW)
```
git clone https://github.com/J-Cat/pi-nail
cd pi-nail-server
npm install
node_modules/.bin/tsc
sudo node build/app.js
```

#### Client (run from PC)
```
git clone https://github.com/J-Cat/pi-nail
cd pi-nail-client
npm install
npm run build
npm run start-ts
```

### Running the temperature monitoring service

The temperature monitoring service can be run with the following command:
```
node build/tempMonitor.js
```
I would also recommend that you install the tempMonitor service to run in the background all the time.  This can be accomplished by installing [PM2 - Advanced, production process manager for Node.js](http://pm2.keymetrics.io/).  Once PM2 is installed it can be used to schedule the service as follows (from the build directory):
<ol>
  <li>sudo pm2 start tempMonitor.js --name "tempMonitor"</li>
  <li>sudo pm2 save</li>
</ol>

### Mobile Installation Packages
<ul>
  <li><a href="itms-services://?action=download-manifest&url=https://github.com/J-Cat/pi-nail/raw/master/packages/manifest.plist">iOS</a>
  </li>
</ul>
  

## Upcoming Features
<ul>
  <li>Bluetooth communication module to allow for non-network mobile access.</li>
  <li>WiFi configuration screen in mobile app (can be configured when connected through Bluetooth)</li>
</ul>

##### Licensing
![BY-NC 4.0](https://i.creativecommons.org/l/by-nc/4.0/88x31.png)This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/).
