import { combineReducers, Reducer } from 'redux';
import { piNailReducer } from '../modules/piNail';
import { IPiNailStore } from './piNailStore';

export const makeRootReducer: Reducer<IPiNailStore> =
    combineReducers({
        piNail: piNailReducer
    });

export default makeRootReducer;