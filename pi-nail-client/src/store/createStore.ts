
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import * as SocketIO from 'socket.io-client';
import { makeRootReducer } from './reducers';

import { IClientConfig } from '../config/IClientConfig';
const config: IClientConfig = require('../config/config.json');

const socket: SocketIOClient.Socket = SocketIO(config.apiUrl);
const socketIoMiddleware: Middleware = createSocketIoMiddleware(socket, '/');

socket.on('error', (error: Error) => {
    console.log(`Error: ${error.message}`);
});

export function configureStore(initialState?: any): Store<any> {
    const middlewares: any = [
        socketIoMiddleware
    ];

    const composeEnhancers = (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    const newState = initialState || {};
    const store: Store<any> = createStore(makeRootReducer, newState, composeEnhancers(applyMiddleware(...middlewares)));

    return store;
}