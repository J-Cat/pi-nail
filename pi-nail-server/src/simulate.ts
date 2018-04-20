/*
 * File: c:\pi-nail\pi-nail-server\src\simulate.ts
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
import * as fs from "fs";
import * as util from "util";
import { PIDIC } from "./ardupid";

const T0: number = 18; // start temperature of the water (°C)
let Takt: number = T0; // actual temperature of the water (°C)
let t: number;
let k: number = 0;
const outFile: fs.WriteStream = fs.createWriteStream("./output.csv");
const StopTime: number = 3600; // total time of the simulation (s)
const cWater: number = 921.1;  // heat capacity J/(kg*°C)
const m: number = 0.1; // weigh of the water (kg)
const Ta: number = 25;  // temperature of the environment (your room, etc.) (°C)
// thermal conductivity, total thermal resistance between
// the water and the surrounding ambient (°C/W)
// list: http://www.engineeringtoolbox.com/thermal-conductivity-d_429.html
const Rth: number = 0.024;
const Pmax: number = 1000;
let deltaT: number; // delta temperature
const dt: number = 0.25; // discrete time step (s)
let Pactual: number;

const kp: number = 10; // proportional gain
const ki: number = 4; // integral gain
const kd: number = 5; // derivative gain
// derivative filter constant D(s)=s/(1+s/N)
// a good rule is: N > (10 * Kd / Kp) (also avoid too large values)
const N: number = 100;
const kb: number = 1; // back-calculation constant (README.md) to be set only if PID_BC used

export function simulate(temp: number): void {
    const controller: PIDIC = new PIDIC(temp, kp, ki, kd, N, Date.now());
    controller.setSaturation(0, 1000);

    // simulate
    setTimeout(() => {
        simulateSingle(controller);
    }, 100);
}

function simulateSingle(controller: PIDIC): void {
    if (k < (StopTime / dt)) {
        console.log(k);
        t = k * dt; // calculate the actual time

        // calculate the actual power
        Pactual = controller.compute(Takt);

        // delta Temperature in the k. step
        deltaT = (Pactual - (Takt - Ta) / Rth) * dt / (cWater * m);
        Takt += deltaT;

        // write every 30. status into the log file
        if (t % 10 === 0) {
            console.log(
                util.format(
                    "%d %d %d %d\n",
                    round(t / 60, 1),
                    round(Takt, 1000),
                    round((Pactual / Pmax) * 100, 1),
                    round(Pactual, 1)
                )
            );
        }
        k += 1;
        setTimeout(() => {
            simulateSingle(controller);
        }, 100);
    } else {
        // close the file stream
        outFile.end();
    }
}

/**
 * Round number
 * Helper
 *
 * @method round
 * @param {Number} original
 * @param {Number} roundTo
 * @return {Number} rounded output
 */
function round(original: number, roundTo: number): number {
  return Math.round(original * roundTo) / roundTo;
}

