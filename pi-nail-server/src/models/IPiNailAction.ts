/*
 * File: c:\pi-nail\pi-nail-server\src\models\IPiNailAction.ts
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
import { AnyAction } from 'redux';
import { IPiNailData } from './IPiNailData';
import { ISettings } from './ISettings';
import { ITunings } from './ITunings';
import { PIDState } from './PIDState';

export interface IPiNailAction extends AnyAction {
    data?: IPiNailData;
    settings?: ISettings;
    tunings?: ITunings;
    value?: number;
    state?: PIDState;
}
