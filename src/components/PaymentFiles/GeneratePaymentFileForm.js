import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import Immutable from 'immutable';
import { EntityFields } from '@/components/Entity';


const GeneratePaymentFileForm = ({
  data,
  errors,
  onChange,
	values
}) => (
    <Form horizontal>
			<EntityFields
				entityName="payments"
				entity={values}
				errors={errors}
				fields={data}
				onChangeField={onChange}
			/>
		</Form>
);

GeneratePaymentFileForm.propTypes = {
  data: PropTypes.instanceOf(Immutable.List),
	values: PropTypes.instanceOf(Immutable.Map),
  onChange: PropTypes.func.isRequired,
};

GeneratePaymentFileForm.defaultProps = {
  data: Immutable.List(),
	values: Immutable.Map()
};

export default GeneratePaymentFileForm;
