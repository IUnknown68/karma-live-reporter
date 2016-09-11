//==============================================================================
import React, { Component } from 'react';
import attachListener from 'attachListener';
import autoScroll from 'autoScroll';
import { SPEC_COMPLETED, BROWSER_START } from 'messages';

//==============================================================================
export default class ResultLoggerView extends Component {
  static listener = {
    [BROWSER_START]: function(browser) {
      if (browser.id === this.props.browser.id) {
        this.clear();
      }
    },
    [SPEC_COMPLETED]: function(browser, result) {
      if (browser.id === this.props.browser.id) {
        this.appendLog(result, true);
      }
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    autoScroll(this);
    attachListener(this);
  }

  //----------------------------------------------------------------------------
  componentDidMount() {
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
    this.currentSuite = [];
    this.props.entries.forEach(entry => {
      this.appendLog(entry, false);
    });
    setTimeout(this.updateScroll, 10);
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
      const el = document.createElement('div');
      el.appendChild(document.createTextNode(logEntry));
      parentNode.appendChild(el)
        .className = 'indent';
    });
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div ref="root" className="logger results" />
    );
  }

}

