import { connect } from 'react-redux';
import * as util from 'util';
import { /* IPiNailData, PIDState, */ ISettings, ITunings } from '../../models/shared';
import { /* getSettings, */ updateOutput, updateSetPoint, updateSettings, updateTunings } from '../../modules/piNail';
import { IPiNailStore } from '../../store/piNailStore';
import HomePage from './HomePage';

export namespace HomePageProps {
    export interface IStateProps {
        isConnected: boolean;
        setPoint: number;
        presentValue: number;
        output: number;
    }

    export interface IDispatchProps {
        acknowledgeMessage: () => void;
        updateOutput: (value: number) => void;
        updateSettings: (settings: ISettings) => void;
        updateSetPoint: (value: number) => void;
        updateTunings: (tunings: ITunings) => void;
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState {
    }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    const isConnected: boolean = util.isNullOrUndefined(state.piNail.data) 
        || util.isNullOrUndefined(state.piNail.settings)
        ? false 
        : true;
    return {
        isConnected,
        setPoint: !state.piNail.settings ? 0 : state.piNail.settings.setPoint,
        presentValue: !state.piNail.data ? 0 : state.piNail.data.presentValue,
        output: !state.piNail.data ? 0 : state.piNail.data.output
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
        acknowledgeMessage: (): void => {
            // dispatch(acknowledgeWorkshopMessage());
            // dispatch(acknowledgeKnowYourPeersMessage());
            // dispatch(acknowledgePicturesMessage());
        },
        updateOutput: (value: number): void => {
            dispatch(updateOutput(value));
        },
        updateSetPoint: (value: number): void => {
            dispatch(updateSetPoint(value));
        },
        updateSettings: (settings: ISettings): void => {
            dispatch(updateSettings(settings));
        },
        updateTunings: (tunings: ITunings): void => {
            dispatch(updateTunings(tunings));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomePage);