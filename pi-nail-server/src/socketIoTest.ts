/*
 * File: c:\pi-nail\pi-nail-server\src\socketIoTest.ts
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
import * as SocketIOClient from "socket.io-client";
import { PiNailActionTypes } from "./ui/piNailActionTypes";
import { IPiNailData } from "./models/IPiNailData";
import { ISettings } from "./models/ISettings";
import { setTimeout } from "timers";
import { IPiNailAction } from "./models";

try {
const client: SocketIOClient.Socket = SocketIOClient("http://172.19.0.35:3000", { path: '/sio' });

client.on('action', (action: IPiNailAction) => {
    console.log("update data");
    console.log(`Temperature = ${action.data!.presentValue}, Output = ${action.data!.output}`); 
});

client.on("connect", () => {
    console.log("connected");

    setTimeout(() => {
        client.emit(PiNailActionTypes.SERVER_UPDATE_OUTPUT, 0.7);
    }, 5000);
});

client.on("error", (err: any) => {
    console.log(`Error: ${err}`);
});

client.on("connect_error", (err: any) => {
    console.log(`Connect Error: ${err}`);
});

client.connect();
} catch (exception) {
    console.log(exception);
}

setInterval(() => {
    console.log("tick");
}, 2000);