import { connect } from 'react-redux';
import * as util from 'util';
import { PIDState } from '../../models';
import { /* getSettings, */ updateState } from '../../modules/piNail';
import { IPiNailStore } from '../../store/piNailStore';
import StateButton from './StateButton';

export namespace StateButtonProps {
    export interface IStateProps {
        state: PIDState
    }

    export interface IDispatchProps {
        updateState: (state: PIDState) => void;
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState { }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    return {
        state: util.isNullOrUndefined(state.piNail.settings) 
            ? PIDState.Stopped 
            : state.piNail.settings.state
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
        updateState: (state: PIDState): void => { 
            dispatch(updateState(state));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StateButton);