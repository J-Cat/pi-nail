/*
 * File: c:\pi-nail\pi-nail-client\src\modules\piNail.ts
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
import * as util from 'util';
import { IPiNailState, PiNailActionTypes } from '../models';
import { IPiNailAction, ISettings, ITunings, PIDState } from '../models/shared';

type PiNailActions = IPiNailAction;

/* Initial State */
const initialState: IPiNailState = {
    elapsed: 0,
    heatData: [],
    loaded: false,
    setpointData: [],
    tempData: [],
    windowSize: 50
};

/* Action Creators */
export const updateSettings = (settings: ISettings): IPiNailAction => {
    return {
        type: PiNailActionTypes.SERVER_UPDATE_SETTINGS,
        settings
    };
};

export const updateSetPoint = (value: number): IPiNailAction => {
    return {
        type: PiNailActionTypes.SERVER_UPDATE_SETPOINT,
        value
    };
}

export const updateOutput = (value: number): IPiNailAction => {
    return {
        type: PiNailActionTypes.SERVER_UPDATE_OUTPUT,
        value
    }
}

export const updateTunings = (tunings: ITunings): IPiNailAction => {
    return {
        type: PiNailActionTypes.SERVER_UPDATE_TUNINGS,
        tunings
    }
}

export const updateState = (state: PIDState): IPiNailAction => {
    return {
        type: PiNailActionTypes.SERVER_UPDATE_STATE,
        state
    }
}

export const getSettings = (): IPiNailAction => {
    return {
        type: PiNailActionTypes.SERVER_GET_SETTINGS
    };
}

/* Reducer */
export const piNailReducer = (state: IPiNailState = initialState, action: PiNailActions) => {
    switch (action.type) {
        case PiNailActionTypes.CLIENT_UPDATE_DATA:
            const setpointData: number[] = [...state.setpointData, util.isNullOrUndefined(state.settings) ? 0 : state.settings.setPoint];
            const tempData: number[] = [...state.tempData, action.data!.presentValue];
            const heatData: number[] = [...state.heatData, action.data!.output];
            while (setpointData.length > state.windowSize) {
                setpointData.shift();
                tempData.shift();
                heatData.shift();
            }
            return Object.assign({}, state, {
                data: action.data,
                heatData,
                setpointData,
                tempData,
            });

        case PiNailActionTypes.CLIENT_UPDATE_SETTINGS:
            return Object.assign({}, state, {
                settings: action.settings
            });

        case PiNailActionTypes.SERVER_UPDATE_SETTINGS:
            return Object.assign({}, state, {
                settings: action.settings
            });

        case PiNailActionTypes.SERVER_UPDATE_STATE:
            return Object.assign({}, state, {
                settings: Object.assign({}, state.settings, {
                    state: action.state
                })
            });

        case PiNailActionTypes.SERVER_UPDATE_SETPOINT:
            return Object.assign({}, state, {
                settings: Object.assign({}, state.settings, {
                    setPoint: action.value
                })
            });

        case PiNailActionTypes.SERVER_UPDATE_OUTPUT:
            return Object.assign({}, state, {
                data: Object.assign({}, state.data, {
                    output: action.value
                })
            });

        case PiNailActionTypes.SERVER_UPDATE_TUNINGS:
            return Object.assign({}, state, {
                settings: Object.assign({}, state.settings, {
                    tunings: action.tunings
                })
            });

        default:
            return state;
    }
};