/*
 * File: c:\pi-nail\pi-nail-server\src\ardupid\pidbc.ts
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

export class PIDBC extends PIDBase {
    private _awBcOld: number;

    constructor(output: number, kP: number, kI: number, kD: number, n: number, t: number, kB: number) {
        super(output, kP, kI, kD, n, t, AntiWindupType.BackCalculation, kB);
        this._awBcOld = 0;
    }

    compute(error: number): number {
        const duP: number = this._kP * error;
        this._duI += this._kI * (error + this._errorOld);
        this._duD = this._kF * this._duD + this._kD * (error - this._errorOld);
        const u: number = duP + this._duI + this._duD;
        const awBc: number = this.constrain(u, this._outMin, this._outMax) - u;
        this._duI += this._kB * (awBc + this._awBcOld);
        this._errorOld = error;
        this._awBcOld = awBc;
        this._output = this.constrain((duP + this._duI + this._duD), this._outMin, this._outMax);
        return this._output;
    }

    reset(): void {
        super.reset();
        this._awBcOld = 0;
    }
}