//==============================================================================
import React, { Component } from 'react';

//==============================================================================
export default class ResultEntry extends Component {
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
        {this.props.description}
      </div>
    );
  }
}
