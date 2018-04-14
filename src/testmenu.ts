import { Menu } from "./menu";

let menu: Menu = new Menu(8, 2, 1, 185, 100, 350, 0.25, 250);
menu.presentValue = 170;
menu.output = 70;
menu.render();

let i: number = 0;

setTimeout(updateTemp, 1000);

function updateTemp(): void {
    i += 1;
    menu.presentValue += 1;
    menu.render();
    if (i < 1000) {
        setTimeout(updateTemp, 1000);
    }
}
