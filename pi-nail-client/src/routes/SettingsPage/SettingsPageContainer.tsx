import { connect } from 'react-redux';
import { PIDState } from '../../models/PIDState';
import { ISettings } from '../../models/shared';
import { updateSettings } from '../../modules/piNail';
import { IPiNailStore } from '../../store/piNailStore';
import SettingsPage from './SettingsPage';

export namespace SettingsPageProps {
    export interface IStateProps {
        settings: ISettings;
    }

    export interface IDispatchProps {
        acknowledgeMessage: () => void;
        updateSettings: (settings: ISettings) => void;
    }

    export interface IOwnProps {
    }

    export interface IProps extends IStateProps, IDispatchProps, IOwnProps { }

    // State for the component
    export interface IState {
        settings: ISettings;
        errors: {
            [id: string]: { 
                error: boolean, 
                message?: string 
            }
        };
    }
}

function mapStateToProps(state: IPiNailStore, ownProps: any) {
    return {
        settings: state.piNail.settings || {
            cycleTime: 0,
            maxPower: 100,
            maxTemp: 200,
            setPoint: 0,
            state: PIDState.Stopped,
            tcInterval: 0.25,
            tunings: {
                p: 8,
                i: 2,
                d: 10
            }
        }
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
        updateSettings: (settings: ISettings): void => {
            dispatch(updateSettings(settings));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPage);