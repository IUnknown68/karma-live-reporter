//==============================================================================
import React, { Component } from 'react';

//==============================================================================
export class ResultEntry extends Component {
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
    const className = (this.props.skipped)
      ? 'skipped'
      : (this.props.success)
        ? 'succeeded'
        : 'failed';

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

    const icon = (iconClassName)
      ? (<span className={iconClassName} />)
      : false;

    const indent = this.props.suite.length;
    const style = {
      marginLeft: `${indent}em`
    };

    const log = (this.props.log)
      ? this.props.log.map((logEntry, index) => (
          <div key={index} className="indent">{logEntry}</div>
        ))
      : false;

    return (
      <div className={`description ${className}`} style={style}>
        {icon}
        {this.props.description}
        {log}
      </div>
    );
  }
}

//==============================================================================
export class LogEntry extends Component {
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

//==============================================================================
export class ErrorEntry extends Component {
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
    return (
      <div>
        {this.props.error}
      </div>
    );
  }
}
