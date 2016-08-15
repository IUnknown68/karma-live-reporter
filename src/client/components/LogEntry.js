//==============================================================================
import React, { Component } from 'react';

//==============================================================================
export default class LogEntry extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
  }

  //----------------------------------------------------------------------------
  shouldComponentUpdate() {
    return false;
  }

  //----------------------------------------------------------------------------
  render() {
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

    const span = (className)
      ? (<span className={className} />)
      : false;

    return (
      <div className={this.props.type}>
        {span}
        {this.props.log}
      </div>
    );
  }
}
