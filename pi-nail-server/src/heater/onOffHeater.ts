/*
 * File: c:\pi-nail\pi-nail-server\src\heater\onOffHeater.ts
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
import { PIDState } from "../models/PIDState";
import { Gpio } from "onoff";
import * as util from "util";
import { HeaterBase } from "./heaterBase";

export class OnOffHeater extends HeaterBase {
    private _heater: Gpio;

    constructor(heaterPin: number, maxPower: number, maxTemp: number, cycleTime: number) {
        super(heaterPin, maxPower, maxTemp, cycleTime);
        this._heater = new Gpio(heaterPin, "out");
    }

    // function to run for heat process adjustment, runs on TC read interval
    processHeat(running?: boolean): void {
        if (!util.isNullOrUndefined(running)) {
            this._running = running;
        }

        if (!this._running) {
            return;
        }

        const duty: number = this._output / this._maxPower;
        // console.log(`Current Temp = ${presentValue}, Set Temp = ${setPoint}, Power = ${duty}`);

        if (this._output !== 0 && this._presentValue < this._maxTemp) {
            const onTime: number = this._cycleTime * duty;
            const offTime: number = this._cycleTime * (1.0 - duty);

            if (duty === 1) {
                // start heater
                setTimeout(() => {
                    this._heater.writeSync(1);
                    this.processHeat();
                }, this._cycleTime);
            } else {
                // start heater
                this._heater.writeSync(1);

                setTimeout(() => {
                    // stop heater
                    this._heater.writeSync(0);
                    setTimeout(() => {
                        this.processHeat();
                    }, this._cycleTime);
                }, onTime);
            }
        } else {
            // stop heater
            this._heater.writeSync(0);
            setTimeout(() => {
                this.processHeat();
            }, this._cycleTime);
        }
    }

    stop(): void {
        this._running = false;
        this._output = 0;
        this._heater.writeSync(0);
    }
}