import { AntiWindupType } from "./antiWindupType";

export abstract class PIDBase {
    abstract compute(error: number): number;

    protected _kP: number; // proportional gain
    protected _kI: number; // integral gain
    protected _kD: number; // derivative gain
    protected _nD: number; // derivative filter constant, D(s)=s/(1+s/N), a good rule is: N > (10 * Kd / Kp) (also avoid too large values)
    protected _t: number; // cycle time in milliseconds
    protected _tSec: number; // cycle time in seconds
    protected _kB: number; // back calc gain
    protected _kF: number; // derivative filter coefficient (depends only on N)
    protected _output: number;
    protected _lastTime: number;
    protected _outMin: number = 0;
    protected _outMax: number = 100;
    protected _aW: AntiWindupType;
    protected _errorOld: number;
    protected _duI: number; // integral contribution to the control action
    protected _duD: number; // derivative contribution to the control action

    protected constrain(value: number, minValue: number, maxValue: number): number {
        if (value < minValue) {
            return minValue;
        } else if (value > maxValue) {
            return maxValue;
        } else {
            return value;
        }
    }

    constructor(output: number, kP: number, kI: number, kD: number, nD: number, t: number, aW: AntiWindupType, kB: number) {
        this._aW = aW;
        this._nD = nD;
        this._t = t;
        this._tSec = this._t / 1000;
        this._kF = (2 - this._nD * this._tSec) / (2 + this._nD * this._tSec);
        this._kP = kP;
        this._kD = (2 * kD * this._nD) / (2 + this._nD * this._tSec);
        this._kI = 0.5 * kI * this._tSec;
        if((this._aW === AntiWindupType.BackCalculation) && (this._kI !== 0)) {
            this._kB = 0.5 * kB * this._tSec;
        } else {
            this._kB = 0;
        }

        this._lastTime  = Date.now();
        this._errorOld = 0;
        this._duD = 0;
        this._duI = 0;
        this._output = output;
    }

    autoCompute(error: number): boolean {
        const currentTime: number = Date.now();
        if((currentTime - this._lastTime) >= this._t) {
            this._lastTime = currentTime;
            this.compute(error);
            if ((Date.now() - this._lastTime) > this._t) {
                this._output = 0;
                return false;
            }
            return true;
        } else if ((currentTime - this._lastTime) < 0) {
            this._lastTime = 0;
        }
        return false;
    }

    setTunings(kP: number, kI: number, kD: number, n: number): void {
        if (kP < 0 || kI < 0 || kD < 0 || n < 0) {
            return;
        }

        this._nD = n;
        this._kP = kP;
        this._kF = (2 -this._nD * this._tSec) / (2 + this._nD * this._tSec);
        this._kD = (2 * kD * this._nD) / (2 + this._nD * this._tSec);
        this._kI = 0.5 * kI * this._tSec;
    }

    setBackCalc(kB: number): void {
        if((this._aW === AntiWindupType.BackCalculation) && (this._kI !== 0)) {
            this._kB = 0.5 * kB * this._tSec;
        } else {
            this._kB = 0;
        }
    }

    setSaturation(minValue: number, maxValue: number): void {
        if (minValue >= maxValue) {
            return;
        }

        this._outMin = minValue;
        this._outMax = maxValue;
    }

    reset(): void {
        this._errorOld = 0;
        this._duI = 0;
        this._duD = 0;
    }

    getKp(): number {
        return this._kP;
    }

    getKi(): number {
        return (2 * this._kI / this._tSec);
    }

    getKd(): number {
        return (0.5 * (2 + this._nD * this._tSec) * this._kD / this._nD);
    }

    getKb(): number {
        return (2 * this._kB / this._tSec);
    }

    getOutput(): number {
        return this._output;
    }
}