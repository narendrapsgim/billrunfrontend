import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import Immutable from 'immutable';
import { EntityFields } from '@/components/Entity';


const GeneratePaymentFileForm = ({
  item,
  errors,
  onChange,
}) => (
    <Form horizontal>
			<EntityFields
							entityName="payments"
							entity={item.get('values', Immutable.Map())}
							fields={item.get('fields', Immutable.List())}
							onChangeField={onChange}
						/>
		</Form>
);

GeneratePaymentFileForm.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  onChange: PropTypes.func.isRequired,
};

GeneratePaymentFileForm.defaultProps = {
  item: Immutable.Map(),
};

export default GeneratePaymentFileForm;
