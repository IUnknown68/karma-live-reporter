import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import {
  CONNECT, DISCONNECT, CURRENT_STATE,
  RUN_START, RUN_COMPLETE,
  BROWSER_REGISTER, BROWSER_START, BROWSER_COMPLETE,
  BROWSER_LOG, BROWSER_ERROR,
  SPEC_SUCCESS, SPEC_SKIPPED, SPEC_FAILURE
} from 'app-constants';

import dispatcher from 'Dispatcher';
import Application from 'components/Application';

let connection = null;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Application />, document.getElementById('appcontainer'), () => {
    connection = io();

    connection.on(CONNECT, () => {
      dispatcher.send(CONNECT, connection);
    });

    connection.on(DISCONNECT, () => {
      dispatcher.send(DISCONNECT, connection);
    });

    connection.on(CURRENT_STATE, (state) => {
      dispatcher.send(CURRENT_STATE, state);
    });

    connection.on(RUN_START, () => {
      dispatcher.send(RUN_START);
    });

    connection.on(BROWSER_REGISTER, (browser) => {
      dispatcher.send(BROWSER_REGISTER, browser);
    });

    connection.on(RUN_COMPLETE, () => {
      dispatcher.send(RUN_COMPLETE);
    });

    connection.on(BROWSER_ERROR, (browser, error) => {
      dispatcher.send(BROWSER_ERROR, browser, error);
    });

    connection.on(BROWSER_LOG, (browser, log, type) => {
      dispatcher.send(BROWSER_LOG, browser, log, type);
    });

    connection.on(BROWSER_START, (browser) => {
      dispatcher.send(BROWSER_START, browser);
    });

    connection.on(BROWSER_COMPLETE, (browser) => {
      dispatcher.send(BROWSER_COMPLETE, browser);
    });

    connection.on(SPEC_SUCCESS, (browser, result) => {
      dispatcher.send(SPEC_SUCCESS, browser, result);
    });

    connection.on(SPEC_SKIPPED, (browser, result) => {
      dispatcher.send(SPEC_SKIPPED, browser, result);
    });

    connection.on(SPEC_FAILURE, (browser, result) => {
      dispatcher.send(SPEC_FAILURE, browser, result);
    });
  });
}, false);
