import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Form} from 'react-bootstrap';
import { EntityFields } from '@/components/Entity';
import { CreateButton, ModalWrapper } from '@/components/Elements';

class GeneratePaymentFile extends Component {

  static propTypes = {
    fields: PropTypes.instanceOf(Immutable.Map),
		values: PropTypes.instanceOf(Immutable.Map),
		onGenerate: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: Immutable.Map(),
		values: Immutable.Map()
  }
	
	constructor (props){
		super(props);
		const {values} = props;
		this.state = {
			generateValues: values,
			showPopUp: false
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
	
	onButtonClick = () => {
		this.setState({
      showPopUp: true
    });
	}
	
	onHidePopUP = () => {
		this.setState({
      showPopUp: false
    });
		this.cleanGenerateValues();
	}
	
	cleanGenerateValues = () =>{
		this.setState({
      generateValues: Immutable.Map()
    });
	}
	
	onSubmit = () =>{
		this.setState({
      showPopUp: false
    });
		this.props.onGenerate(this.state.generateValues);
		this.cleanGenerateValues();
	}
	
	
	
	renderGeneratePaymentFile = () => {
		const {showPopUp, generateValues} = this.state;
		const {fields, onChange} = this.props;
		const title = 'Generate Payment File';
		return (
				<ModalWrapper title={title} show={showPopUp} onCancel={this.onHidePopUP} onOk={this.onSubmit} onHide={this.onHidePopUP} labelOk="Save" labelCancel="Close">
					<Form horizontal>
						<EntityFields
							entityName="payments"
							entity={generateValues}
							fields={fields}
							onChangeField={this.onChange}
						/>
					</Form>
				</ModalWrapper>
		)
	}
	
  render() {
		return(
				<div>
				<CreateButton
                buttonStyle={{}}
                onClick={this.onButtonClick}
                action="Add"
                label=""
                type="Payment File"
              />
			{ this.renderGeneratePaymentFile() }
			</div>
		)
	}
}

export default GeneratePaymentFile;
