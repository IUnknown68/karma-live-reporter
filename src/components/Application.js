//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import classNames from 'classnames';
import attachListener from 'attachListener';
import {
  CONNECT, CONFIG, DISCONNECT,
  BROWSER_REGISTER, BROWSER_START, CURRENT_STATE
} from 'messages';
import { TAB_CHANGED } from 'ui-messages';

import BrowserList from 'components/BrowserList';
import TABS from 'components/BrowserTabs';
import GlobalNavBar from 'components/GlobalNavBar';
import {A, Icon} from 'components/Html';

//==============================================================================
export default class Application extends Component {
  static listener = {
    [CONNECT]: function() {
      this.setState({connected: true});
    },
    [CONFIG]: function(config) {
      this.setState({config});
    },
    [DISCONNECT]: function() {
      this.setState({connected: false});
    },
    [TAB_CHANGED]: function(activeTab) {
      this.setState({activeTab});
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      config: false,
      activeTab: 0,
      runningLocal: false
    };
    attachListener(this);
    this.runHere = this.runHere.bind(this);
  }

  //----------------------------------------------------------------------------
  getTestUrl() {
    if (!this.state.config) {
      return false;
    }
    const cfg = this.state.config;
    return `${cfg.protocol}//${cfg.hostname}:${cfg.port}${cfg.urlRoot}`;
  }

  //----------------------------------------------------------------------------
  runHere() {
    this.setState({runningLocal: !this.state.runningLocal});
  }

  //----------------------------------------------------------------------------
  renderBars() {
    const navbars = [];
    if (this.state.config) {
      const msg = (this.state.runningLocal)
        ? 'Disconnect this browser'
        : 'Connect this browser';
      const icon = (this.state.runningLocal)
        ? 'stop'
        : 'play';
      navbars.push(
        <ul key="runHere" className="nav navbar-nav">
          <li>
            <A className="navbar-nav" onClick={this.runHere} title={msg}>
              <Icon icon={icon} />&nbsp;
            </A>
          </li>
        </ul>
      );
    }
    navbars.push(<GlobalNavBar key="globalNavBar"/>);

    const tab = TABS[this.state.activeTab];
    if (tab && tab.contextMenu) {
      const ContextNavBar = tab.contextMenu;
      navbars.push(<ContextNavBar key="contextNavBar"/>);
    }

    return navbars;
  }

  //----------------------------------------------------------------------------
  render() {
    const connectionStatusClasses = classNames({
      'alert-info': this.state.connected,
      'alert-warning': !this.state.connected
    });

    const connectionMsg = (this.state.connected)
      ? 'Connected'
      : 'Disconnected';

    const localTestUrl = (this.state.runningLocal && this.getTestUrl());
    const iframe = (localTestUrl)
      ? (<iframe className="run-here" src={localTestUrl} />)
      : false;

    return (
      <div id="app">
        <nav className={`navbar navbar-default ${connectionStatusClasses}`}>
          <div className="container-fluid">
            <span className="navbar-brand">KLR</span>
            {this.renderBars()}
            <p className={`navbar-right alert ${connectionStatusClasses}`}>{connectionMsg}</p>
            {iframe}
          </div>
        </nav>
        <BrowserList />
      </div>
    );
  }
}
