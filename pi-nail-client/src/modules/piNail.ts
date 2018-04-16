import { IPiNailAction, IPiNailState } from '../models';

type PiNailActions = IPiNailAction;

const initialState: IPiNailState = {
    elapsed: 0,
    // data,
    heatData: [],
    loaded: false,
    setpointData: [],
    tempData: [],
    windowSize: 25
};

/* Action Creators */

/* Reducer */
export const piNailReducer = (state: IPiNailState = initialState, action: PiNailActions) => {
    switch (action.type) {
        default:
            return state;
    }
};