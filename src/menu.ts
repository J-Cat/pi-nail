import * as util from "util";
import * as  Blessed from "blessed";
import * as BlessedContrib from "blessed-contrib";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { PIDState } from "./models/PIDState";
import { ITunings } from "./models/ITunings";
import { ISettings } from "./models/ISettings";

export class Menu {
    private screen: Blessed.Widgets.Screen;
    private grid: BlessedContrib.grid;
    private box: Blessed.Widgets.BoxElement;
    private donut: BlessedContrib.Widgets.DonutElement;
    private line: BlessedContrib.Widgets.LineElement;
    private series1!: BlessedContrib.Widgets.LineData;
    private series2!: BlessedContrib.Widgets.LineData;
    private configForm!: Blessed.Widgets.FormElement<FormData>;

    private pastValues: number[] = [];
    private pastSetPoints: number[] = [];

    private _state: PIDState = PIDState.Stopped;
    private _settings: ISettings;
    private _presentValue: number = 0;
    private _output: number = 0;
    private _inConfig: boolean = false;
    private xOffset: number = 0;

    private _onChangeState: SimpleEventDispatcher<PIDState> = new SimpleEventDispatcher<PIDState>();
    get onChangeState(): ISimpleEvent<PIDState> {
        return this._onChangeState.asEvent();
    }

    get tunings(): ITunings {
        return this._settings.tunings;
    }

    set tunings(value: ITunings) {
        this._settings.tunings = value;
    }

    private _onChangeSetPoint: SimpleEventDispatcher<number> = new SimpleEventDispatcher<number>();
    get onChangeSetPoint(): ISimpleEvent<number> {
        return this._onChangeSetPoint.asEvent();
    }

    private _onChangeOutput: SimpleEventDispatcher<number> = new SimpleEventDispatcher<number>();
    get onChangeOutput(): ISimpleEvent<number> {
        return this._onChangeOutput.asEvent();
    }

    private _onChangeTunings: SimpleEventDispatcher<ITunings> = new SimpleEventDispatcher<ITunings>();
    get onChangeTunings(): ISimpleEvent<ITunings> {
        return this._onChangeTunings.asEvent();
    }

    private _onChangeSettings: SimpleEventDispatcher<ISettings> = new SimpleEventDispatcher<ISettings>();
    get onChangeSettings(): ISimpleEvent<ISettings> {
        return this._onChangeSettings.asEvent();
    }

    set presentValue(value: number) {
        if (this._presentValue === value) {
            return;
        }
        this._presentValue = value;

        if (this.pastValues.length >= 100) {
            this.xOffset = this.xOffset >= 899 ? 0 : this.xOffset + 1;
            if (this.xOffset === 900) {
                this. xOffset = 0;
            }
            this.pastValues.shift();
            this.pastSetPoints.shift();
        }
        this.pastValues.push(this._presentValue);
        this.pastSetPoints.push(this._settings.setPoint as number);
    }

    get presentValue(): number {
        return this._presentValue;
    }

    set output(value: number) {
        if (this._output === value) {
            return;
        }

        this._output = value;
        if (!this._inConfig) {
            this.render();
        }
    }

    get output(): number {
        return this._output;
    }


