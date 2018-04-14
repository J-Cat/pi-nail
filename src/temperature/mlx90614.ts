import * as util from "util";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { TemperatureSensor } from "./temperatureSensor";
import { SensorState } from "./sensorState";
import { init } from "raspi";
import { I2C } from "raspi-i2c";

const MLX90614_IIC_ADDR: number = 0x5A;
const MLX90614_AMBIENT_ADDR: number = 0x06;
const MLX90614_OBJECT_ADDR: number = 0x07;

export class Mlx90614 extends TemperatureSensor {
    private _mlx90614: I2C;

    // interval is in seconds
    constructor(interval: number = 1) {
        super(interval);
        this._connectionPromise = new Promise<void>((resolve, reject) => {
            init(() => {
                this._mlx90614 = new I2C();
                resolve();
            });
        });
    }

    close = (): void => {
        this._state = SensorState.Closed;
    }

    readtemp = (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            this._mlx90614.writeByte(MLX90614_IIC_ADDR, MLX90614_OBJECT_ADDR, (err: Error) => {
                if (err) {
                    reject(`Error: ${err.message}`);
                }

                let result: number;
                this._mlx90614.read(MLX90614_IIC_ADDR, MLX90614_OBJECT_ADDR, 3, (err1: Error, data: Buffer) => {
                    result = data[0] | (data[1] << 8);
                    result = (result * 0.02) - 273.15;
                    result = Math.round(result * 100) / 100;
                    this._onTemperatureRead.dispatch(result);
                    resolve(result);

                    if (this._state === SensorState.Running) {
                        setTimeout(this.readtemp, this._interval);
                    }
                });
            });
        });
    }
}