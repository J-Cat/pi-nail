/*
 * File: c:\pi-nail\pi-nail-client\src\components\StateButton\StateButtonContainer.tsx
 * Project: c:\pi-nail\pi-nail-client
 * Created Date: Monday April 16th 2018
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