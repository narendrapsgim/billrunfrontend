import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map } from 'immutable';

import { getEntity, updateEntityField, clearEntity } from '../../actions/entityActions';

import { Button } from 'react-bootstrap';
import PrepaidInclude from './PrepaidInclude';

class PrepaidIncludeSetup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { pp_id } = location.query;
    if (pp_id) {
      const params = {
	api: 'find',
	params: [
	  { collection: 'prepaidincludes' },
	  { query: JSON.stringify({_id: pp_id}) }
	]
      };
      dispatch(getEntity('prepaid_include', params));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearEntity('prepaid_include'));
  }
  
  onChangeField = (e) => {
    const { id, value } = e.target;
    this.props.dispatch(updateEntityField('prepaid_include', id, value));
  };

  handleSave = () => {
    console.log('save entity', this.props.prepaid_include.toJS());
  };

  handleCancel = () => {
    this.props.router.push('/prepaid_includes');
  };

  render() {
    const charging_by_options = [
      { value: 'usagev', label: 'Usage volume' },
      { value: 'cost', label: 'Cost' },
      { value: 'total_cost', label: 'Total cost' }
    ];

    return (
      <div className="PrepaidIncludeSetup">
        <PrepaidInclude prepaidInclude={ this.props.prepaid_include }
                        onChangeField={ this.onChangeField }
                        onChangeSelectField={ this.onChangeSelectField }
                        chargingByOptions={ charging_by_options } />
	<div style={{ marginTop: 12 }}>
          <Button onClick={ this.handleSave }
		  bsStyle="primary"
		  style={{ marginRight: 10 }}>
	    Save
	  </Button>
          <Button onClick={ this.handleCancel }
		  bsStyle="default">
	    Cancel
	  </Button>
	</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    prepaid_include: state.entity.get('prepaid_include', Map())
  };
}

export default withRouter(connect(mapStateToProps)(PrepaidIncludeSetup));
