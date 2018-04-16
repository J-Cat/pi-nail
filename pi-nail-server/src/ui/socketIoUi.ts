import * as util from "util";
import * as SocketIO from "socket.io";
import { throttle } from "lodash";
import { createServer, Server } from "http";
import { IPiNailData } from "../models/IPiNailData";
import { PiNailMessages } from "./piNailMessages";
import { ISettings } from "../models/ISettings";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { ITunings } from "../models/ITunings";
import { PIDState } from "../models/PIDState";
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
        this._server = SocketIO(this._http);
        this._server.on("connection", this.onConnection);
    }

    private onConnection = (socket: SocketIO.Socket): void => {
        this._socket = socket;
        socket.on(PiNailMessages.GET_SETTINGS, this.getSettings);
        socket.on(PiNailMessages.UPDATE_OUTPUT, this.updateOutput);
        socket.on(PiNailMessages.UPDATE_SET_POINT, this.updateSetPoint);
        socket.on(PiNailMessages.UPDATE_SETTINGS, this.updateSettings);
        socket.on(PiNailMessages.UPDATE_TUNINGS, this.updateTunings);
    };

    emitData = (data: IPiNailData): void => {
        this._data = data;
        if (util.isNullOrUndefined(this._socket)) {
            return;
        }

        throttle(() => {
            this._socket.emit(PiNailMessages.ON_DATA, data);
        }, 1000);
    };

    emitSettings = (settings: ISettings): void => {
        this._settings = settings;
        if (util.isNullOrUndefined(this._socket)) {
            return;
        }

        throttle(() => {
            this._socket.emit(PiNailMessages.ON_SETTINGS, settings);
        });
    };

    getSettings = (): ISettings => {
        return this._settings;
    }

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
        this._state = value;
    }
}