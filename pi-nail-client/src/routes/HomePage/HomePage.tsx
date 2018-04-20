import autobind from 'autobind-decorator';
// import { TextField } from 'material-ui';
import Slider from 'rc-slider';
import * as React from 'react';
import { ChartData, Doughnut } from 'react-chartjs-2';
// import * as ReactFitText from 'react-fittext';
// import Gauge from '../../components/Gauge';
import StateButton from '../../components/StateButton';
import { PIDState } from '../../models/PIDState';
// import { IChartTooltip } from '../../models/IChartTooltip';
import { HomePageProps } from './HomePageContainer';

import 'rc-slider/assets/index.css';

export default class HomePage extends React.Component<HomePageProps.IProps, HomePageProps.IState> {
    constructor(props: HomePageProps.IProps) {
        super(props);

        this.state = {
            min: props.min,
            max: props.max,
            isChanging: false,
            sliderValue: props.sliderValue
        }
    }

    public componentWillReceiveProps(nextProps: HomePageProps.IProps)
    {
        if (nextProps.sliderValue !== this.props.sliderValue) {
            this.setState({
                sliderValue: nextProps.sliderValue
            });
        }
    }

    public render() {
        if (!this.props.isConnected) {
            return (<div>Connecting ...</div>);
        }

        const data: ChartData<any> = {
            labels: ['Output'],
            datasets: [
                {
                    data: [this.props.output, 100 - this.props.output],
                    backgroundColor: ['#abe2fb', '#e9e9e9']
                }
            ]
        };

        const options: any = {
            responsive: true,
            legend: {
                position: 'bottom'
            },
            elements: {
                arc: {
                    borderWidth: 1
                }
            },
            circumference: 1.5 * Math.PI,
            rotation: -1.25 * Math.PI,
            doughnut: {
            }
        };

        return (
            <div className="homePageBody">
                <div className="outputSlider">
                    <Slider 
                        vertical={!this.props.isPortrait} 
                        onBeforeChange={this.onSliderBeginChange} 
                        onAfterChange={this.onSliderAfterChange} 
                        min={this.props.min} 
                        max={this.props.max} 
                        value={this.state.sliderValue} 
                        onChange={this.onSliderChange} 
                        trackStyle={this.props.isPortrait ? { height: 10 } : { width: 10 }}
                        handleStyle={this.props.isPortrait ?
                            {
                                height: 30,
                                width: 30,
                                marginLeft: -15,
                                marginTop: -10
                            } : {
                                height: 30,
                                width: 30,
                                marginLeft: -10,
                                marginTop: -15                                
                            }
                        }
                        dotStyle={{
                            display: 'none'
                        }}
                        railStyle={this.props.isPortrait ? { height: 10 } : { width: 10 }}
                        marks={{
                            [0]: {
                                label: <strong>{this.props.min}{this.props.state !== PIDState.Manual ? '\xB0C' : '%'}</strong>
                            },
                            [this.props.max]: {
                                label: <strong>{this.props.max}{this.props.state !== PIDState.Manual ? '\xB0C' : '%'}</strong>,
                                style: {
                                    color: 'red'
                                }
                            }
                        }}
                    />
                </div>
                <div className="mainContainer">
                    <div className="tempsContainer">
                        <div className="tempContainer">
                            <div className="tempTextContainer">
                                <div className="tempValue tempText">{this.props.setPoint}</div>
                                <div className="tempSymbol tempText">&deg;C</div>
                            </div>
                        </div>
                        <div className="tempContainer">
                            <div className="tempTextContainer">
                                <div className="tempValue tempText">{this.props.presentValue}</div>
                                <div className="tempSymbol tempText">&deg;C</div>
                            </div>
                        </div>
                    </div>
                    <div className="stateContainer">
                        <div className="stateGaugeContainer">
                            <Doughnut data={data} options={options} />
                        </div>
                        <div className="stateButtonContainer">
                            <StateButton className="stateButton" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    @autobind
    protected onSliderChange(value: number): void {
        this.setState({
            sliderValue: value
        });
    }

    @autobind
    protected onSliderBeginChange(value: number): void {
        this.setState({
            isChanging: true
        });
    }

    @autobind
    protected onSliderAfterChange(value: number): void {
        this.setState({
            isChanging: false
        });

        switch (this.props.state) {
            case PIDState.Auto:
            case PIDState.Stopped:
                this.props.updateSetPoint(value);
                break;

            case PIDState.Manual:
                this.props.updateOutput(value);
                break;
        }
    }
}