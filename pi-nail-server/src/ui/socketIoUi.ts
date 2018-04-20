/*
 * File: c:\pi-nail\pi-nail-server\src\ui\socketIoUi.ts
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
import * as util from "util";
import * as SocketIO from "socket.io";
import { throttle } from "lodash";
import { createServer, Server } from "http";
import { PiNailActionTypes } from "./piNailActionTypes";
import { IPiNailAction, IPiNailData, ISettings, ITunings, PIDState } from "../models";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { BaseUi } from "./baseUi";
import { requestHandler } from "./requestHandler";

export class SocketIoUi extends BaseUi {
    private _http: Server;
    private _server: SocketIO.Server;
    private _socket!: SocketIO.Socket;

    onDataUpdated = (): void => {
        this.emitData(this._data);
    }

    onSettingsUpdated = (): void => {
        this.emitSettings(this._settings);
    }

    start = (): void => {
        this._http.listen(3000);
        this.emitSettings(this._settings);
    }

    constructor(settings: ISettings) {
        super(settings);

        this._http = createServer(requestHandler);
        this._server = SocketIO(this._http, { path: '/sio' });
        this._server.on("connection", this.onConnection);
        this._server.on("connectionerror", (err: Error) => {
            console.log(err.message);
        });
    }

    private onConnection = (socket: SocketIO.Socket): void => {
        this._socket = socket;
        socket.on('action', (action: IPiNailAction) => {
            switch (action.type) {
                case PiNailActionTypes.SERVER_GET_SETTINGS:
                    this.emitSettings(this._settings);
                    break;

                case PiNailActionTypes.SERVER_UPDATE_SETTINGS:
                    this.updateSettings(action.settings!);
                    break;
                
                case PiNailActionTypes.SERVER_UPDATE_SETPOINT:
                    this.updateSetPoint(action.value!);
                    break;

                case PiNailActionTypes.SERVER_UPDATE_OUTPUT:
                    this.updateOutput(action.value!);
                    break;

                case PiNailActionTypes.SERVER_UPDATE_TUNINGS:
                    this.updateTunings(action.settings!.tunings);
                    break;

                case PiNailActionTypes.SERVER_UPDATE_STATE:
                    this.updateState(action.state!);
                    break;
                }
        });
    };

    emitData: (data: IPiNailData) => void = throttle(
        (data: IPiNailData): void => {
            if (util.isNullOrUndefined(this._socket)) {
                return;
            }

            this._socket.emit('action', { type: PiNailActionTypes.CLIENT_UPDATE_DATA, data: data });
        },
        1000
    );

    emitSettings: (settings: ISettings) => void = throttle(
        (settings: ISettings): void => {
            this._settings = settings;
            if (util.isNullOrUndefined(this._socket)) {
                return;
            }

            this._socket.emit('action', { type: PiNailActionTypes.CLIENT_UPDATE_SETTINGS, settings });
        },
        1000
    );
    
    updateOutput = (value: number): void => {
        this._onChangeOutput.dispatch(value);
        this._data.output = value;
    };

    updateSetPoint = (value: number): void => {
        this._onChangeSetPoint.dispatch(value);
        this._settings.setPoint = value;
    };

    updateTunings = (value: ITunings): void => {
        this._onChangeTunings.dispatch(value);
        this._settings.tunings = value;
    };

    updateSettings = (value: ISettings): void => {
        this._onChangeSettings.dispatch(value);
        this._settings = value;
    }

    updateState = (value: PIDState): void => {
        this._onChangeState.dispatch(value);
        this._settings.state = value;
    }
}