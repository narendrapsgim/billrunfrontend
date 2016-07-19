import React, { Component } from 'react';
import Field from '../Field';
import { connect } from 'react-redux';
import { getPlans } from '../../actions/plansActions';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class New extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getPlans({}));
  }
  
  render() {
    const { settings, onChange, plans, entity, onSave, onCancel } = this.props;
    if (!settings) return (<div></div>);

    const available_plans = [(<option value="-1" disabled key={-1}>Choose Plan</option>),
      ...plans.map((plan, key) => (
        <option value={plan.get('name')} key={key}>{plan.get('name')}</option>
      ))
    ];

    const fieldSettings = settings.getIn(['account', 'fields'])
                                  .filter(field => {
                                    return (field.get('editable') === undefined ||
                                            field.get('editable') === true)
                                  });

    const fields = fieldSettings.map((field, key) => {
      if (field.get('display') === false || field.get('editable') === false) return (null);
      return (
        <div className="row" key={key}>
          <div className="col-md-3">
            <label>{_.capitalize(field.get('field_name'))}</label>
            <Field id={field.get('field_name')}
                   onChange={onChange}
                   required={field.get('mandatory')} />
          </div>
        </div>
      );
    });

    return (
      <div>
        { fields }
        <div className="row">
          <div className="col-md-3">
            <label>Plan</label>
            <select id="plan" className="form-control" defaultValue="-1" onChange={onChange}>
              { available_plans }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3" style={{marginTop: 15}}>
            <RaisedButton
                label={'Save'}
                primary={true}
                onTouchTap={onSave}
            />
            <FlatButton
                label="Cancel"
                onTouchTap={onCancel}
                style={{marginRight: 12}}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {plans: state.plans};
}

export default connect(mapStateToProps)(New);
