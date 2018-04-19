import * as util from "util";
import * as fs from "fs";
import { createServer, Server } from "http";
import * as SocketIO from "socket.io";

import { AggregationType, TemperatureSensor, MultipleTemperatureSensor, Max6675, Mlx90614 } from "./temperature";
import { PID, PIDIC, PIDBC } from "./ardupid";
import { HeaterBase, PwmHeater, OnOffHeater } from "./heater";
import { requestHandler } from "./ui";
import { ConsoleUi, SocketIoUi } from "./ui";

import { IConfig } from "./models/IConfig";
import { PIDState } from "./models/PIDState";
import { HeaterType } from "./models/heaterType";
import { TemperatureSensorType } from "./models/temperatureSensorType";
import { ITunings } from "./models/ITunings";
import { ISettings } from "./models/ISettings";
import { BaseUi } from "./ui/baseUi";

// constants
const runAsService: boolean = false; // if true disables console UI
const onOffHeaterPin: number = 12; // heater GPIO # for relay
const pwmHeaterPin: number = 13;  // heater GPIO # for PWM
const tcBus: number = 1; // thermocouple bus #
const tcDevice: number = 2; // thermocouple device #
const mlx90614Address: number = 0x5B;
const setPointStep: number = 10;
const filteredSetPointDelta: number = 20;

// pid constants
let kP: number = 10;
let kI: number = 8;
let kD: number = 6;
let n: number = Math.round(10 * kD / kP);

// settings
let setPoint: number = 75;
let filteredSetPoint: number = 0;
let initialSetPoint: number = 0;
let maxPower: number = 100;
let maxTemp: number = 300;
let tcInterval: number = 0.5; // thermocouple read interval in seconds
let cycleTime: number = 500;  // cycle time in milliseconds for heater cycle adjustments
let maxOutputCount: number = 0;

let heaterType: HeaterType = HeaterType.Pwm;
const tempSensorTypes: TemperatureSensorType[] = [TemperatureSensorType.ir, TemperatureSensorType.ir];
const tempSensorArgs: any[] =[
    [0x5A, cycleTime],
    [0x5B, cycleTime]
];

// process variables
let error: number = 0;
let output: number = 0;
let presentValue: number = 0;
let _state: PIDState = PIDState.Stopped;

// main process objects
let userInterfaces: BaseUi[] = [];
let controller: PID;
let heater: HeaterBase;
let tempSensor: TemperatureSensor;
let tempSensors: TemperatureSensor[] = [];

let config: IConfig = require("./config.json");

// event fired when temperature is read from thermocouple
const onTemperatureRead: (source: TemperatureSensor, value: number) => void = (source: TemperatureSensor, value: number) => {
    if (!util.isNumber(value)) {
        return;
    }

    presentValue = Math.round(value * 100) / 100;
    heater.presentValue = presentValue;

    switch (_state) {
        case PIDState.Auto:
            calculateFilteredSetPoint();
            error = filteredSetPoint - presentValue;
            output = controller.compute(error);
            heater.output = output;
            break;

        case PIDState.Manual:
            error = 0;
            break;

        default:
            error = 0;
    }
    userInterfaces.forEach((ui: BaseUi) => {
        ui.data = {
            presentValue: presentValue as number,
            output: output as number,
            error: error as number,
            filteredSetPoint: filteredSetPoint as number
        };
    });
};

const calculateFilteredSetPoint: () => void = () => {
    if (initialSetPoint === 0) {
        filteredSetPoint = setPoint;
    } else if ((presentValue >= (setPoint - 5)) // once set point is reached, stop filtering
        || ((setPoint - initialSetPoint) < setPointStep)) {
        initialSetPoint = 0;
        filteredSetPoint = setPoint;
    } else if ((filteredSetPoint - presentValue) <= (filteredSetPointDelta / 2)) { // if half set point is reached
        if ((filteredSetPoint + setPointStep) > setPoint) {
            filteredSetPoint = Math.min(setPoint, filteredSetPoint + (setPoint / 2));
        } else {
            filteredSetPoint = Math.min(setPoint, filteredSetPoint + setPointStep);
        }
    } else {
        filteredSetPoint = setPoint;
    }
};

const updateTunings: (value: ITunings) => void = (value) => {
    kP = value.p;
    kI = value.i;
    kD = value.d;
    n = Math.round(10 * kD / kP);
    saveConfig();
    controller.setTunings(kP, kI, kD, n);
    controller.reset();
};

const updateSetPoint: (value: number) => void = (value: number) => {
    setPoint = value;
    initialSetPoint = Math.min(presentValue + filteredSetPointDelta, setPoint);
    saveConfig();
};

const updateSettings: (value: ISettings) => void = (value) => {
    setPoint = value.setPoint;
    maxPower = value.maxPower;
    maxTemp = value.maxTemp;
    tcInterval = value.tcInterval;
    cycleTime = value.cycleTime;
    kP = value.tunings.p;
    kI = value.tunings.i;
    kD = value.tunings.d;
    _state = value.state;

    saveConfig();

    heater.updateSettings(maxPower, maxTemp, cycleTime);

    tempSensor.interval = tcInterval;

    controller.setSaturation(0, maxPower);
    controller.setTunings(kP, kI, kD, n);
    controller.reset();
};

const loadConfig: () => Promise<void> = () => {
    // load config
    return new Promise((resolve, reject) => {
        kP = config.p,
        kI = config.i,
        kD = config.d;
        setPoint = config.setPoint;
        maxPower = config.maxPower;
        maxTemp = config.maxTemp;
        tcInterval = config.tcInterval;
        cycleTime = config.cycleTime;

        resolve();
    });
};

