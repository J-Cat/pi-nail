/*
 * File: c:\pi-nail\pi-nail-client\src\App.tsx
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
import { CssBaseline } from 'material-ui';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Store } from 'redux';
import './App.css';
import Footer from './components/Footer';
import Routes from './routes';
import { configureStore } from './store/createStore';
import { IPiNailStore } from './store/piNailStore';

const initialState = window.__INITIAL_STATE__;
export const store: Store<IPiNailStore> = configureStore(initialState);

const piNailLightTheme = createMuiTheme({
  typography: {
    fontFamily: 'Calibri, sans-serif'
  }
});

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <MuiThemeProvider theme={piNailLightTheme}>
            <CssBaseline />
            <div className="maincontainer text-center">
              <div className="content row scroll-y">
                <Routes />
              </div>
              <Footer className="footer"/>
            </div>
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
