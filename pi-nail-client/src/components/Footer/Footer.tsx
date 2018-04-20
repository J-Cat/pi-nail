/*
 * File: c:\pi-nail\pi-nail-client\src\components\Footer\Footer.tsx
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
import { CheckCircle, Error, InsertChart, Settings /*, Wifi*/ } from '@material-ui/icons';
import { Paper, Snackbar } from 'material-ui';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import HomeIcon from '../../assets/thermometerIcon';
import applicationInfo from '../../helpers/applicationInfo';
// import { IMessage } from '../../models/IMessage';
import { FooterProps } from './FooterContainer';

import { IClientConfig } from '../../config/IClientConfig';
const config: IClientConfig = require('../../config/config.json');

export default class Footer extends React.Component<FooterProps.IProps, FooterProps.IState> {
    public static contextTypes: React.ValidationMap<any> = {
        router: PropTypes.object.isRequired
    };

    public render() {
        const { messages, acknowledgeMessage } = this.props;
        const isError: boolean = messages.length > 0 && messages[0].error;
        return (
            <Paper className="footer row">
                <div className="version">{applicationInfo.version}</div>
                <BottomNavigation className="navBar" style={{ height: '100%', backgroundColor: '#EEEEED'}}>
                    <BottomNavigationAction
                        label="Home"
                        icon={<HomeIcon />}
                        // tslint:disable
                        onClick={() => this.context.router.history.push(`${config.baseRoutePath}/home`)}
                        className="navItem"
                    />
                    <BottomNavigationAction
                        label="Settings"
                        icon={<Settings />}
                        // tslint:disable
                        onClick={() => this.context.router.history.push(`${config.baseRoutePath}/settings`)}
                        className="navItem"
                    />
                    <BottomNavigationAction
                        label="Chart"
                        icon={<InsertChart />}
                        // tslint:disable
                        onClick={() => this.context.router.history.push(`${config.baseRoutePath}/chart`)}
                        className="navItem"
                    />
                    {/* <BottomNavigationAction
                        label="Network"
                        icon={<Wifi />}
                        // tslint:disable
                        onClick={() => this.context.router.history.push(`${config.baseRoutePath}/network`)}
                        className="navItem"
                    /> */}
                </BottomNavigation>

                <Snackbar
                    open={messages.length > 0}
                    message={
                        messages.length > 0
                            ? <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                {isError
                                    ? <Error className="material-icons" style={{ color: '#D8000C', flex: 0, paddingRight: '5px' }} />
                                    : <CheckCircle className="material-icons" style={{ color: '#4F8A10', flex: 0, paddingRight: '5px' }} />
                                }
                                <div style={{ flex: 1 }}>{messages[0].message}</div>
                            </div>
                            : <div />
                    }
                    autoHideDuration={3000}
                    onClose={acknowledgeMessage}
                />
            </Paper>
        );
    }
}