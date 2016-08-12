import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import constants from 'app-constants';

import dispatcher from 'Dispatcher';
import Application from 'components/Application';

let connection = null;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Application />, document.getElementById('appcontainer'), () => {
    connection = io();
    Object.keys(constants).forEach(name => {
      connection.on(constants[name], dispatcher.send.bind(dispatcher, constants[name]));
    });
  });
}, false);
