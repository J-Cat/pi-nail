import { PIDState } from "../models/PIDState";
import { PWM } from "raspi-pwm";
import * as util from "util";
import { HeaterBase } from "./heaterBase";

const frequency: number = 10;

export class PwmHeater extends HeaterBase {
    private _heater: PWM;

    constructor(heaterPin: number, maxPower: number, maxTemp: number, cycleTime: number) {
        super(heaterPin, maxPower, maxTemp, cycleTime);
        this._heater = new PWM({
            pin: `GPIO${heaterPin}`,
            frequency: frequency
        });
        this._heater.write(0);
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
        setTimeout(() => {
            if (this._output !== 0 && this._presentValue < this._maxTemp) {
                this._heater.write(duty);
            } else {
                this._heater.write(0);
            }
            this.processHeat();
        }, this._cycleTime);
    }

    stop(): void {
        this._running = false;
        this._output = 0;
        this._heater.write(0);
    }
}