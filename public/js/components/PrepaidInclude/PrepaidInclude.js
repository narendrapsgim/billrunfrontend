import React from 'react';
import { connect } from 'react-redux';
import { Row,
	 Col,
	 Form,
	 Panel,
	 Button,
	 FormGroup,
	 ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import UsagetypeSelect from '../Plan/components/UsagetypeSelect';
import Field from '../Field';

const PrepaidInclude = (props) => {
  const onSelectChargingBy = (value) => {
    props.onChangeField({target: {id: 'charging_by', value}});
  };

  const onSelectUsageType = (value) => {
    props.onChangeField({target: {id: 'charging_by_usaget', value}});
  };

  return (
    <div className="PrepaidInclude">
      <Panel>
        <Form horizontal>
	  <FormGroup>
	    <Col lg={2} md={2} componentClass={ ControlLabel }>
	      Name
	    </Col>
	    <Col lg={7} md={7}>
	      <Field id="name"
		     value={ props.prepaidInclude.get('name', '') }
		     onChange={ props.onChangeField } />
	    </Col>
	  </FormGroup>
	  <FormGroup>
	    <Col lg={2} md={2} componentClass={ ControlLabel }>
	      External ID
	    </Col>
	    <Col lg={7} md={7}>
	      <Field id="external_id"
		     value={ props.prepaidInclude.get('external_id', 0) }
		     onChange={ props.onChangeField }			   
		     fieldType="number" />
	    </Col>
	  </FormGroup>
	  <FormGroup>
	    <Col lg={2} md={2} componentClass={ ControlLabel }>
	      Priority
	    </Col>
	    <Col lg={7} md={7}>
	      <Field id="priority"
		     value={ props.prepaidInclude.get('priority', 0) }
		     onChange={ props.onChangeField }
		     fieldType="number" />
	    </Col>
	  </FormGroup>
	  <FormGroup>
	    <Col lg={2} md={2} componentClass={ ControlLabel }>
	      Charging by
	    </Col>
	    <Col lg={7} md={7}>
              <Select inputProps={{ id: "charging_by" }}
                      name="charging_by"
                      value={props.prepaidInclude.get('charging_by', '')}
                      options={ props.chargingByOptions }
                      onChange={ onSelectChargingBy }/>
	    </Col>
	  </FormGroup>
	  <FormGroup>
	    <Col lg={2} md={2} componentClass={ ControlLabel }>
	      Usage type
	    </Col>
	    <Col lg={7} md={7}>
              <UsagetypeSelect
                  onChangeUsageType={ onSelectUsageType }
                  value={ props.prepaidInclude.get('charging_by_usaget', '') }
              />
	    </Col>
	  </FormGroup>
        </Form>
      </Panel>	  
    </div>
  );
};

export default connect()(PrepaidInclude);
