import * as util from "util";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { SensorState } from "./sensorState";

export abstract class TemperatureSensor {
    protected _connectionPromise: Promise<void> = Promise.resolve();
    protected _interval: number;
    protected _state: SensorState = SensorState.Closed;
    protected _temp: number = 0;
    protected _onTemperatureRead: SimpleEventDispatcher<number> = new SimpleEventDispatcher<number>();

    abstract close: () => void;
    abstract readtemp: () => Promise<number>;

    // interval is in seconds
    constructor(interval: number = 1) {
        this._interval = interval * 1000;
    }

    set interval(value: number) {
        this._interval = value;
    }

    get interval(): number {
        return this._interval;
    }

    get onTemperatureRead(): ISimpleEvent<number> {
        return this._onTemperatureRead.asEvent();
    }

    get temperature(): number {
        return this._temp;
    }

    start = (): void => {
        this._connectionPromise
        .then(() => {
            this._state = SensorState.Running;
            setTimeout(() => {
                    this.readtemp();
                },
                this._interval
            );
        });
    }

    stop = (): void => {
        this._state = SensorState.Stopped;
    }
}