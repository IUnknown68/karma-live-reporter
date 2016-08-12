//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import attachListener from 'attachListener';
import {
  CONNECT, DISCONNECT,
  RUN_START, RUN_COMPLETE,
  BROWSER_START, BROWSER_COMPLETE,
  BROWSER_LOG, BROWSER_ERROR,
  SPEC_SUCCESS, SPEC_SKIPPED, SPEC_FAILURE
} from 'app-constants';

import {
  READY, EXECUTING,
  READY_DISCONNECTED, EXECUTING_DISCONNECTED,
  DISCONNECTED
} from 'karma-browser-constants.js';

//==============================================================================
export default class Browser extends Component {
  static listener = {
    [BROWSER_START]: function(browser) {
      if (browser.id === this.state.id) {
        //console.log(browser);
        this.setState(browser);
      }
    },
    [BROWSER_COMPLETE]: function(browser) {
      if (browser.id === this.state.id) {
        console.log(BROWSER_COMPLETE, browser.state);
        this.setState(browser);
      }
    },
    [SPEC_SUCCESS]: function(browser, result) {
      if (browser.id === this.state.id) {
        //console.log(browser, result);
        this.setState(browser);
      }
    },
    [BROWSER_LOG]: function(browser, log, type) {
      if (browser.id === this.state.id) {
        //console.log(BROWSER_LOG, browser, log, type);
      }
    },
    [BROWSER_ERROR]: function(browser, error) {
      if (browser.id === this.state.id) {
        //console.log(BROWSER_ERROR, browser, error);
      }
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = props.browser;
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  renderStatus() {
    let state = '';
    if (this.state.lastResult && this.state.lastResult.disconnected) {
      state = 'Disconnected';
    }
    else {
      switch(this.state.state) {
        case READY:
          state = 'Ready.'; break;
        case EXECUTING:
          state = 'Running...'; break;
        case READY_DISCONNECTED:
          state = 'Disconnected'; break;
        case EXECUTING_DISCONNECTED:
          state = 'Disconnecting...'; break;
        case DISCONNECTED:
          state = 'Disconnected.'; break;
      }
    }
    return (
      <div className="status">{state}</div>
    );
  }

  //----------------------------------------------------------------------------
  renderLog() {
    return false;
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div className="browser">
        <h3>{this.state.name}</h3>
        <p>{this.state.fullName}</p>
        <p>{`ID: ${this.state.id}`}</p>
        {this.renderStatus()}
        {this.renderLog()}
      </div>
    );
  }
}

