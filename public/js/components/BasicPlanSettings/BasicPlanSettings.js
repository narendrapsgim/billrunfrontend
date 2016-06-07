import React, { Component } from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';

class BasicPlanSettings extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { onChange } = this.props;

    return (
      <div className="BasicPlanSettings">
        <h4>Basic Plan Settings</h4>
        <div className="row">
          <div className="col-md-6">
            <TextField id="PlanName"
                       onChange={onChange}
                       floatingLabelText="Plan Name"
            />
          </div>
          <div className="col-md-4" >
            <TextField id="PlanCode"
                       onChange={onChange}
                       floatingLabelText="Plan Code"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TextField id="PlanDescription"
                       onChange={onChange}
                       floatingLabelText="Plan Description"
                       multiLine={true}
                       rows={3}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BasicPlanSettings;
