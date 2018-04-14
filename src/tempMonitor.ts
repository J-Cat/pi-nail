import * as util from "util";
import { TemperatureSensor, Max6675, Mlx90614 } from "./temperature";
import { spawnSync, ChildProcess } from "child_process";
import { IConfig } from "./models/IConfig";
import { TemperatureSensorType } from "./models/temperatureSensorType";
const config: IConfig = require("./config.json");

// constants
const tempSensorType: TemperatureSensorType = TemperatureSensorType.k;
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
const tempSensor: TemperatureSensor
    = tempSensorType === TemperatureSensorType.k
        ? new Max6675(tcBus, tcDevice, 10)
        : new Mlx90614(10);

tempSensor.onTemperatureRead.subscribe((value: number): void => {
    if (value > maxTemp) {
        cleanup();
        console.log(`Max Temperature Exceeded! Current temperature: ${value}`);
    } else {
        console.log(`Temperature: ${value}`);
    }
});
tempSensor.start();
