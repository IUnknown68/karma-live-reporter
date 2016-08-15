//==============================================================================
import React, { Component } from 'react';

//==============================================================================
export default class LoggerView extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this._update = ::this._update;
    this.scrollEnabled = true;
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
  _update() {
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
    setTimeout(this._update, 10);
  }

  //----------------------------------------------------------------------------
  componentDidUpdate() {
    setTimeout(this._update, 10);
  }

  //----------------------------------------------------------------------------
  renderEntries() {
    const LogEntry = this.props.entryComponent;
    return (this.props.entries)
      ? this.props.entries.map((entry, index) => (
        <LogEntry key={index} {...entry} />
      ))
      : false;
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <div ref="root" className={this.props.className || ''}>
        {this.renderEntries()}
      </div>
    );
  }

}

