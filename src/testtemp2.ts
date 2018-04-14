import { TemperatureSensor, Max6675, Mlx90614 } from "./temperature";
const tempSensor: Mlx90614 = new Mlx90614(0.25);
tempSensor.onTemperatureRead.subscribe((value: number): void => {
    console.log(`Temperature = ${value}`);
});
tempSensor.start();