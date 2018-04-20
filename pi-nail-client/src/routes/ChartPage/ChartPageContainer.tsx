/*
 * File: c:\pi-nail\pi-nail-client\src\routes\ChartPage\ChartPageContainer.tsx
 * Project: c:\pi-nail\pi-nail-client
 * Created Date: Thursday April 19th 2018
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
import { IPiNailStore } from '../../store/piNailStore';
import ChartPage from './ChartPage';

export namespace ChartPageProps {
    export interface IStateProps {
        setPoints: number[],
        temps: number[],
        outputs: number[]
    }

    export interface IDispatchProps {
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState {
    }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    return {
        setPoints: state.piNail.setpointData,
        temps: state.piNail.tempData,
        outputs: state.piNail.heatData
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChartPage);