import { ITunings } from "./ITunings";
import { PIDState } from "./PIDState";

export interface ISettings {
    tunings: ITunings;
    setPoint: number;
    maxPower: number;
    maxTemp: number;
    tcInterval: number;
    cycleTime: number;
    state: PIDState;
}