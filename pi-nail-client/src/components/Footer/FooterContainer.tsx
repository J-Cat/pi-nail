/*
 * File: c:\pi-nail\pi-nail-client\src\components\Footer\FooterContainer.tsx
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
import { IMessage, IPiNailState } from '../../models';
// import { updateSettings } from '../../modules/piNail';
import { IPiNailStore } from '../../store/piNailStore';
import Footer from './Footer';

export namespace FooterProps {
    export interface IStateProps {
        messages: IMessage[];
        piNailState: IPiNailState;
    }

    export interface IDispatchProps {
        acknowledgeMessage: () => void;
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState { }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    return {
        messages: [],
        piNailState: state.piNail
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
        acknowledgeMessage: (): void => {
            // dispatch(acknowledgeWorkshopMessage());
            // dispatch(acknowledgeKnowYourPeersMessage());
            // dispatch(acknowledgePicturesMessage());
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer);