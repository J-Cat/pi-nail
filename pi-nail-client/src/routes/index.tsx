import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

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
                    path={`${config.baseRoutePath}/`}
                    component={HomePage}
                />
            </Switch>
        );
    }
}