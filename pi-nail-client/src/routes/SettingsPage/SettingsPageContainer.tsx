import { connect } from 'react-redux';

import { IPiNailState } from '../../models/IPiNailState';
import { IPiNailData } from '../../models/shared';
// import { updateSettings } from '../../modules/piNail';
import { IPiNailStore } from '../../store/piNailStore';
import SettingsPage from './SettingsPage';

export namespace SettingsPageProps {
    export interface IStateProps {
        piNailState: IPiNailState;
    }

    export interface IDispatchProps {
        acknowledgeMessage: () => void;
        updateSettings: (settings: IPiNailData) => void;
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState {
    }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    return {
        piNailState: state.piNail
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
        acknowledgeMessage: (): void => {
            // dispatch(acknowledgeWorkshopMessage());
            // dispatch(acknowledgeKnowYourPeersMessage());
            // dispatch(acknowledgePicturesMessage());
        },

        updateSettings: (settings: IPiNailData): void => {
            // dispatch(updateSettings(settings));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPage);