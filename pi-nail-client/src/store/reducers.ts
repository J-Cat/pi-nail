/*
 * File: c:\pi-nail\pi-nail-client\src\store\reducers.ts
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