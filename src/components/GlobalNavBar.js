import React, { Component } from 'react';
import classNames from 'classnames';
import attachListener from 'attachListener';
import { DOC_CLICK } from 'ui-messages';
import {get, set} from 'LocalSettings';
import {DDCheckbox, A, Icon} from 'components/Html';

export default class GlobalNavBar extends Component {
  static listener = {
    [DOC_CLICK]: function() {
      if (this.state.expanded) {
        this.setState({expanded: false});
      }
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    attachListener(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  //----------------------------------------------------------------------------
  toggleMenu() {
    this.setState({expanded: !this.state.expanded});
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <ul className="nav navbar-nav">
        <li className={classNames({'open':this.state.expanded},'dropdown')}>
          <A className="dropdown-toggle" onClick={this.toggleMenu} title="Settings Browser-List">
            <Icon icon="align-justify" />&nbsp;
            <span className="caret" />
          </A>
          <ul className="dropdown-menu">
            <DDCheckbox setting="browserList.keepDisconnected">
              Keep disconnected
            </DDCheckbox>
          </ul>
        </li>
      </ul>
    );
  }
}

