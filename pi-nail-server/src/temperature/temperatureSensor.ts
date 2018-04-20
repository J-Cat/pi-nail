/*
 * File: c:\pi-nail\pi-nail-server\src\temperature\temperatureSensor.ts
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
import * as util from "util";
import { IEvent, EventDispatcher } from "strongly-typed-events";
import { SensorState } from "./sensorState";
import { Guid } from "../helpers/guid";

export abstract class TemperatureSensor {
    protected _connectionPromise: Promise<void> = Promise.resolve();
    protected _interval: number;
    protected _state: SensorState = SensorState.Closed;
    protected _temp: number = 0;
    protected _onTemperatureRead: EventDispatcher<TemperatureSensor, number> = new EventDispatcher<TemperatureSensor, number>();
    protected _id: string = Guid.newGuid();

    abstract close: () => void;
    abstract readtemp: () => Promise<number>;

    // interval is in seconds
    constructor(interval: number) {
        this._interval = interval * 1000;
    }

    set interval(value: number) {
        this._interval = value;
    }

    get interval(): number {
        return this._interval;
    }

    get onTemperatureRead(): IEvent<TemperatureSensor, number> {
        return this._onTemperatureRead.asEvent();
    }

    get temperature(): number {
        return this._temp;
    }

    get id(): string {
        return this._id;
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