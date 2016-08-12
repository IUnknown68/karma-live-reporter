//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import classNames from 'classNames';
import attachListener from 'attachListener';
import {
  CONNECT, DISCONNECT,
  BROWSER_REGISTER, BROWSER_START, CURRENT_STATE
} from 'app-constants';

import Browser from 'components/Browser';

//==============================================================================
export default class Application extends Component {
  static listener = {
    [CONNECT]: function() {
      this.setState({connected: true});
    },
    [DISCONNECT]: function() {
      this.setState({connected: false});
    },
    [BROWSER_REGISTER]: function(browser) {
      this.addBrowser(browser);
    },
    [CURRENT_STATE]: function(state) {
      console.log(state);
      let browsers = new Map();
      state.browsers.forEach(browser => {
        browsers.set(browser.id, browser);
      });
      this.setState({browsers});
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      browsers: new Map()
    };
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  addBrowser(browser) {
    if (!this.state.browsers.has(browser.id)) {
      this.state.browsers.set(browser.id, browser);
      this.setState({browser: this.state.browsers});
    }
  }

  //----------------------------------------------------------------------------
  renderBrowsers() {
    const result = [];
    this.state.browsers.forEach(browser => {
      result.push(<Browser key={browser.id} browser={browser} />);
    });
    return result;
  }

  //----------------------------------------------------------------------------
  render() {
    const connectionStatusClasses = classNames({
      'alert-info': this.state.connected,
      'alert-warinig': !this.state.connected
    }, 'alert');
    const connectionMsg = (this.state.connected)
      ? 'Connected'
      : 'Disconnected';
    return (
      <div id="app">
        <div className={connectionStatusClasses}>{connectionMsg}</div>
        {this.renderBrowsers()}
      </div>
    );
  }
}

