/*
 * File: c:\pi-nail\pi-nail-client\src\routes\index.tsx
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
import { Route, Switch } from 'react-router-dom';

import ChartPage from './ChartPage';
import HomePage from './HomePage';
import SettingsPage from './SettingsPage';

import { IClientConfig } from '../config/IClientConfig';

const config: IClientConfig = require('../config/config.json');

export default class Routes extends React.Component<{}, {}> {
    protected static contextTypes = {
        store: PropTypes.object.isRequired
    };

    public render() {
        return (
            <Switch>
                <Route
                    path={`${config.baseRoutePath}/home`}
                    component={HomePage}
                />
                <Route
                    path={`${config.baseRoutePath}/settings`}
                    component={SettingsPage}
                />
                <Route
                    path={`${config.baseRoutePath}/chart`}
                    component={ChartPage}
                />
                <Route
                    path={`${config.baseRoutePath}/`}
                    component={HomePage}
                />
            </Switch>
        );
    }
}