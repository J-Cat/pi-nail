import * as util from "util";
import { init } from "raspi";
import { I2C } from "raspi-i2c";

const MLX90614_IIC_ADDR: number = 0x5A;
const MLX90614_IIC_ADDR_NEW: number = 0x5B;
const MLX90614_AMBIENT_ADDR: number = 0x06;
const MLX90614_OBJECT_ADDR: number = 0x07;

const _mlx90614: I2C = new I2C();

_mlx90614.writeByteSync(MLX90614_IIC_ADDR, 0x2E);
const result: number = _mlx90614.readByteSync(MLX90614_IIC_ADDR, 0x2E);

const eraseBuffer: Buffer = Buffer.from([0x2E, 0x00, 0x00, 0x6F]);
_mlx90614.writeSync(0x00, eraseBuffer);

for (let i: number = 0; i < 256; i++) {
    try {
        const buffer: Buffer = Buffer.from([0x2E, MLX90614_IIC_ADDR_NEW, 0x00, i]);
        _mlx90614.write(0x00, buffer);
    } catch(e) {}
}

console.log("Cycle power to MLX90614 to commit changes.");

// console.log(result.toString(16));