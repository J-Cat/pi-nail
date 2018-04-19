import { AnyAction } from 'redux';
import { IPiNailData } from './IPiNailData';
import { ISettings } from './ISettings';
import { ITunings } from './ITunings';
import { PIDState } from './PIDState';

export interface IPiNailAction extends AnyAction {
    data?: IPiNailData;
    settings?: ISettings;
    tunings?: ITunings;
    value?: number;
    state?: PIDState;
}
