/*
 * File: c:\pi-nail\pi-nail-client\src\routes\SettingsPage\SettingsPage.tsx
 * Project: c:\pi-nail\pi-nail-client
 * Created Date: Sunday April 15th 2018
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
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { NetworkPageProps } from './NetworkPageContainer';

export default class NetworkPage extends React.Component<NetworkPageProps.IProps, NetworkPageProps.IState> {
    public static contextTypes: React.ValidationMap<any> = {
        router: PropTypes.object.isRequired
    };

    constructor(props: NetworkPageProps.IProps) {
        super(props);

        this.state = {
            bleEnabled: false,
            devices: {}
        }

    }

    public componentWillMount() {
        ble.isEnabled(() => {
            this.setState({
                bleEnabled: true
            });

            ble.startScan([], (data: BLECentralPlugin.PeripheralData) => {
                this.setState({
                    devices: Object.assign({}, this.state.devices, {
                        [data.id]: data
                    })
                });
            });
        }, () => {
            this.setState({
                bleEnabled: false
            });
        });      
    }

    public render() {
        const deviceIds: string[] = Object.keys(this.state.devices);
        return (
            deviceIds.length === 0
            ? <div />
            : <div>
                {
                    deviceIds.forEach((key: string) => {
                        return (
                                <div>{this.state.devices[key].name}</div>
                        );
                    })
                }
                &nbsp;
            </div>
        );
    }
}
