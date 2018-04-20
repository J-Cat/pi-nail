/*
 * File: c:\pi-nail\pi-nail-client\src\components\Gauge\GaugeContainer.tsx
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
import { updateOutput, updateSetPoint } from '../../modules/piNail';
import { IPiNailStore } from '../../store/piNailStore';
import Gauge from './Gauge';

export namespace GaugeProps {
    export interface IStateProps {
        state: PIDState;
        presentValue: number;
        setPoint: number;
        maxTemp: number;
        output: number;
        maxPower: number;
    }

    export interface IDispatchProps {
        updateSetPoint: (value: number) => void;
        updateOutput: (value: number) => void;
    }

    export interface IOwnProps {
        thumbAngle?: number;
        lineWidth?: number;
        yScale?: number;
        fontSize?: number;
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState { 
        initialized: boolean,
        isUpdating: boolean;
        start?: {
            x: number;
            y: number;
        };
        radianAngle: number;
    }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    let props = {
        maxPower: 0,
        maxTemp: 0,
        output: 0,
        presentValue: 0,
        setPoint: 0,
        state: PIDState.Stopped
/*        ,
        radius: ownProps.radius,
        height: ownProps.height,
        width: ownProps.width,
        thumbAngle: ownProps.thumbAngle*/
    };
    if (!util.isNullOrUndefined(state.piNail.settings)) {
       props = Object.assign({}, props, {
           maxPower: state.piNail.settings.maxPower,
           maxTemp: state.piNail.settings.maxTemp,
           setPoint: state.piNail.settings.setPoint,
           state: state.piNail.settings.state           
       }) 
    }
    if (!util.isNullOrUndefined(state.piNail.data)) {
        props = Object.assign({}, props, {
            presentValue: state.piNail.data.presentValue,
            output: state.piNail.data.output
        })
    }
    return props;
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
        updateSetPoint: (value: number): void => { 
            dispatch(updateSetPoint(value));
        },
        updateOutput: (value: number): void => { 
            dispatch(updateOutput(value));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Gauge);