/*
 * File: c:\pi-nail\pi-nail-client\src\types\global.d.ts
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
/* Global definitions for development */
declare interface Window {
    // A hack for the Redux DevTools Chrome extension.
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
    __INITIAL_STATE__?: any;
    // The redux developer tools window
    devToolsExtension?: any;
}

declare var NODE_ENV: string;
declare var __DEV__: boolean;
declare var __PROD__: boolean;
declare var __DEBUG__: boolean;
declare var __DEBUG_NEW_WINDOW__: boolean;
declare var __BASENAME__: string;

declare interface ICallApiAction {
    [x: number]: {
        endpoint?: string;
        method?: string;
        types?: Array<string | object>;
        headers?: { 'Content-Type': string };
        body?: any;
    }
}