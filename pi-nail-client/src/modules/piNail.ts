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
    windowSize: 25
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
            const x: number = state.tempData.length === 0 ? 1 : state.tempData[state.tempData.length-1][0];
            const setpointData: number[][] = [...state.setpointData, [x, util.isNullOrUndefined(state.settings) ? 0 : state.settings.setPoint]];
            const tempData: number[][] = [...state.tempData, [x, action.data!.presentValue]];
            const heatData: number[][] = [...state.heatData, [x, action.data!.output]];
            while (setpointData.length > state.windowSize) {
                setpointData.shift();
            }
            while (tempData.length > state.windowSize) {
                tempData.shift();
            }
            while (heatData.length > state.windowSize) {
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

        default:
            return state;
    }
};