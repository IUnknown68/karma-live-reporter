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
      if (browser.id === this.props.browser.id) {
        this.setState({state: browser.state, lastResult: browser.lastResult});
      }
    },
    [BROWSER_COMPLETE]: function(browser) {
      if (browser.id === this.props.browser.id) {
        this.setState({state: browser.state, lastResult: browser.lastResult});
      }
    },
    [SPEC_SUCCESS]: function(browser, result) {
      if (browser.id === this.props.browser.id) {
      }
    },
    [SPEC_SKIPPED]: function(browser, result) {
      if (browser.id === this.props.browser.id) {
      }
    },
    [SPEC_FAILURE]: function(browser, result) {
      if (browser.id === this.props.browser.id) {
      }
    },
    [BROWSER_LOG]: function(browser, log, type) {
      if (browser.id === this.props.browser.id) {
        //console.log(BROWSER_LOG, browser, log, type);
      }
    },
    [BROWSER_ERROR]: function(browser, error) {
      if (browser.id === this.props.browser.id) {
        //console.log(BROWSER_ERROR, browser, error);
      }
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      state: props.browser.state,
      lastResult: props.browser.lastResult
    };
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
  renderLastResult() {
    return (this.state.lastResult)
      ? (
        <table className="table lastResult"><tbody>
          <tr>
            <td>Success: </td><td>{this.state.lastResult.success}</td>
            <td>Failed: </td><td>{this.state.lastResult.failed}</td>
            <td>Skipped: </td><td>{this.state.lastResult.skipped}</td>
            <td>Total: </td><td>{this.state.lastResult.total}</td>
            <td>Total time: </td><td>{this.state.lastResult.totalTime}</td>
          </tr>
        </tbody></table>
      )
      : false;
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div className="browser">
        <h3>{this.props.browser.name}</h3>
        {this.renderLastResult()}
        <div className="body">
          <p>{this.props.browser.fullName}</p>
          <p>{`ID: ${this.props.browser.id}`}</p>
          {this.renderStatus()}
          {this.renderLog()}
        </div>
      </div>
    );
  }
}

