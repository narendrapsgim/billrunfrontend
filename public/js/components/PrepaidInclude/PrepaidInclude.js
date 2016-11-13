import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Map } from 'immutable';

import { getEntity, updateEntityField, clearEntity } from '../../actions/entityActions';

import { Row,
	 Col,
	 Form,
	 Panel,
	 Button,
	 FormGroup,
	 ControlLabel } from 'react-bootstrap';
import Field from '../Field';

class PrepaidInclude extends React.Component {
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
    console.log('save entity', this.props.prepaid_include);
  };

  handleCancel = () => {
    this.props.router.push('/prepaid_includes');
  };
  
  render() {
    const { prepaid_include } = this.props;

    return (
      <div className="PrepaidInclude">
	<Col lg={12}>
	  <Form>
	    <Panel>
	      <Row>
		<Col lg={6} md={6}>
		  <FormGroup>
		    <ControlLabel>Name</ControlLabel>
		    <Field id="name"
			   value={ prepaid_include.get('name', '') }
			   onChange={ this.onChangeField }
		    />
		  </FormGroup>
		</Col>

		<Col lg={6} md={6}>
		  <FormGroup>
		    <ControlLabel>External ID</ControlLabel>
		    <Field id="external_id"
			   value={ prepaid_include.get('external_id', 0) }
			   onChange={ this.onChangeField }			   
			   fieldType="number" />
		  </FormGroup>
		</Col>
	      </Row>
	      <Row>
		<Col lg={6} md={6}>
		  <FormGroup>
		    <ControlLabel>Priority</ControlLabel>
		    <Field id="priority"
			   value={ prepaid_include.get('priority', 0) }
			   onChange={ this.onChangeField }
			   fieldType="number" />
		  </FormGroup>
		</Col>
	      </Row>
	    </Panel>

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

	  </Form>
	</Col>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    prepaid_include: state.entity.get('prepaid_include', Map())
  };
}

export default withRouter(connect(mapStateToProps)(PrepaidInclude));
