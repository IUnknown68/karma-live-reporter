//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import attachListener from 'attachListener';
import {
  CONNECT, DISCONNECT,
  RUN_START, RUN_COMPLETE,
  BROWSER_START, BROWSER_COMPLETE,
  SPEC_SUCCESS, SPEC_SKIPPED, SPEC_FAILURE
} from 'app-constants';

//==============================================================================
export default class Application extends Component {
  static listener = {
    [CONNECT]: function() {
      this.setState({label: 'Connected'});
    },
    [DISCONNECT]: function() {
      this.setState({label: 'Disconnected'});
    },
    [SPEC_SUCCESS]: function(browser, result) {
      console.log(SPEC_SUCCESS, browser, result);
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      label: 'booting...'
    };
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div id="app">
        <h1>{this.state.label}</h1>
      </div>
    );
  }
}

