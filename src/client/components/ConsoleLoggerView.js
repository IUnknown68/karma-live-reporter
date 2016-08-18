//==============================================================================
import React, { Component } from 'react';
import attachListener from 'attachListener';
import { BROWSER_LOG, BROWSER_START } from 'app-constants';

//==============================================================================
export default class ConsoleLoggerView extends Component {
  static listener = {
    [BROWSER_START]: function(browser) {
      if (browser.id === this.props.browser.id) {
        this.clear();
      }
    },
    [BROWSER_LOG]: function(browser, log, type) {
      if (browser.id === this.props.browser.id) {
        this.appendLog({log, type}, true);
      }
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.updateScroll = ::this.updateScroll;
    this.scrollEnabled = true;
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  isAtEnd() {
    const e = this.refs.root;
    return e.scrollHeight - e.scrollTop === e.clientHeight;
  }

  //----------------------------------------------------------------------------
  _wantScroll() {
    return this.scrollEnabled;
  }

  //----------------------------------------------------------------------------
  updateScroll() {
    if (!this.refs.root) {
      return;
    }
    if (this._wantScroll()) {
      this.refs.root.scrollTop = this.refs.root.scrollHeight;
    }
  }

  //----------------------------------------------------------------------------
  componentDidMount() {
    this.refs.root.addEventListener('scroll', () => {
      this.scrollEnabled = this.isAtEnd();
    });
    this.renderAllEntries();
  }

  //----------------------------------------------------------------------------
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  //----------------------------------------------------------------------------
  clear() {
    let node = this.refs.root;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  //----------------------------------------------------------------------------
  renderAllEntries() {
    let node = this.refs.root;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    this.props.entries.forEach(entry => {
      this.appendLog(entry, false);
    });
    setTimeout(this.updateScroll, 10);
  }

  //----------------------------------------------------------------------------
  appendLog(entry, update = false) {
    const entryNode = document.createElement('div');
    entryNode.className = entry.type;
    this.appendLogEntryIcon(entry, entryNode);
    entryNode.appendChild(document.createTextNode(entry.log));
    this.refs.root.appendChild(entryNode);
    if (update) {
      this.updateScroll();
    }
  }

  //----------------------------------------------------------------------------
  appendLogEntryIcon(entry, parentNode) {
    let className = 'glyphicon glyphicon-';
    switch(this.props.type) {
      case 'info':
        className += 'info-sign';
        break;
      case 'warn':
        className += 'warning-sign';
        break;
      case 'error':
        className += 'remove-sign';
        break;
      default:
        className = null;
        break;
    }
    if (className) {
      parentNode.appendChild(document.createElement('span'))
        .className = className;
    }
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div ref="root" className="logger console" />
    );
  }

}

