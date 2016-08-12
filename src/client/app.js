import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import {
  CONNECT, DISCONNECT,
  RUN_START, RUN_COMPLETE,
  BROWSER_START, BROWSER_COMPLETE,
  SPEC_SUCCESS, SPEC_SKIPPED, SPEC_FAILURE
} from 'app-constants';

import dispatcher from 'Dispatcher';
import Application from 'components/Application';

let connection = null;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Application />, document.getElementById('app'), () => {
    connection = io();

    connection.on(CONNECT, () => {
      dispatcher.send(CONNECT, connection);
    });

    connection.on(DISCONNECT, () => {
      dispatcher.send(DISCONNECT, connection);
    });

    connection.on(RUN_START, () => {
      dispatcher.send(RUN_START);
    });

    connection.on(RUN_COMPLETE, () => {
      dispatcher.send(RUN_COMPLETE);
    });

    connection.on(BROWSER_START, (browser) => {
      dispatcher.send(BROWSER_START, browser);
    });

    connection.on(BROWSER_COMPLETE, (browserId) => {
      dispatcher.send(BROWSER_COMPLETE, browserId);
    });

    connection.on(SPEC_SUCCESS, (browserId, result) => {
      dispatcher.send(SPEC_SUCCESS, browserId, result);
    });

    connection.on(SPEC_SKIPPED, (browserId, result) => {
      dispatcher.send(SPEC_SKIPPED, browserId, result);
    });

    connection.on(SPEC_FAILURE, (browserId, result) => {
      dispatcher.send(SPEC_FAILURE, browserId, result);
    });
  });
}, false);
