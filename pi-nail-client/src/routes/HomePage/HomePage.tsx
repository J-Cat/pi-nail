import * as React from 'react';
import { HomePageProps } from './HomePageContainer';

export default class HomePage extends React.Component<HomePageProps.IProps, HomePageProps.IState> {   
    constructor(props: HomePageProps.IProps) {
        super(props);
    }

    public render() {
        return "Home";
    }
}