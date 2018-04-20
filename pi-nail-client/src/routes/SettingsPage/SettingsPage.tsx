import autobind from 'autobind-decorator';
import { Button, Divider, InputAdornment, TextField, Typography } from 'material-ui';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ChangeEvent } from 'react';
import * as util from 'util'
import { SettingsPageProps } from './SettingsPageContainer';

const MAX_TEMP: number = 500;
const MAX_POWER: number = 100;

// tslint:disable:no-string-literal
export default class SettingsPage extends React.Component<SettingsPageProps.IProps, SettingsPageProps.IState> {
    public static contextTypes: React.ValidationMap<any> = {
        router: PropTypes.object.isRequired
    };

    constructor(props: SettingsPageProps.IProps) {
        super(props);

        this.state = {
            settings: this.props.settings,
            errors: {
                'setPoint': { error: false },
                'maxTemp': { error: false },
                'maxPower': { error: false },
                'p': { error: false },
                'i': { error: false },
                'd': { error: false },
                'cycleTime': { error: false }
            }
        };
    }

    public componentWillReceiveProps(nextProps: SettingsPageProps.IProps) {
        if (this.props.settings !== nextProps.settings) {
            this.setState({
                settings: nextProps.settings
            });
        }
    }

    protected get hasError(): boolean {
        let error: boolean = false;
        Object.keys(this.state.errors).forEach(key => {
            if (this.state.errors[key]!.error) {
                error = true;
                return;
            }
        });
        return error;
    }

