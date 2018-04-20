/*
 * File: c:\pi-nail\pi-nail-client\src\store\createStore.ts
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
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux';
import { mediaQueryTracker } from 'redux-mediaquery'
import createSocketIoMiddleware from 'redux-socket.io';
import * as SocketIO from 'socket.io-client';
// import * as util from 'util';
import { getSettings } from '../modules/piNail';
import { makeRootReducer } from './reducers';
// import { PiNailActionTypes } from '../models/piNailActionTypes';



import { IClientConfig } from '../config/IClientConfig';
import { IPiNailStore } from './piNailStore';
const config: IClientConfig = require('../config/config.json');

let socket: SocketIOClient.Socket;
let socketIoMiddleware: Middleware;

const connectionPromise: Promise<void> = new Promise<void>((resolve, reject) => {
    socket = SocketIO(config.apiUrl, { path: '/sio' });
    socketIoMiddleware = createSocketIoMiddleware(socket, 'PINAIL/');
    
    socket.on('error', (error: Error) => {
        console.log(`Error: ${error.message}`);
    });
    
    socket.on('connecterror', (error: Error) => {
        console.log(`Connect error: ${error.message}`);
    });
    
    socket.on('connect', () => {
       resolve(); 
    });    
});

export function configureStore(initialState?: any): Store<any> {
    const middlewares: any = [        
        socketIoMiddleware
    ];

    const composeEnhancers = (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    const newState = initialState || {};
    const store: Store<IPiNailStore> = createStore<IPiNailStore>(makeRootReducer, newState, composeEnhancers(applyMiddleware(...middlewares)));

    connectionPromise.then(() => {
        store.dispatch(getSettings());
    });

    mediaQueryTracker({
        isPortrait: "screen and (orientation: portrait)"
    }, store.dispatch);

    return store;
}

