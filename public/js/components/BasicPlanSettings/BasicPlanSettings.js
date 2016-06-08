import React, { Component } from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem    from 'material-ui/MenuItem';

class BasicPlanSettings extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { onChange } = this.props;

    let transaction_options = ["Every Month", "Every Week"].map((op, key) => {
      return (<MenuItem value={op} primaryText={op} key={key} />);
    });
    
    return (
      <div className="BasicPlanSettings">
        <div className="BasicSettings">
          <h4>Basic Settings</h4>
          <div className="row">
            <div className="col-xs-6">
              <div className="box">
                <TextField id="PlanName"
                           onChange={onChange}
                           floatingLabelText="Plan Name"
                />
              </div>
            </div>
            <div className="col-xs-4" >
              <div className="box">
                <TextField id="PlanCode"
                           onChange={onChange}
                           floatingLabelText="Plan Code"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <TextField id="PlanDescription"
                           onChange={onChange}
                           floatingLabelText="Plan Description"
                           multiLine={true}
                           rows={3}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="Trial">
          <h4>Trial</h4>
          <div className="row">
            <div className="box">
              <SelectField
                  id="Transaction"
                  floatingLabelText="*Transaction"
                  onChange={onChange}>
                { transaction_options }
              </SelectField>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicPlanSettings;
