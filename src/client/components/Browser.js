//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import attachListener from 'attachListener';
import {
  CONNECT, DISCONNECT,
  RUN_START, RUN_COMPLETE,
  BROWSER_START, BROWSER_COMPLETE,
  BROWSER_LOG, BROWSER_ERROR,
  SPEC_COMPLETED
} from 'app-constants';

import TABS from 'components/BrowserTabs';


//==============================================================================
export default class Browser extends Component {
  static listener = {
    [BROWSER_START]: function(browser) {
      if (browser.id !== this.props.browser.id) {
        return;
      }
      this.setState({
        state: browser.state,
        log: [],
        errors: [],
        results: [],
        lastResult: browser.lastResult
      });
    },
    [BROWSER_COMPLETE]: function(browser) {
      if (browser.id !== this.props.browser.id) {
        return;
      }
      this.setState({
        state: browser.state,
        lastResult: browser.lastResult
      });
    },
    [SPEC_COMPLETED]: function(browser, result) {
      if (browser.id !== this.props.browser.id) {
        return;
      }
      this.state.results.push(result);
      this.forceUpdate();
    },
    [BROWSER_LOG]: function(browser, log, type) {
      if (browser.id !== this.props.browser.id) {
        return;
      }
      this.state.log.push({log, type});
      this.forceUpdate();
    },
    [BROWSER_ERROR]: function(browser, error) {
      if (browser.id !== this.props.browser.id) {
        return;
      }
      this.state.errors.push({error});
      this.forceUpdate();
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      state: props.browser.state,
      log: props.browser.log || [],
      errors: props.browser.errors || [],
      results: props.browser.results || [],
      lastResult: props.browser.lastResult,
      activeTab: 0
    };
    this._logIndex = 0;
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  selectTab(tabIndex) {
    this.setState({activeTab: tabIndex});
  }

  //----------------------------------------------------------------------------
  renderTabHeader(tab, index) {
    const className = (index === this.state.activeTab)
      ? 'active'
      : '';
    return (
      <li key={index} className={className}>
        <a href="javascript:void(0)" onClick={this.selectTab.bind(this, index)}>{tab.title}</a>
      </li>
    );
  }

  //----------------------------------------------------------------------------
  renderTabHeaders() {
    return (
      <ul className="nav nav-tabs">
        {TABS.map((tab, index) => this.renderTabHeader(tab, index))}
      </ul>
    );
  }

  //----------------------------------------------------------------------------
  renderTabBody(tab, index) {
    const className = (index === this.state.activeTab)
      ? 'active'
      : '';
    const TabComp = tab.component;
    return (
      <div className={className} key={index}>
        <TabComp browser={this.props.browser} {...this.state} />
      </div>
    );
  }

  //----------------------------------------------------------------------------
  renderTabBodies() {
    return (
      <div className="body">
        {TABS.map((tab, index) => this.renderTabBody(tab, index))}
      </div>
    );
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div>
        <h3>{this.props.browser.name}</h3>
        {this.renderTabHeaders()}
        {this.renderTabBodies()}
      </div>
    );
  }
}
