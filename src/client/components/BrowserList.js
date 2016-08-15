//==============================================================================
import React, { Component } from 'react';
import dispatcher from 'Dispatcher';
import attachListener from 'attachListener';
import {map} from 'lodash';
import {
  RUN_START, BROWSERS_CHANGE
} from 'app-constants';

import Browser from 'components/Browser';

//==============================================================================
export default class BrowserList extends Component {
  static listener = {
    [BROWSERS_CHANGE]: function(browsers) {
      this.setState({browsers});
    }
  };

  //----------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      browsers: []
    };
    attachListener(this);
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
  renderItems() {
    return map(this.state.browsers, (browser, index) => (
      <li key={index} className="list-group-item">
        <Browser browser={browser} />
      </li>
    ));
  }

  //----------------------------------------------------------------------------
  render() {
    return (
      <ul className="list-group">
        {(this.state.browsers.length)
          ? this.renderItems()
          : this.renderEmpty()
        }
      </ul>
    );
  }
}

