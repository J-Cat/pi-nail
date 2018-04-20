/*
 * File: c:\pi-nail\pi-nail-server\src\tempMonitor.ts
 * Project: c:\pi-nail\pi-nail-server
 * Created Date: Sunday April 15th 2018
 * Author: J-Cat
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * License: 
 *    This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 
 *    International License (http://creativecommons.org/licenses/by-nc/4.0/).
 * -----
 * Copyright (c) 2018
 */
import * as util from "util";
import { AggregationType, MultipleTemperatureSensor, TemperatureSensor, Max6675, Mlx90614 } from "./temperature";
import { spawnSync, ChildProcess } from "child_process";
import { IConfig } from "./models/IConfig";
import { TemperatureSensorType } from "./models/temperatureSensorType";
const config: IConfig = require("./config.json");

// constants
const tempSensorType: string = TemperatureSensorType.multiple;
const onOffHeaterPin: number = 12; // GPIO # for On/Off heater
const pwmHeaterPin: number = 13; // GPIO # for PWM heater
const tcBus: number = 1; // thermocouple bus #
const tcDevice: number = 2; // thermocouple device #
const maxTemp: number = util.isNumber(config.maxTemp) ? config.maxTemp : 300;

const cleanup: () => void = () => {
    try {
        spawnSync("gpio", ["-g", "mode", onOffHeaterPin.toString(10), "out"]);
        spawnSync("gpio", ["-g", "write", onOffHeaterPin.toString(10), "0"]);
    } catch (e) {
        console.log(e);
    }
    try {
        spawnSync("gpio", ["-g", "mode", pwmHeaterPin.toString(10), "out"]);
        spawnSync("gpio", ["-g", "write", pwmHeaterPin.toString(10), "0"]);
    } catch (e) {
        console.log(e);
    }
};

// capture process termination to ensure cleanup
process.on("exit", code => {
    cleanup();
    process.exit(code);
});

process.on("SIGINT", () => {
    cleanup();
    process.exit();
});

process.on("uncaughtException", err => {
    cleanup();
    console.log(err);
    process.exit();
});

// read temps
let tempSensor: TemperatureSensor;
switch (tempSensorType) {
    case TemperatureSensorType.ir:
        tempSensor = new Mlx90614(0x5A, 10);
        break;

    case TemperatureSensorType.multiple:
        tempSensor = new MultipleTemperatureSensor([
                new Mlx90614(0x5A, 10),
                new Mlx90614(0x5B, 10)
            ],
            10, AggregationType.Avg);
        break;

    default:
        tempSensor = new Max6675(tcBus, tcDevice, 10);
        break;
}

tempSensor.onTemperatureRead.subscribe((source: TemperatureSensor, value: number): void => {
    if (value > maxTemp) {
        cleanup();
        console.log(`Max Temperature Exceeded! Current temperature: ${value}`);
    } else {
        console.log(`Temperature: ${value}`);
    }
});
tempSensor.start();
