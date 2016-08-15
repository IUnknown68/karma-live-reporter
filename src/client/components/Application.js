//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import classNames from 'classNames';
import attachListener from 'attachListener';
import {
  CONNECT, DISCONNECT,
  BROWSER_REGISTER, BROWSER_START, CURRENT_STATE
} from 'app-constants';

import BrowserList from 'components/BrowserList';

//==============================================================================
export default class Application extends Component {
  static listener = {
    [CONNECT]: function() {
      this.setState({connected: true});
    },
    [DISCONNECT]: function() {
      this.setState({connected: false});
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      connected: false
    };
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  render() {
    const connectionStatusClasses = classNames({
      'alert-info': this.state.connected,
      'alert-warning': !this.state.connected
    }, 'alert');
    const connectionMsg = (this.state.connected)
      ? 'Connected'
      : 'Disconnected';
    return (
      <div id="app">
        <div className={connectionStatusClasses}>{connectionMsg}</div>
        <BrowserList />
      </div>
    );
  }
}

/*
        <BrowserList />

 */