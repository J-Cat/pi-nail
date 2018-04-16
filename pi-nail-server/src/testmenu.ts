import { Menu } from "./ui/menu";

let menu: Menu = new Menu({
    tunings: {
        p: 8,
        i: 2,
        d: 1
    },
    setPoint: 185,
    maxPower: 100,
    maxTemp: 250,
    tcInterval: 0.25,
    cycleTime: 250
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
