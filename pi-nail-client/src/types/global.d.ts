/* Global definitions for development */
declare interface Window {
    // A hack for the Redux DevTools Chrome extension.
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
    __INITIAL_STATE__?: any;
    // The redux developer tools window
    devToolsExtension?: any;
}

declare var NODE_ENV: string;
declare var __DEV__: boolean;
declare var __PROD__: boolean;
declare var __DEBUG__: boolean;
declare var __DEBUG_NEW_WINDOW__: boolean;
declare var __BASENAME__: string;

declare interface ICallApiAction {
    [x: number]: {
        endpoint?: string;
        method?: string;
        types?: Array<string | object>;
        headers?: { 'Content-Type': string };
        body?: any;
    }
}