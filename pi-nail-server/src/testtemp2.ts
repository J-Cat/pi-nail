/*
 * File: c:\pi-nail\pi-nail-server\src\testtemp2.ts
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
import { AggregationType, MultipleTemperatureSensor, TemperatureSensor, Max6675, Mlx90614 } from "./temperature";
const tempSensor: MultipleTemperatureSensor = new MultipleTemperatureSensor([
    new Mlx90614(0x5A, 0.25),
    new Mlx90614(0x5B, 0.25)
    ], 0.25, AggregationType.Avg);

tempSensor.onTemperatureRead.subscribe((source: TemperatureSensor, value: number): void => {
    console.log(`Temperature = ${value}`);
});
tempSensor.start();