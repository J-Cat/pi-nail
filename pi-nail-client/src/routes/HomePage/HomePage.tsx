import autobind from 'autobind-decorator';
import { TextField } from 'material-ui';
import * as React from 'react';
import { Bar, ChartData } from 'react-chartjs-2';
// import * as ReactFitText from 'react-fittext';
// import Gauge from '../../components/Gauge';
import StateButton from '../../components/StateButton';
import { IChartTooltip } from '../../models/IChartTooltip';
import { HomePageProps } from './HomePageContainer';

export default class HomePage extends React.Component<HomePageProps.IProps, HomePageProps.IState> {   
    constructor(props: HomePageProps.IProps) {
        super(props);
    }

    public render() {
        if (!this.props.isConnected) {
            return (<div>Connecting ...</div>);
        }

        const data: ChartData<any> = {
            labels: ['Temperature', 'Output'],
            datasets: [
                {
                    data: [Math.round(this.props.presentValue / this.props.setPoint * 100), this.props.output]
                }
            ]
        };

        const options: any = {
            tooltips: {
                callbacks: {
                    label: (tooltipItem: IChartTooltip, itemData: ChartData<any>): string => {
                        switch (tooltipItem.index) {
                            case 0:
                                return `${this.props.presentValue}\xB0C`;

                            case 1:
                                return `${this.props.output}%`;
                        }
                        return '';
                    }
                }  
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [
                    {
                        display: false, 
                        ticks: {min: 0, max: 100}
                    }
                ]
            }
        };

        return (
            <div className="homePageContainer">
                <div className="temperatureContainer">
                    <div className="setPointContainer tempText">
                        <TextField type="number" 
                            className="setPointInput tempText"
                            defaultValue={this.props.setPoint}
                            onChange={this.onSetPointChange}
                        />
                        <div className="tempSymbol tempText">&deg;C</div>
                    </div>
                    <div className="presentValueContainer">
                        <div className="presentValue tempText">{this.props.presentValue}</div>
                        <div className="tempSymbol tempText">&deg;C</div>
                    </div>
                </div>
                <div className="stateContainer">
                    <div className="stateGaugeContainer">
                        <Bar data={data} options={options} />
                    </div>
                    <div className="stateButtonContainer">
                        <StateButton className="stateButton" />
                    </div>
                </div>
                {/* <div className="tempGaugeContainer">
                    <Gauge thumbAngle={0.01} lineWidth={80} yScale={1.5} />
                </div> */}
            </div>
        );
    }

    @autobind
    protected onSetPointChange(source: React.ChangeEvent<HTMLInputElement>): void {
        this.props.updateSetPoint(source.target.valueAsNumber);
    }
}