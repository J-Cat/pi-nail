import * as React from 'react';
// import ReactFlot from '../../components/react-flot';
import { SettingsPageProps } from './SettingsPageContainer';
// import { RadioButtonGroup, RadioButton } from 'material-ui';

export default class SettingsPage extends React.Component<SettingsPageProps.IProps, SettingsPageProps.IState> {   
    constructor(props: SettingsPageProps.IProps) {
        super(props);
    }

    public render() {
        return "Settings";
    }
}
