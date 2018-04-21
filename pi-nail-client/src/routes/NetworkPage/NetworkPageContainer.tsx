/*
 * File: c:\pi-nail\pi-nail-client\src\routes\SettingsPage\SettingsPageContainer.tsx
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
import { connect } from 'react-redux';
import { IPiNailStore } from '../../store/piNailStore';
import NetworkPage from './NetworkPage';

export namespace NetworkPageProps {
    export interface IStateProps {
    }

    export interface IDispatchProps {
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState {
        bleEnabled: boolean;
        devices: {
            [id: string]: any;
        }
    }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    return {
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NetworkPage);