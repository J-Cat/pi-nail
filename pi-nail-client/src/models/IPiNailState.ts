import { IPiNailData, ISettings } from './shared';

export interface IPiNailState {
    readonly loaded?: boolean;
    readonly data?: IPiNailData;
    readonly settings?: ISettings;
    readonly windowSize: number;
    readonly setpointData: number[];
    readonly tempData: number[];
    readonly heatData: number[];
    readonly elapsed: number;
}
