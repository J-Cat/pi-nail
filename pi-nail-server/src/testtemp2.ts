import { AggregationType, MultipleTemperatureSensor, TemperatureSensor, Max6675, Mlx90614 } from "./temperature";
const tempSensor: MultipleTemperatureSensor = new MultipleTemperatureSensor([
    new Mlx90614(0x5A, 0.25),
    new Mlx90614(0x5B, 0.25)
    ], 0.25, AggregationType.Avg);

tempSensor.onTemperatureRead.subscribe((source: TemperatureSensor, value: number): void => {
    console.log(`Temperature = ${value}`);
});
tempSensor.start();