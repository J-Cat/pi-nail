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