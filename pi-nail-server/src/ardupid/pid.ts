/*
 * File: c:\pi-nail\pi-nail-server\src\ardupid\pid.ts
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
import { PIDBase } from "./pidbase";
import { AntiWindupType } from "./antiWindupType";

export class PID extends PIDBase {
    constructor(output: number, kP: number, kI: number, kD: number, n: number, t: number) {
        super(output, kP, kI, kD, n, t, AntiWindupType.None, 0);
    }

    compute(error: number): number {
        const duP: number = this._kP * error;
        this._duI += this._kI * (error + this._errorOld);
        this._duD = this._kF * this._duD + this._kD * (error - this._errorOld);
        this._errorOld = error;
        this._output = this.constrain((duP + this._duI + this._duD), this._outMin, this._outMax);
        return this._output;
    }

    reset(): void {
        super.reset();
    }
}