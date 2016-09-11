import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import {get, set} from 'LocalSettings';

export class A extends Component {
  //----------------------------------------------------------------------------
  render() {
    return (
      <a href="javascript:void(0)" {...this.props}>{this.props.children}</a>
    );
  }
}

export class Icon extends Component {
  //----------------------------------------------------------------------------
  render() {
    return (
      <i className={`glyphicon glyphicon-${this.props.icon}`} />
    );
  }
}

export class DDCheckbox extends Component {
  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  //----------------------------------------------------------------------------
  toggle() {
    set(this.props.setting, !get(this.props.setting));
  }

  //----------------------------------------------------------------------------
  render() {
    const checked = get(this.props.setting);
    return (
      <li>
        <A onClick={this.toggle}>
          <i className={`glyphicon glyphicon-${checked?'ok':'empty'}`} />
          &nbsp;{this.props.children}
        </A>
      </li>
    );
  }
}