    constructor(kP: number, kI: number, kD: number,
        setPoint: number, maxPower: number, maxTemp: number,
        tcInterval: number, cycleTime: number) {
        this._settings = {
            tunings: {
                p: kP,
                i: kI,
                d: kD
            },
            setPoint: setPoint,
            maxPower: maxPower,
            maxTemp: maxTemp,
            tcInterval: tcInterval,
            cycleTime: cycleTime
        };

        this.screen = Blessed.screen({
            smartCSR: true,
            forceUnicode: true,
            fullUnicode: true,
            debug: true,
            useBCE: true,
            grabKeys: false,
            warnings: true
        });
        this.screen.enableInput();

        this.grid = new BlessedContrib.grid({
            rows: 12, cols: 12, screen: this.screen
        });

        this.box = this.grid.set(0, 0, 6, 6, Blessed.box, {label: "piNail"});

        this.donut = this.grid.set(0, 6, 6, 6, BlessedContrib.donut, {
            radius: 6,
            arcWidth: 1,
            remainColor: "black",
            yPadding: 0
        });

        this.line = this.grid.set(6, 0, 6, 12, BlessedContrib.line, {
            xLabelPadding: 0,
            xPadding: 0,
            wholeNumbersOnly: false,
            label: "Set Point vs Present Value"
        });

        this.screen.key(["a", "m", "s"], (ch, key) => {
            switch (key.name) {
                case "a":
                    this._state = PIDState.Auto;
                    break;

                case "m":
                    this._state = PIDState.Manual;
                    break;

                case "s":
                    this._state = PIDState.Stopped;
                    break;
            }
            this._onChangeState.dispatch(this._state);
            this.render();
        });

        this.screen.key(["v"], (ch, key) => {
            const prompt: Blessed.Widgets.PromptElement = Blessed.prompt();
            this.box.append(prompt);
            prompt.focus();
            prompt.readInput("Please enter set point value", setPoint.toString(10), (err: Error, value: string) => {
                if (!util.isNullOrUndefined(value)) {
                    const v: number = parseFloat(value);
                    if (util.isNumber(v)) {
                        this._settings.setPoint = v;
                        this._onChangeSetPoint.dispatch(v);
                    }
                }
                this.screen.remove(prompt);
                this.render();
            });
        });

        this.screen.key(["c"], (ch, key) => {
            this._inConfig = true;

            // this.donut.hide();
            this.line.hide();
            this.configForm = Blessed.form({
                parent: this.box,
                keys: true,
                vi: true
            });

            Blessed.text({
                parent: this.configForm,
                top: 1,
                content: "P:"
            });
            const textP: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "p",
                top: 1,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
           });
            textP.setValue(this._settings.tunings.p.toString(10));

            Blessed.text({
                parent: this.configForm,
                top: 2,
                content: "I:"
            });
            const textI: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "i",
                top: 2,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
            });
            textI.setValue(this._settings.tunings.i.toString(10));

            Blessed.text({
                parent: this.configForm,
                top: 3,
                content: "D:"
            });
            const textD: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "d",
                top: 3,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
            });
            textD.setValue(this._settings.tunings.d.toString(10));

            Blessed.text({
                parent: this.configForm,
                top: 4,
                content: "Set Point:"
            });
            const textSetPoint: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "setPoint",
                top: 4,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
            });
            textSetPoint.setValue(this._settings.setPoint.toString(10));

            Blessed.text({
                parent: this.configForm,
                top: 5,
                content: "Max Power:"
            });
            const textMaxPower: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "maxPower",
                top: 5,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
            });
            textMaxPower.setValue(this._settings.maxPower.toString(10));

            Blessed.text({
                parent: this.configForm,
                top: 6,
                content: "Max Temp:"
            });
            const textMaxTemp: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "maxTemp",
                top: 6,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
            });
            textMaxTemp.setValue(this._settings.maxTemp.toString(10));

            Blessed.text({
                parent: this.configForm,
                top: 7,
                content: "Thermocouple Interval (s):"
            });
            const textTcInterval: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "tcInterval",
                top: 7,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
            });
            textTcInterval.setValue(this._settings.tcInterval.toString(10));

            Blessed.text({
                parent: this.configForm,
                top: 8,
                content: "Cycle Time:"
            });
            const textCycleTime: Blessed.Widgets.TextboxElement = Blessed.textbox({
                parent: this.configForm,
                name: "cycleTime",
                top: 8,
                left: 30,
                height: 1,
                inputOnFocus: true,
                input: true,
                focusable: true
            });
            textCycleTime.setValue(this._settings.cycleTime.toString(10));

            const buttonSubmit: Blessed.Widgets.ButtonElement = Blessed.button({
                parent: this.configForm,
                left: 3,
                top: 9,
                width:8,
                height: 1,
                content: "Submit",
                style: {
                    bg: "blue",
                    focus: { bg: "red" },
                    hover: { bg: "red" }
                }
            });
            const buttonCancel: Blessed.Widgets.ButtonElement = Blessed.button({
                parent: this.configForm,
                left: 15,
                top: 9,
                width: 8,
                height: 1,
                content: "Cancel",
                style: {
                    bg: "blue",
                    focus: { bg: "red" },
                    hover: { bg: "red" }
                }
            });

            buttonSubmit.on("press", () => {
                this.configForm.submit();
            });
            buttonCancel.on("press", () => {
                this.configForm.cancel();
            });

            this.configForm.on("submit", (out: any) => {
                try {
                    const newSettings: ISettings = {
                        tunings: {
                            p: parseFloat(out.p),
                            i: parseFloat(out.i),
                            d: parseFloat(out.d)
                        },
                        setPoint: parseFloat(out.setPoint),
                        maxPower:  parseFloat(out.maxPower),
                        maxTemp: parseFloat(out.maxTemp),
                        tcInterval:  parseFloat(out.tcInterval),
                        cycleTime:  parseFloat(out.cycleTime)
                    };
                    this._settings = newSettings;
                    this._onChangeSettings.dispatch(this._settings);
                    this._inConfig = false;
                    this.box.remove(this.configForm);
                    // this.donut.show();
                    this.line.show();
                    this.render();
                } catch (e) {
                    // do nothing
                }
            });

            this.configForm.on("cancel", () => {
                this._inConfig = true;
                this.box.remove(this.configForm);
                // this.donut.show();
                this.line.show();
                this.render();
            });

            textP.focus();
            this.screen.render();
        });

        this.screen.key(["q", "C-c"], (ch, key) => {
            this.screen.destroy();
            process.exit(0);
        });

        // this.screen.on("keypress", (ch: string, key: Blessed.Widgets.Events.IKeyEventArg) => {
        //     if (this._inConfig) {
        //         let parent: Blessed.Widgets.Node = this.screen.focused;
        //         while (!util.isNullOrUndefined(parent) && parent.type !== "form") {
        //             parent = parent.parent;
        //         }
        //         if (util.isNullOrUndefined(parent) || parent.type !== "form") {
        //             this.configForm.focus();
        //         }

        //         if (key.name === "escape") {
        //             this.configForm.cancel();
        //         }
        //     }
        // });

        this.screen.key(["escape"], (ch, key) => {
            if (this._inConfig && !util.isNullOrUndefined(this.configForm)) {
                this.configForm.cancel();
            }
        });

        this.screen.key(["up"], (ch, key) => {
            if (this._inConfig) {
                return;
            }
            if (this._state === PIDState.Auto) {
                this._settings.setPoint = Math.min(this._settings.setPoint + 1, this._settings.maxTemp);
                this._onChangeSetPoint.dispatch(this._settings.setPoint);
            } else if (this._state === PIDState.Manual) {
                this._output = Math.min(this._output + 5, this._settings.maxPower);
                this._onChangeOutput.dispatch(this._output);
            }
            this.render();
        });

        this.screen.key(["down"], (ch, key) => {
            if (this._inConfig) {
                return;
            }
            if (this._state === PIDState.Auto) {
                this._settings.setPoint = Math.max(this._settings.setPoint - 1, 0);
                this._onChangeSetPoint.dispatch(this._settings.setPoint);
            } else if (this._state === PIDState.Manual) {
                this._output = Math.max(this._output - 5, 0);
                this._onChangeOutput.dispatch(this._output);
            }
            this.render();
        });

        this.screen.key(["pageup"], (ch, key) => {
            if (this._inConfig) {
                return;
            }
            if (this._state === PIDState.Auto) {
                this._settings.setPoint = Math.min(this._settings.setPoint + 5, this._settings.maxTemp);
                this._onChangeSetPoint.dispatch(this._settings.setPoint);
            } else if (this._state === PIDState.Manual) {
                this._output = Math.min(this._output + 10, this._settings.maxPower);
                this._onChangeOutput.dispatch(this._output);
            }
            this.render();
        });

        this.screen.key(["pagedown"], (ch, key) => {
            if (this._inConfig) {
                return;
            }
            if (this._state === PIDState.Auto) {
                this._settings.setPoint = Math.max(this._settings.setPoint - 5, 0);
                this._onChangeSetPoint.dispatch(this._settings.setPoint);
            } else if (this._state === PIDState.Manual) {
                this._output = Math.max(this._output - 10, 0);
                this._onChangeOutput.dispatch(this._output);
            }
            this.render();
        });
    }

    render: () => void = () => {
        this.box.setContent(
            "\n"
            + "<a> - Auto, <m> - Manual, <s> - Stop\n"
            + "<v> - Adjust Set Point\n"
            + "<c> - Configure Settings\n"
            + "<q> - Quit\n\n"
            + "<up/down> - Temperature +/- 1\n"
            + "<page up/down> - Temperature +/- 5\n\n"
            + `State: ${this._state}, `
            + `P = ${this._settings.tunings.p}, `
            + `I = ${this._settings.tunings.i}, `
            + `D = ${this._settings.tunings.d}`
        );

        let tempRatio: number = this._presentValue / this._settings.setPoint;
        let tempColour: string = "green";
        if (tempRatio > 1 && tempRatio < 1.05) {
            tempRatio = 1;
            tempColour = "yellow";
        } else if (tempRatio < 1 && tempRatio > .95) {
            tempColour = "yellow";
        } else if (tempRatio > 1) {
            tempRatio = 1;
            tempColour = "red";
        }
        const outputRatio: number = this._output / this._settings.maxPower;

        this.donut.setData([{
            percent: (Math.round(tempRatio * 100) === 1 ? 0.1 : Math.round(tempRatio * 100)).toString(10),
            label: `Temp (${Math.round(this._presentValue)}C / ${this._settings.setPoint}C)`,
            color: tempColour
        },
        {
            percent: (Math.round(outputRatio * 100) === 1 ? 0.1 : Math.round(outputRatio * 100)).toString(10),
            label: `Power`
        }]);

        if (this.pastSetPoints.length > 0 && this.pastValues.length > 0) {
            this.series1 = {
                title: "Present Value",
                style: {
                    line: "yellow"
                },
                x: this.pastValues.map((value: number, index: number) => `T${index+this.xOffset+1}`),
                y: this.pastValues
            };
            this.series2 = {
                title: "Set Point",
                style: {
                    line: "blue"
                },
                x: this.pastSetPoints.map((value: number, index: number) => `T${index+this.xOffset+1}`),
                y: this.pastSetPoints
            };
            this.line.setData([this.series1, this.series2]);
        }
        this.screen.render();
    }

    debug: (message: string) => void = (message) => {
        this.screen.debug(message);
    }
}
