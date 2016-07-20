import React, { Component } from 'react';
import Field from '../Field';
import { connect } from 'react-redux';
import { getPlans } from '../../actions/plansActions';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Typeahead from 'react-bootstrap-typeahead';
import Immutable from 'immutable';

class New extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getPlans({}));
  }
  
  render() {
    const { settings, onChange, plans, aid, onSave, onCancel, onChangeTypeaheadField } = this.props;
    if (!settings || settings.size === 0) return (<div></div>);

    const available_plans = plans.map((plan, key) => {
      return Immutable.fromJS({
        id: plan.get('name'),
        name: plan.get('name')
      });
    }).toJS();

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
      {(() => {
        if (aid) {
          return (
            <div className="row">
              <div className="col-md-3">
                <label>Plan</label>
                <Typeahead options={available_plans}
                           labelKey="name"
                           maxHeight={150}
                           onChange={onChangeTypeaheadField.bind(this, "plan")} />
              </div>
            </div>
          );
        }})()}
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
