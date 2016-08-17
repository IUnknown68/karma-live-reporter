//==============================================================================
import React, { Component } from 'react';
import attachListener from 'attachListener';
import { ResultEntry } from 'components/LoggerEntries';
import { SPEC_COMPLETED } from 'app-constants';

//==============================================================================
export default class ResultLoggerView extends Component {
  static listener = {
    [SPEC_COMPLETED]: function(browser, result) {
      if (browser.id !== this.props.browser.id) {
        return;
      }
      this.appendLog(result, true);
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
  renderAllEntries() {
    let node = this.refs.root;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    this.currentSuite = [];
    this.props.entries.forEach(entry => {
      this.appendLog(entry, false);
    });
    setTimeout(this.updateScroll, 10);
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
    return nextProps.entries.length !== this.props.entries.length;
  }

  //----------------------------------------------------------------------------
  componentDidUpdate() {
    this.renderAllEntries();
  }

  //----------------------------------------------------------------------------
  appendLogEntryIcon(className, parentNode) {
    let iconClassName = 'glyphicon glyphicon-';
    switch(className) {
      case 'skipped':
        iconClassName += 'minus';
        break;
      case 'succeeded':
        iconClassName += 'ok';
        break;
      case 'failed':
        iconClassName += 'remove';
        break;
    }
    if (iconClassName) {
      parentNode.appendChild(document.createElement('span'))
        .className = iconClassName;
    }

  }

  //----------------------------------------------------------------------------
  appendLogEntryLog(entry, parentNode) {
    if (!entry.log) {
      return;
    }
    entry.log.forEach(logEntry => {
      parentNode.appendChild(document.createElement('div'))
        .className = 'indent';
    });
  }

  //----------------------------------------------------------------------------
  appendLogEntry(entry, entryNode) {
    const node = document.createElement('div');
    const className = (entry.skipped)
      ? 'skipped'
      : (entry.success)
        ? 'succeeded'
        : 'failed';
    node.className = `description ${className}`;

    const indent = entry.suite.length;
    node.style.marginLeft = `${indent}em`;

    this.appendLogEntryIcon(className, node);
    node.appendChild(document.createTextNode(entry.description));
    this.appendLogEntryLog(entry, node);
    entryNode.appendChild(node);
  }

  //----------------------------------------------------------------------------
  appendLog(entry, update = false) {
    const entryNode = document.createElement('div');

    const suite = entry.suite;

    let suiteChanged = false;
    for (let n = 0; n < suite.length; n++) {
      suiteChanged |= (this.currentSuite[n] !== suite[n]);
      if (suiteChanged) {
        const node = document.createElement('div');
        node.style.marginLeft = `${n}em`;
        entryNode.appendChild(node)
          .appendChild(document.createTextNode(suite[n]));
      }
    }
    this.currentSuite = suite;

    this.appendLogEntry(entry, entryNode);
    this.refs.root.appendChild(entryNode);
    if (update) {
      this.updateScroll();
    }
  }

  //----------------------------------------------------------------------------
  render() {
    console.log('RENDER');
    return (
      <div ref="root" className={this.props.className || ''} />
    );
  }

}

