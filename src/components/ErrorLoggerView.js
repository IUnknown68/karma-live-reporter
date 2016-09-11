//==============================================================================
import React, { Component } from 'react';
import attachListener from 'attachListener';
import autoScroll from 'autoScroll';
import { BROWSER_ERROR, BROWSER_START } from 'app-constants';

//==============================================================================
export default class ErrorLoggerView extends Component {
  static listener = {
    [BROWSER_START]: function(browser) {
      if (browser.id === this.props.browser.id) {
        this.clear();
      }
    },
    [BROWSER_ERROR]: function(browser, error) {
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
    entryNode.appendChild(document.createTextNode(entry.error));
    this.refs.root.appendChild(entryNode);
    if (update) {
      this.updateScroll();
    }
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div ref="root" className="logger errors" />
    );
  }

}

