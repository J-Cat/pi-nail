import * as React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartPageProps } from './ChartPageContainer';

export default class ChartPage extends React.Component<ChartPageProps.IProps, ChartPageProps.IState> {   
    constructor(props: ChartPageProps.IProps) {
        super(props);
    }

    public render() {
        let i: number = 0;
        const data = {
            labels: this.props.setPoints.map(n => (i++).toString()),
            datasets: [{
                fill: false,
                pointRadius: 0,
                backgroundColor: 'lightgreen',
                borderColor: 'lightgreen',
                label: 'Set Point',
                data: this.props.setPoints
            }, {
                fill: false,
                pointRadius: 0,
                backgroundColor: 'darkred',
                borderColor: 'darkred',
                label: 'Temperature',
                data: this.props.temps
            },
            {
                fill: false,
                pointRadius: 0,
                backgroundColor: 'lightblue',
                borderColor: 'lightblue',
                yAxisID: 'output',
                label: 'Output',
                data: this.props.outputs
            }]
        };

        const options = {
            responsive: true,
            title: {
                display: true,
                text: 'Set Point vs. Temperature and Output'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false
                    }
                }],
                yAxes: [{
                    id: 'temp',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: '\xB0C'
                    }
                }, {
                    id: 'output',
                    display: true,
                    position: 'right',
                    scaleLabel: {
                        display: true,
                        labelString: '%'
                    }
                }]
            }
        };

        return (
            <div className="chartPageContainer">
                <Line data={data} options={options} />
            </div>
        );
    }
}
