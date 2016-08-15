//==============================================================================
import React, { Component } from 'react';
import { ResultEntry } from 'components/LoggerEntries';
import { isEqual } from 'lodash';

//==============================================================================
export default class ResultLoggerView extends Component {
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
    this._update();
    //setTimeout(this._update, 10);
  }

  //----------------------------------------------------------------------------
  componentDidUpdate() {
    this._update();
//    setTimeout(this._update, 10);
  }

  //----------------------------------------------------------------------------
  renderEntries() {
    if (!this.props.entries) {
      return false;
    }
    let currentSuite = [];

    return this.props.entries.map((entry, index) => {
      const suite = entry.suite;
      const arDiff = [];
      const items = [];

      const len = Math.max(currentSuite.length, suite.length);
      for (let n = 0; n < len; n++) {
        if (currentSuite[n] !== suite[n]) {
          arDiff.push(suite[n]);
        }
      }

      let refreshTo = suite.length;
      let refreshFrom = refreshTo - arDiff.length;

      for (let n = refreshFrom; n < refreshTo; n++) {
        const style = {
          marginLeft: `${n}em`
        };
        items.push(
          <div key={items.length} style={style}>
            {suite[n]}
          </div>
        );
      }
      items.push(<ResultEntry key={items.length} {...entry} />);

      currentSuite = suite;

      return (
        <div key={index} >
          {items}
        </div>
      );
    });
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

