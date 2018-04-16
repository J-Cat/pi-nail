import * as util from "util";
import { TemperatureSensor } from "./temperatureSensor";
import { SensorState } from "./sensorState";
import { AggregationType } from "./aggregationType";
import { Guid } from "../helpers/guid";

export class MultipleTemperatureSensor extends TemperatureSensor {
    private _sensors: TemperatureSensor[];
    private _aggregationType: AggregationType = AggregationType.Avg;

    // interval is in seconds
    constructor(sensors: TemperatureSensor[], interval: number, aggregationType: AggregationType = AggregationType.Avg) {
        super(interval);
        this._aggregationType = aggregationType;
        this._sensors = sensors;
    }

    set interval(value: number) {
        this._interval = value;
        this._sensors.forEach(sensor => {
            sensor.interval = value;
        });
    }

    get temperature(): number {
        let values: number[] = [];
        let result: number = 0;
        this._sensors.forEach(sensor => {
            values.push(sensor.temperature);
            result += sensor.temperature;
        });


        switch (this._aggregationType) {
            case AggregationType.Avg:
                if (values.length > 0) {
                    result /= values.length;
                }
                break;

            case AggregationType.Max:
                result = Math.max(...values);
                break;

            case AggregationType.Min:
                result = Math.min(...values);
                break;

            default:
                break;
        }

        return result;
    }

    close = (): void => {
        this._state = SensorState.Closed;
        this._sensors.forEach(sensor => {
            sensor.close();
        });
    }

    readtemp = (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            const tempPromises: Promise<any>[] = [];

            this._sensors.forEach(sensor => {
                tempPromises.push(sensor.readtemp());
            });

            Promise.all(tempPromises)
            .then((values: number[]) => {
                this._onTemperatureRead.dispatch(this, this.temperature);
                resolve(this.temperature);

                if (this._state === SensorState.Running) {
                    setTimeout(this.readtemp, this._interval);
                }
            });
        });
    }

}