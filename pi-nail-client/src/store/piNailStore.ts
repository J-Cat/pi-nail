import { IPiNailState } from '../models';

export interface IPiNailStore {
    responsive: { isPortrait: boolean };
    piNail: IPiNailState;    
}