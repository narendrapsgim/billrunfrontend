import React, { Component } from 'react';
import Help from '../Help';

export default class BasicPlanSettings extends Component {
  constructor(props) {
    super(props);
    this.helpContent = `Basic settings
yo!
  `;
  }

  render() {
    return (
      <div>
        <h4>
          Basic Settings <Help contents={this.helpContent} />
        </h4>
        <div className="form-group">
          <label htmlFor="plan-name">*Plan Name</label>
          <input type="text" className="form-control" id="plan-name" />
        </div>
        <div className="form-group">
          <label htmlFor="plan-description">Plan Description</label>
          <textarea className="form-control" id="plan-description"></textarea>
        </div>
      </div>
    );
  }
}
