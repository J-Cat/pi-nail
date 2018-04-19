import autobind from 'autobind-decorator';
import { FormControl, FormControlLabel, Radio, RadioGroup, SvgIcon } from 'material-ui';
import * as React from 'react';
import keydown, { Keys } from 'react-keydown';
import { PIDState } from '../../models';
import { StateButtonProps } from './StateButtonContainer';

export default class StateButton extends React.Component<StateButtonProps.IProps, StateButtonProps.IState> {
    constructor(props: StateButtonProps.IProps) {
        super(props);
    }

    public render() {
        return (
            <FormControl component="fieldset" className="stateForm">
                <RadioGroup value={this.props.state} onChange={this.stateChanged}>
                    <FormControlLabel value={PIDState.Auto.toString()} control={(
                            <Radio
                                icon={(<SvgIcon><svg>
                                        <rect width="100%" height="100%" fill="rgb(255,255,255)" strokeWidth="1" stroke="rgb(0,0,0)" />
                                        <line x="0" y="0" height="2" width="100%" stroke="rgb(0,0,0)" />
                                        <line x="0" y="100%" height="1" width="100%" stroke="rgb(0,0,0)" />
                                        <line x="100%" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                        <line x="0" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    </svg></SvgIcon>)} 
                                checkedIcon={(<SvgIcon><svg>
                                    <rect width="100%" height="100%" fill="rgb(255,119,0)" strokeWidth="1" stroke="rgb(0,0,0)" />
                                    <line x="0" y="0" height="2" width="100%" stroke="rgb(0,0,0)" />
                                    <line x="0" y="100%" height="1" width="100%" stroke="rgb(0,0,0)" />
                                    <line x="100%" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    <line x="0" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                </svg></SvgIcon>)} 
                            className="stateButton" />
                        )}
                        className="stateControl"
                        label="Auto"
                    />
                    <FormControlLabel value={PIDState.Manual.toString()} control={(
                            <Radio
                            icon={(<SvgIcon><svg>
                                        <rect width="100%" height="100%" fill="rgb(255,255,255)" strokeWidth="1" stroke="rgb(0,0,0)" />
                                        <line x="0" y="0" height="1" width="100%" stroke="rgb(0,0,0)" />
                                        <line x="0" y="100%" height="1" width="100%" stroke="rgb(0,0,0)" />
                                        <line x="100%" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                        <line x="0" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    </svg></SvgIcon>)} 
                                checkedIcon={(<SvgIcon><svg>
                                    <rect width="100%" height="100%" fill="rgb(255,183,0)" strokeWidth="1" stroke="rgb(0,0,0)" />
                                    <line x="0" y="0" height="1" width="100%" stroke="rgb(0,0,0)" />
                                    <line x="0" y="100%" height="1" width="100%" stroke="rgb(0,0,0)" />
                                    <line x="100%" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    <line x="0" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    </svg></SvgIcon>)} 
                                className="stateButton" />
                        )}
                        label="Manual"
                    />
                    <FormControlLabel value={PIDState.Stopped.toString()} control={(
                            <Radio
                            icon={(<SvgIcon><svg>
                                        <rect width="100%" height="100%" fill="rgb(255,255,255)" strokeWidth="1" stroke="rgb(0,0,0)" />
                                        <line x="0" y="0" height="1" width="100%" stroke="rgb(0,0,0)" />
                                        <line x="0" y="100%" height="2" width="100%" stroke="rgb(0,0,0)" />
                                        <line x="100%" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                        <line x="0" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    </svg></SvgIcon>)} 
                                checkedIcon={(<SvgIcon><svg>
                                    <rect width="100%" height="100%" fill="rgb(0,100,0)" strokeWidth="1" stroke="rgb(0,0,0)" />
                                    <line x="0" y="0" height="1" width="100%" stroke="rgb(0,0,0)" />
                                    <line x="0" y="100%" height="2" width="100%" stroke="rgb(0,0,0)" />
                                    <line x="100%" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    <line x="0" y="0" height="100%" width="2" stroke="rgb(0,0,0)" />
                                    </svg></SvgIcon>)} 
                                className="stateButton" />
                        )}
                        label="Stopped"
                    />
                </RadioGroup>
            </FormControl>
        );
    }

    @autobind
    protected stateChanged(source: React.ChangeEvent<JSX.Element>, value: string): void {
        this.props.updateState(value as PIDState);
    }

    @keydown(Keys.a)
    protected setStateAuto(): void {
        this.props.updateState(PIDState.Auto);
    }

    @keydown(Keys.m)
    protected setStateManual(): void {
        this.props.updateState(PIDState.Manual);
    }

    @keydown(Keys.s)
    protected setStateStopped(): void {
        this.props.updateState(PIDState.Stopped);
    }
}