const saveConfig: () => void = () => {
    const strConfig: string = "{"
        + `"p":${kP},"i":${kI},"d":${kD},`
        + `"setPoint":${setPoint},`
        + `"maxPower":${maxPower},"maxTemp":${maxTemp},`
        + `"tcInterval":${tcInterval},"cycleTime":${cycleTime}`
        + "}";

    fs.writeFile(
        `${__dirname}/config.json`,
        strConfig,
        (err: NodeJS.ErrnoException) => {}
    );
};

const updateOtherUis:(id: string, isDataUpdate: boolean, isSettingsUpdate: boolean) => void = (id, isDataUpdate, isSettingsUpdate) => {
    userInterfaces.forEach((otherUi: BaseUi) => {
        if (otherUi.id !== id) {
            if (isDataUpdate) {
                otherUi.data = {
                    presentValue: presentValue,
                    output: output,
                    error: error,
                    filteredSetPoint: filteredSetPoint
                };
            }
            if (isSettingsUpdate) {
                otherUi.settings = {
                    tunings: {
                        p: kP,
                        i: kI,
                        d: kD
                    },
                    setPoint: setPoint,
                    maxPower:  maxPower,
                    maxTemp: maxTemp,
                    tcInterval:  output,
                    cycleTime:  cycleTime,
                    state: _state
                };
            }
        }
    });
};

const initUi: (ui: BaseUi) => void = (ui) => {
    ui.onChangeState.subscribe((state: PIDState) => {
        _state = state;
        switch (_state) {
            case PIDState.Auto:
                error = 0;
                output = 0;
                initialSetPoint = Math.min(presentValue + filteredSetPointDelta, setPoint);
                heater.run(output);
                break;

            case PIDState.Manual:
                controller.reset();
                error = 0;
                output = 0;
                heater.run(output);
                break;

            case PIDState.Stopped:
                controller.reset();
                error = 0;
                output = 0;
                heater.stop();
                break;
        }

        updateOtherUis(ui.id, true, true);
    });

    ui.onChangeSetPoint.subscribe((value: number) => {
        error = 0;
        output = 0;
        heater.output = output;
        updateSetPoint(value);
        updateOtherUis(ui.id, true, true);
    });

    ui.onChangeOutput.subscribe((value: number) => {
        error = 0;
        output = value;
        heater.output = output;
        ui.onDataUpdated();
        updateOtherUis(ui.id, true, false);
    });

    ui.onChangeTunings.subscribe((value: ITunings) => {
        error = 0;
        output = 0;
        heater.output = output;
        updateTunings(value);
        updateOtherUis(ui.id, true, true);
    });

    ui.onChangeSettings.subscribe((value: ISettings) => {
        error = 0;
        output = 0;
        heater.output = output;
        updateSettings(value);
        updateOtherUis(ui.id, true, true);
    });

    ui.start();
};

// cleanup
const cleanup: () => void = () => {
    heater.stop();
    tempSensor.stop();
};

// capture process termination to ensure cleanup
process.on("exit", code => {
    cleanup();
    process.exit(code);
});

process.on("uncaughtException", err => {
    cleanup();
    console.log(err);
    process.exit();
});

// main startup
loadConfig()
.then(() => {
    // initialize PID
    controller = new PIDIC(output, kP, kI, kD, n, Date.now());
    controller.setSaturation(0, maxPower);
    // controller = new PIDBC(output, kP, kI, kD, n, Date.now(), 0.5);

    // initialize thermocouple
    tempSensorTypes.forEach((sensorType: TemperatureSensorType, index: number) => {
        switch (sensorType) {
            case TemperatureSensorType.k:
                if (tempSensorArgs[index].length < 3) {
                    throw new Error("Not enough arguments for all temperature sensors!");
                } else {
                    tempSensors.push(new Max6675(tempSensorArgs[index][0], tempSensorArgs[index][1], tempSensorArgs[index][2]));
                }
                break;

            case TemperatureSensorType.ir:
                if (tempSensorArgs[index].length < 2) {
                    throw new Error("Not enough arguments for all temperature sensors!");
                } else {
                    tempSensors.push(new Mlx90614(tempSensorArgs[index][0], tempSensorArgs[index][1]));
                }
        }
    });
    tempSensor = new MultipleTemperatureSensor(tempSensors, tcInterval, AggregationType.Avg);

    // start heat management process
    if (heaterType === HeaterType.OnOff) {
        heater = new OnOffHeater(onOffHeaterPin, maxPower, maxTemp, cycleTime);
    } else {
        heater = new PwmHeater(pwmHeaterPin, maxPower, maxTemp, cycleTime);
    }

    // start reading temperatures
    tempSensor.onTemperatureRead.subscribe(onTemperatureRead);
    tempSensor.start();

    // socket.io web server/
    const server: SocketIoUi = new SocketIoUi({
        tunings: {
            p: kP as number,
            i: kI as number,
            d: kD as number
        },
        setPoint: setPoint as number,
        maxPower: maxPower as number,
        maxTemp: maxTemp as number,
        tcInterval: tcInterval as number,
        cycleTime: cycleTime as number,
        state: _state as PIDState
    });
    userInterfaces.push(server);

    // screen
    if (!runAsService) {
        const menu: ConsoleUi = new ConsoleUi({
            tunings: {
                p: kP as number,
                i: kI as number,
                d: kD as number
            },
            setPoint: setPoint as number,
            maxPower: maxPower as number,
            maxTemp: maxTemp as number,
            tcInterval: tcInterval as number,
            cycleTime: cycleTime as number,
            state: _state as PIDState
        });
        userInterfaces.push(menu);
    }

    userInterfaces.forEach((ui: BaseUi) => { initUi(ui); });
});

