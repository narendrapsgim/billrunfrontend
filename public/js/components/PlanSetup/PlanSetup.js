import React, { Component } from 'react';

import BasicPlanSettings from '../BasicPlanSettings';

class PlanSetup extends Component {
  constructor(props) {
    super(props);
    this.onChangeFieldValue = this.onChangeFieldValue.bind(this);

    this.state = {};
  }

  onChangeFieldValue(e, idx, value) {
    let { id } = e.target;
    console.log(e.target, value);
    this.setState({[id]: value});
  }
  
  render() {
    return (
      <div className="PlanSetup">
        <div className="row">
          <div className="col-md-6">
            <BasicPlanSettings onChange={this.onChangeFieldValue} />
          </div>
          <div className="col-md-4">
            
          </div>
        </div>
      </div>
    );
  }
}

export default PlanSetup;