    public render() {
        return (
            <div className="settingsPageContainer">
                <form className="settingsPageForm">
                    <div className="categoryContainer">
                        <Typography variant="subheading">
                            Temperatures
                        </Typography>
                        <div>
                            <TextField
                                id="tfSetPoint" required={true} type="number"
                                error={this.state.errors['setPoint'].error}
                                helperText={this.state.errors['setPoint'].message || ''}
                                className="numberField"
                                label="Set Point" value={this.state.settings.setPoint}
                                onChange={this.handleChange}
                                margin='normal'
                                fullWidth={true}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">&deg;C</InputAdornment>
                                }}
                            />
                            <TextField
                                id="tfMaxTemp" type="number"
                                error={this.state.errors['maxTemp'].error}
                                helperText={this.state.errors['maxTemp'].message || ''}
                                className="numberField"
                                label="Max Temperature" value={this.state.settings.maxTemp}
                                onChange={this.handleChange}
                                margin='normal'
                                fullWidth={true}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">&deg;C</InputAdornment>
                                }}
                            />
                            <TextField
                                id="tfMaxPower" type="number"
                                error={this.state.errors['maxPower'].error}
                                helperText={this.state.errors['maxPower'].message || ''}
                                className="numberField"
                                label="Max Power" value={this.state.settings.maxPower}
                                onChange={this.handleChange}
                                margin='normal'
                                fullWidth={true}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">&deg;C</InputAdornment>
                                }}
                            />
                        </div>
                    </div>
                    <Divider />
                    <div className="categoryContainer">
                        <Typography variant="subheading">
                            Advanced
                        </Typography>
                        <div>
                            <TextField
                                id="tfP" type="number"
                                error={this.state.errors['p'].error}
                                helperText={this.state.errors['p'].message || ''}
                                className="numberField"
                                label="P" value={this.state.settings.tunings.p}
                                onChange={this.handleChange}
                                margin='normal'
                                fullWidth={true}
                            />
                            <TextField
                                id="tfI" type="number"
                                error={this.state.errors['i'].error}
                                helperText={this.state.errors['i'].message || ''}
                                className="numberField"
                                label="I" value={this.state.settings.tunings.i}
                                onChange={this.handleChange}
                                margin='normal'
                                fullWidth={true}
                            />
                            <TextField
                                id="tfD" type="number"
                                error={this.state.errors['d'].error}
                                helperText={this.state.errors['d'].message || ''}
                                className="numberField"
                                label="D" value={this.state.settings.tunings.d}
                                onChange={this.handleChange}
                                margin='normal'
                                fullWidth={true}
                            />
                            <TextField
                                id="tfCycleTime" type="number"
                                error={this.state.errors['cycleTime'].error}
                                helperText={this.state.errors['cycleTime'].message || ''}
                                className="numberField"
                                label="Cycle Time" value={this.state.settings.cycleTime}
                                onChange={this.handleChange}
                                margin='normal'
                                fullWidth={true}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">ms</InputAdornment>
                                }}
                            />
                        </div>
                    </div>
                    <Divider />
                    <Button variant="raised" component="submit" onClick={this.save} disabled={this.props.settings === this.state.settings || this.hasError}>Save</Button>
                </form>
            </div>
        );
    }

    @autobind
    protected save(event: any) {
        this.props.updateSettings(this.state.settings);
        this.context.router.history.push('/home');
    }

    @autobind
    protected handleChange(event: ChangeEvent<HTMLInputElement>) {
        switch (event.target.id) {
            case 'tfSetPoint':
                this.validateField('setPoint', 'Set Point', event.target.value, true, 0, this.state.settings.maxTemp);
                this.setState({
                    settings: Object.assign({}, this.state.settings, {
                        setPoint: parseInt(event.target.value, 10)
                    })
                });
                break;

            case 'tfMaxTemp':
                this.validateField('maxTemp', 'Maximum Temperature', event.target.value, true, 0, MAX_TEMP);
                this.setState({
                    settings: Object.assign({}, this.state.settings, {
                        maxTemp: parseInt(event.target.value, 10)
                    })
                });
                break;

            case 'tfMaxPower':
                this.validateField('maxPower', 'Maximum Power', event.target.value, true, 0, MAX_POWER);
                this.setState({
                    settings: Object.assign({}, this.state.settings, {
                        maxPower: parseInt(event.target.value, 10)
                    })
                });
                break;

            case 'tfCycleTime':
                this.validateField('cycleTime', 'Cycle Time', event.target.value, true, 250, 10000);
                this.setState({
                    settings: Object.assign({}, this.state.settings, {
                        cycleTime: parseInt(event.target.value, 10),
                        tcInterval: parseFloat(event.target.value) / 1000
                    })
                });
                break;

            case 'tfP':
                this.validateField('p', 'P value', event.target.value, true);
                this.setState({
                    settings: Object.assign({}, this.state.settings, {
                        tunings: Object.assign({}, this.state.settings.tunings, {
                            p: parseInt(event.target.value, 10)
                        })
                    })
                });
                break;

            case 'tfI':
                this.validateField('i', 'I value', event.target.value, true);
                this.setState({
                    settings: Object.assign({}, this.state.settings, {
                        tunings: Object.assign({}, this.state.settings.tunings, {
                            i: parseInt(event.target.value, 10)
                        })
                    })
                });
                break;

            case 'tfD':
                this.validateField('d', 'D value', event.target.value, true);
                this.setState({
                    settings: Object.assign({}, this.state.settings, {
                        tunings: Object.assign({}, this.state.settings.tunings, {
                            d: parseInt(event.target.value, 10)
                        })
                    })
                });
                break;
        }
    }

    private validateField(fieldName: string, fieldTitle: string, valueAsString: string, required: boolean, minValue?: number, maxValue?: number): boolean {
        if (required && valueAsString.trim() === '') {
            this.setError(fieldName, true, `${fieldTitle} is required.`);
            return false;
        }

        const value: number = parseInt(valueAsString, 10);
        if (util.isNullOrUndefined(value)) {
            this.setError(fieldName, true, `${fieldTitle} must be a number.`);
            return false;
        }

        if (!util.isNullOrUndefined(minValue)) {
            if (value < minValue) {
                this.setError(fieldName, true, `${fieldTitle} must be >= ${minValue}.`);
                return false;
            }
        }

        if (!util.isNullOrUndefined(maxValue)) {
            if (value > maxValue) {
                this.setError(fieldName, true, `${fieldTitle} must be <= ${maxValue}.`);
                return false;
            }
        }

        this.setError(fieldName, false);
        return true;
    }

    private setError(fieldName: string, error: boolean, message?: string) {
        if (!error) {
            this.setState({
                errors: Object.assign({}, this.state.errors, {
                    [fieldName]: {
                        error: false
                    }
                })
            });
        } else {
            this.setState({
                errors: Object.assign({}, this.state.errors, {
                    [fieldName]: {
                        error: true,
                        message: message!
                    }
                })
            });
        }
    }
}
// tslint:enable:no-string-literal
