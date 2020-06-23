import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Form} from 'react-bootstrap';
import { EntityFields } from '@/components/Entity';


class GeneratePaymentFile extends Component {

  static propTypes = {
    fields: PropTypes.instanceOf(Immutable.Map),
		values: PropTypes.instanceOf(Immutable.Map),
		onGenerate: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: Immutable.Map(),
		values: Immutable.Map()///need to be map of array of field_name
  }
	
	constructor (props){
		super(props);
		const {values} = props;
		this.state = {
			generateValues: values
		}
	}
	
	generate = (value) => {
		this.generate(value);
	}
	
	onChange = (path, value) => {
		const newValue = this.state.generateValues.set(...path, value);
		this.setState({
      generateValues: newValue
    });
	}
	
  render() {
		const {fields, onChange} = this.props;
		const {generateValues} = this.state;
		return(
			<Form horizontal>
			 <EntityFields
				 entityName="payments"
				 entity={generateValues}
				 fields={fields}
				 onChangeField={this.onChange}
			 />

		 </Form>
		);
	}

}

export default GeneratePaymentFile;
