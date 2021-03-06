/*
 * File: c:\pi-nail\pi-nail-server\src\ui\piNailActionTypes.ts
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
/* Action Types */
export class PiNailActionTypes {
    /* tslint:disable */
    public static readonly CLIENT_UPDATE_DATA: string = 'PINAIL/CLIENT/UPDATE_DATA';
    public static readonly CLIENT_UPDATE_SETTINGS: string = 'PINAIL/CLIENT/UPDATE_SETTINGS';

    public static readonly SERVER_UPDATE_SETTINGS: string = 'PINAIL/SERVER/UPDATE_SETTINGS';
    public static readonly SERVER_UPDATE_SETPOINT: string = 'PINAIL/SERVER/UPDATE_SETPOINT';
    public static readonly SERVER_UPDATE_OUTPUT: string = 'PINAIL/SERVER/UPDATE_OUTPUT';
    public static readonly SERVER_UPDATE_TUNINGS: string = 'PINAIL/SERVER/UPDATE_TUNINGS';
    public static readonly SERVER_UPDATE_STATE: string = 'PINAIL/SERVER/UPDATE_STATE';
    public static readonly SERVER_GET_SETTINGS: string = 'PINAIL/SERVER/GET_SETTINGS';
}
