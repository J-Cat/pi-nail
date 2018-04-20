import { combineReducers, Reducer } from 'redux';
import {reducer as responsive} from 'redux-mediaquery'
import { piNailReducer } from '../modules/piNail';
import { IPiNailStore } from './piNailStore';

export const makeRootReducer: Reducer<IPiNailStore> =
    combineReducers({
        responsive,
        piNail: piNailReducer
    });

export default makeRootReducer;