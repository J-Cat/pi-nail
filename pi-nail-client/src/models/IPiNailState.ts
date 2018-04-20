/*
 * File: c:\pi-nail\pi-nail-client\src\models\IPiNailState.ts
 * Project: c:\pi-nail\pi-nail-client
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
