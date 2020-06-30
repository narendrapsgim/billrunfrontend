import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { Map, List } from 'immutable';
import { EntityFields } from '@/components/Entity';

const GeneratePaymentFileForm = ({ item, errors, onChange }) => {
  if (item.get('fields', List()).isEmpty()) {
    return 'No additional data required to generate file';
  }
  return (
    <Form horizontal>
      <EntityFields
        entityName="payments"
        entity={item.get('values', Map())}
        errors={errors}
        fields={item.get('fields', List())}
        onChangeField={onChange}
      />
    </Form>
  );
}

GeneratePaymentFileForm.propTypes = {
  item: PropTypes.instanceOf(Map),
  onChange: PropTypes.func.isRequired,
};

GeneratePaymentFileForm.defaultProps = {
  item: Map(),
};

export default GeneratePaymentFileForm;
