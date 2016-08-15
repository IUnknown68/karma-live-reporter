//==============================================================================
import React, { Component } from 'react';

import LoggerView from 'components/LoggerView';
import ResultLoggerView from 'components/ResultLoggerView';
import { LogEntry, ErrorEntry } from 'components/LoggerEntries';

import {
  READY, EXECUTING,
  READY_DISCONNECTED, EXECUTING_DISCONNECTED,
  DISCONNECTED
} from 'karma-browser-constants';

//==============================================================================
export class SummaryTab  extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  renderLastResult() {
    const lastResult = this.props.lastResult;
    return (lastResult)
      ? (
        <table className="table lastResult"><tbody>
          <tr>
            <td>Success: </td><td>{lastResult.success}</td>
            <td>Failed: </td><td>{lastResult.failed}</td>
            <td>Skipped: </td><td>{lastResult.skipped}</td>
            <td>Total: </td><td>{lastResult.total}</td>
            <td>Total time: </td><td>{lastResult.totalTime}</td>
          </tr>
        </tbody></table>
      )
      : false;
  }

  //----------------------------------------------------------------------------
  renderStatus() {
    let state = '';
    if (this.props.lastResult && this.props.lastResult.disconnected) {
      state = 'Disconnected';
    }
    else {
      switch(this.props.state) {
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
  render() {
    return (
      <div className="summary">
        <p>{this.props.browser.fullName}</p>
        <p>{`ID: ${this.props.browser.id}`}</p>
        {this.renderLastResult()}
        {this.renderStatus()}
      </div>
    );
  }
}

//==============================================================================
export class ResultTab  extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <ResultLoggerView className="logger results" entries={this.props.results} />
    );
  }
}

//==============================================================================
export class ConsoleTab  extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <LoggerView className="logger console" entryComponent={LogEntry} entries={this.props.log} />
    );
  }
}

//==============================================================================
export class ErrorsTab  extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <LoggerView className="logger errors" entryComponent={ErrorEntry} entries={this.props.errors} />
    );
  }
}
