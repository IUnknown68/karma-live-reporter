//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import attachListener from 'attachListener';
import {map} from 'lodash';
import classNames from 'classnames';
import favIcon from 'favicon';
import {
  RUN_START, BROWSERS_CHANGE
} from 'messages';

import {
  READY, EXECUTING,
  READY_DISCONNECTED, EXECUTING_DISCONNECTED,
  DISCONNECTED
} from 'karma-browser-constants';

import Browser from 'components/Browser';

const ITEM_SPACING_EM = 2.5;

//==============================================================================
export default class BrowserList extends Component {
  static listener = {
    [BROWSERS_CHANGE]: function(browsers) {
      const selected = Math.max(Math.min(this.state.selected, browsers.length - 1), 0);
      this.setState({browsers, selected});
      favIcon.updateList(browsers);
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      browsers: [],
      selected: -1
    };
    this.renderBrowser = ::this.renderBrowser;
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  selectBrowser(index) {
    this.setState({selected: index});
  }

  //----------------------------------------------------------------------------
  renderEmpty() {
    return (
      <li className="list-group-item">
        <h4>Currently no Browsers available.</h4>
      </li>
    );
  }

  //----------------------------------------------------------------------------
  renderBrowser(browser, index) {
    const tabControlStyles = {
      marginTop: `${index * ITEM_SPACING_EM}em`
    };

    let className = '';
    switch(browser.state) {
      case EXECUTING:
        className = 'running';
        break;
      case DISCONNECTED:
        className = 'disconnected';
        break;
      default:
        className = (browser.lastResult.failed > 0)
          ? 'failed'
          : (browser.lastResult.success > 0)
            ? 'success'
            : 'ready';
        break;
    }

    const classNameBrowser = classNames({
      active: this.state.selected === index,
      browser: true
    }, className);

    return (
      <div key={index} className={classNameBrowser}>
        <div className="tabbody">
          <Browser browser={browser} />
        </div>
        <div className="tabcontrol" style={tabControlStyles}>
          <h4 onClick={this.selectBrowser.bind(this, index)}>{browser.name}</h4>
        </div>
      </div>
    );
  }

  //----------------------------------------------------------------------------
  renderItems() {
    return map(this.state.browsers, this.renderBrowser);
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div id="browserlist">
        {(this.state.browsers.length)
          ? this.renderItems()
          : this.renderEmpty()
        }
      </div>
    );
  }
}

