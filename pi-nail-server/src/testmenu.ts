/*
 * File: c:\pi-nail\pi-nail-server\src\testmenu.ts
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
import { ConsoleUi } from "./ui/consoleUi";
import { PIDState } from "./models";

let menu: ConsoleUi = new ConsoleUi({
    tunings: {
        p: 8,
        i: 2,
        d: 1
    },
    setPoint: 185,
    maxPower: 100,
    maxTemp: 250,
    tcInterval: 0.25,
    cycleTime: 250,
    state: PIDState.Stopped
});
menu.data = {
    presentValue: 170,
    output: 70,
    error: 10,
    filteredSetPoint: 185
};
menu.start();

let i: number = 0;

setTimeout(updateTemp, 1000);

function updateTemp(): void {
    i += 1;
    menu.data = {
        presentValue: menu.data.presentValue + 1,
        output: 70,
        error: 10,
        filteredSetPoint: 185
    };

    if (i < 1000) {
        setTimeout(updateTemp, 1000);
    }
}
