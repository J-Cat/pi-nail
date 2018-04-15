import * as util from "util";
import { TemperatureSensor } from "./temperatureSensor";
import { SensorState } from "./sensorState";
import { init } from "raspi";
import { I2C } from "raspi-i2c";

const MLX90614_AMBIENT_ADDR: number = 0x06;
const MLX90614_OBJECT_ADDR: number = 0x07;

export class Mlx90614 extends TemperatureSensor {
    private static _i2c: I2C;
    private _i2cAddress: number;

    static get i2cInstance(): I2C {
        if (util.isNullOrUndefined(Mlx90614._i2c)) {
            Mlx90614._i2c = new I2C();
        }
        return Mlx90614._i2c;
    }

    // interval is in seconds
    constructor(i2cAddress: number, interval: number) {
        super(interval);
        this._i2cAddress = i2cAddress;
        this._connectionPromise = new Promise<void>((resolve, reject) => {
            init(() => {
                const _i2c: I2C = Mlx90614.i2cInstance;
                resolve();
            });
        });
    }

    close = (): void => {
        this._state = SensorState.Closed;
    }

    readtemp = (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            Mlx90614.i2cInstance.writeByte(this._i2cAddress, MLX90614_OBJECT_ADDR, (err: Error | string | null) => {
                if (!util.isNullOrUndefined(err)) {
                    reject(`Error: ${err instanceof Error ? err.message : err}`);
                }

                let result: number;
                Mlx90614.i2cInstance.read(this._i2cAddress, MLX90614_OBJECT_ADDR, 3, (err1: string | Error | null, data: number | Buffer | null) => {
                    if (data instanceof Buffer) {
                        result = data[0] | (data[1] << 8);
                        result = (result * 0.02) - 273.15;
                        result = Math.round(result * 100) / 100;
                        this._temp = result;
                        this._onTemperatureRead.dispatch(this, result);
                        resolve(result);
                    }

                    if (this._state === SensorState.Running) {
                        setTimeout(this.readtemp, this._interval);
                    }
                });
            });
        });
    }
}