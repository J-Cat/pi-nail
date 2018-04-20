import { connect } from 'react-redux';
import { IPiNailStore } from '../../store/piNailStore';
import ChartPage from './ChartPage';

export namespace ChartPageProps {
    export interface IStateProps {
        setPoints: number[],
        temps: number[],
        outputs: number[]
    }

    export interface IDispatchProps {
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
        setPoints: state.piNail.setpointData,
        temps: state.piNail.tempData,
        outputs: state.piNail.heatData
    };
}

function mapDispatchToProps(dispatch: (...args: any[]) => void) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChartPage);