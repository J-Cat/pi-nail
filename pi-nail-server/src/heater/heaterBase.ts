export abstract class HeaterBase {
    protected _maxPower!: number;
    protected _maxTemp!: number;
    protected _cycleTime!: number;

    protected _running: boolean = false;
    protected _presentValue: number = 0;
    protected _output: number = 0;

    abstract stop(): void;
    abstract processHeat(running?: boolean): void;

    constructor(heaterPin: number, maxPower: number, maxTemp: number, cycleTime: number) {
        this.updateSettings(maxPower, maxTemp, cycleTime);
    }

    updateSettings(maxPower: number, maxTemp: number, cycleTime: number): void {
        this._maxPower = maxPower;
        this._maxTemp = maxTemp;
        this._cycleTime = cycleTime;
    }

    get presentValue(): number {
        return this._presentValue;
    }

    set presentValue(value: number) {
        this._presentValue = value;
    }

    get output(): number {
        return this._output;
    }

    set output(value: number) {
        this._output = value;
    }

    run(output: number): void {
        setTimeout(() => {
            this._running = true;
            this._output = output;
            this.processHeat(true);
        }, this._cycleTime);
    }
}