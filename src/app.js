import React from 'react';
import ReactDOM from 'react-dom';

import messages from 'messages';

import dispatcher from 'Dispatcher';
import Application from 'components/Application';

let connection = null;

const bindEventToDispatch = (name) => {
  connection.on(messages[name], dispatcher.send.bind(dispatcher, messages[name]));
}

const onInitalRenderFinished = () => {
  connection = window.karmaLiveReporter.connect();

  // forward all events to dispatcher
  Object.keys(messages).forEach(bindEventToDispatch);
};

const onLoaded = () => {
  ReactDOM.render(<Application />, document.getElementById('appcontainer'), onInitalRenderFinished);
};

document.addEventListener('DOMContentLoaded', onLoaded, false);

dispatcher.on(messages.CONFIG, (config) => {
  console.log(config);
});