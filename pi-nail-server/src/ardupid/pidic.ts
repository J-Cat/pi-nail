import { PIDBase } from "./pidbase";
import { AntiWindupType } from "./antiWindupType";

export class PIDIC extends PIDBase {
    private _errorOldI: number;

    constructor(output: number, kP: number, kI: number, kD: number, n: number, t: number) {
        super(output, kP, kI, kD, n, t, AntiWindupType.IntegratedClamping, 0);
        this._errorOldI = 0;
    }

    compute(error: number): number {
        const duP: number = this._kP * error;
        this._duD = this._kF * this._duD + this._kD * (error - this._errorOld);
        this._duI += this._kI * (error + this._errorOldI);
        let u: number = this._kP * error + this._duI + this._duD;
        if ((((error * u) > 0) && ((u > this._outMax) || (u < this._outMin)))) {
            const d_int: number = this._kI * error;
            this._duI -= d_int;
            u -= d_int;
            this._errorOldI = 0;
        } else {
            this._errorOldI = error;
        }
        this._errorOld = error;
        if (this._errorOld === 0 && error === 0) {
            this._output = 0;
        } else {
            this._output = this.constrain(u, this._outMin, this._outMax);
        }
        return this._output;
    }

    reset(): void {
        super.reset();
        this._errorOldI = 0;
    }
}