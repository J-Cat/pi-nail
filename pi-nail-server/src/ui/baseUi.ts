import * as util from "util";
import { ISimpleEvent, SimpleEventDispatcher } from "strongly-typed-events";
import { PIDState } from "../models/PIDState";
import { ITunings } from "../models/ITunings";
import { ISettings } from "../models/ISettings";
import { IPiNailData } from "../models/IPiNailData";
import { Guid } from "../helpers/guid";

export abstract class BaseUi {
    protected pastValues: number[] = [];
    protected pastSetPoints: number[] = [];
    protected xOffset: number = 0;

    protected _settings: ISettings;
    protected _data: IPiNailData = {
        presentValue: 0,
        output: 0,
        filteredSetPoint: 0,
        error: 0
    };

    abstract onDataUpdated: () => void;
    abstract onSettingsUpdated: () => void;
    abstract start: () => void;

    private _id: string = Guid.newGuid();
    get id(): string {
        return this._id;
    }

    protected _onChangeState: SimpleEventDispatcher<PIDState> = new SimpleEventDispatcher<PIDState>();
    get onChangeState(): ISimpleEvent<PIDState> {
        return this._onChangeState.asEvent();
    }

    protected _onChangeSetPoint: SimpleEventDispatcher<number> = new SimpleEventDispatcher<number>();
    get onChangeSetPoint(): ISimpleEvent<number> {
        return this._onChangeSetPoint.asEvent();
    }

    protected _onChangeOutput: SimpleEventDispatcher<number> = new SimpleEventDispatcher<number>();
    get onChangeOutput(): ISimpleEvent<number> {
        return this._onChangeOutput.asEvent();
    }

    protected _onChangeTunings: SimpleEventDispatcher<ITunings> = new SimpleEventDispatcher<ITunings>();
    get onChangeTunings(): ISimpleEvent<ITunings> {
        return this._onChangeTunings.asEvent();
    }

    protected _onChangeSettings: SimpleEventDispatcher<ISettings> = new SimpleEventDispatcher<ISettings>();
    get onChangeSettings(): ISimpleEvent<ISettings> {
        return this._onChangeSettings.asEvent();
    }

    set data(value: IPiNailData) {
        if (this._data === value) {
            return;
        }
        this._data = value;

        if (isNaN(this._data.presentValue) || isNaN(this._settings.setPoint)) {
            return;
        }

        if (this.pastValues.length >= 100) {
            this.xOffset = this.xOffset >= 899 ? 0 : this.xOffset + 1;
            if (this.xOffset === 900) {
                this. xOffset = 0;
            }
            this.pastValues.shift();
            this.pastSetPoints.shift();
        }
        this.pastValues.push(this._data.presentValue);
        this.pastSetPoints.push(this._settings.setPoint);
        this.onDataUpdated();
    }

    set settings(value: ISettings) {
        this._settings = value;
        this.onSettingsUpdated();
    }

    constructor(settings: ISettings) {
        this._settings = settings;
    }
}