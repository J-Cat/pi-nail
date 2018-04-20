import { connect } from 'react-redux';
import * as util from 'util';
import { PIDState } from '../../models/PIDState';
import { updateOutput, updateSetPoint } from '../../modules/piNail';
import { IPiNailStore } from '../../store/piNailStore';
import HomePage from './HomePage';

export namespace HomePageProps {
    export interface IStateProps {
        isConnected: boolean;
        isPortrait: boolean;
        setPoint: number;
        presentValue: number;
        output: number;
        state: PIDState;
        min: number;
        max: number;
        sliderValue: number;
    }

    export interface IDispatchProps {
        updateOutput: (value: number) => void;
        updateSetPoint: (value: number) => void;
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState {
        min: number;
        max: number;
        isChanging: boolean;
        sliderValue: number;
    }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    const isConnected: boolean = util.isNullOrUndefined(state.piNail.data) 
        || util.isNullOrUndefined(state.piNail.settings)
        ? false 
        : true;
    return {
        isConnected,
        isPortrait: state.responsive.isPortrait,
        setPoint: !state.piNail.settings ? 0 : state.piNail.settings.setPoint,
        presentValue: !state.piNail.data ? 0 : state.piNail.data.presentValue,
        output: !state.piNail.data ? 0 : state.piNail.data.output,
        state: !state.piNail.settings ? 0 : state.piNail.settings.state,
        min: 0,
        max: !state.piNail.settings ? 100 : (
            state.piNail.settings.state === PIDState.Manual
                ? state.piNail.settings.maxPower
                : state.piNail.settings.maxTemp
        ),
        sliderValue: !state.piNail.settings ? 0 : (
            state.piNail.settings.state === PIDState.Manual
                ? (!state.piNail.data ? 0 : state.piNail.data.output)
                : state.piNail.settings.setPoint
        )
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
        updateOutput: (value: number): void => {
            dispatch(updateOutput(value));
        },
        updateSetPoint: (value: number): void => {
            dispatch(updateSetPoint(value));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomePage);