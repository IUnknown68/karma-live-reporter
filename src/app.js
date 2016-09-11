import React from 'react';
import ReactDOM from 'react-dom';

import messages from 'messages';
import uiMessages from 'ui-messages';

import dispatcher from 'Dispatcher';
import {load as loadSettings, get} from 'LocalSettings';
import 'service/Browser';
import Application from 'components/Application';

let connection = null;

const bindEventToDispatch = (name) => {
  connection.on(messages[name], dispatcher.send.bind(dispatcher, messages[name]));
}

const onInitalRenderFinished = () => {
  loadSettings();
  connection = window.karmaLiveReporter.connect();
  // forward all events to dispatcher
  Object.keys(messages).forEach(bindEventToDispatch);
};

const onLoaded = () => {
  ReactDOM.render(<Application />, document.getElementById('appcontainer'), onInitalRenderFinished);
};

document.addEventListener('click', dispatcher.send.bind(dispatcher, uiMessages.DOC_CLICK), false);

document.addEventListener('DOMContentLoaded', onLoaded, false);

//dispatcher.on('settings.changed', (path, value) => {console.log('Settings changed:', path, value)});
