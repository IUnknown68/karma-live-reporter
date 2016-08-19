//==============================================================================
import React, { Component } from 'react';

import ResultLoggerView from 'components/ResultLoggerView';
import ConsoleLoggerView from 'components/ConsoleLoggerView';
import ErrorLoggerView from 'components/ErrorLoggerView';

import {
  READY, EXECUTING,
  READY_DISCONNECTED, EXECUTING_DISCONNECTED,
  DISCONNECTED
} from 'karma-browser-constants';

//==============================================================================
class SummaryTab  extends Component {
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
class ResultTab  extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <ResultLoggerView browser={this.props.browser} entries={this.props.results} />
    );
  }
}

//==============================================================================
class ConsoleTab  extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <ConsoleLoggerView browser={this.props.browser} entries={this.props.log} />
    );
  }
}

//==============================================================================
class ErrorsTab  extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <ErrorLoggerView browser={this.props.browser} entries={this.props.errors} />
    );
  }
}

const TABS = [
  {
    title: 'Result',
    component: ResultTab
  },
  {
    title: 'Summary',
    component: SummaryTab
  },
  {
    title: 'Console',
    component: ConsoleTab
  },
  {
    title: 'Errors',
    component: ErrorsTab
  }
];

export default TABS;