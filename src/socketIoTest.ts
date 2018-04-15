import * as SocketIOClient from "socket.io-client";
import { PiNailMessages } from "./ui/piNailMessages";
import { IPiNailData } from "./models/IPiNailData";
import { ISettings } from "./models/ISettings";
import { setTimeout } from "timers";

const client: SocketIOClient.Socket = SocketIOClient("http://172.19.0.35:3000");

client.on(PiNailMessages.ON_SETTINGS, (data: IPiNailData) => {
    console.log("update data");
    console.log(`Temperature = ${data.presentValue}, Output = ${data.output}`); 
});

client.on(PiNailMessages.UPDATE_SETTINGS, (settings: ISettings) => {
    console.log("update settings");
    console.log(`Set Point = ${settings.setPoint}`);
});

client.on("connect", () => {
    console.log("connected");

    setTimeout(() => {
        client.emit(PiNailMessages.UPDATE_OUTPUT, 0.7);
    }, 5000);
});

client.on("error", (err: any) => {
    console.log(`Error: ${err}`);
});

client.on("connect_error", (err: any) => {
    console.log(`Connect Error: ${err}`);
});

client.connect();