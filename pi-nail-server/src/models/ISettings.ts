import { ITunings } from "./ITunings";

export interface ISettings {
    tunings: ITunings;
    setPoint: number;
    maxPower: number;
    maxTemp: number;
    tcInterval: number;
    cycleTime: number;
}