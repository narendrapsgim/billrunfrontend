import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import { FormGroup, Col, ControlLabel, Form } from 'react-bootstrap';
import Field from '@/components/Field';
import { getFieldName } from '@/common/Util';

const PaymentFileDetails = ({ item }) => {
  const renderValue = (value) => {
    if (Immutable.Map.isMap(value) && value.has('sec')) {
      return (
        <Field
          fieldType="datetime"
          value={moment.unix(value.get('sec'))}
          editable={false}
        />
      );
    }
    return <Field value={value} editable={false} />;
  };

  const rows = item
    .filter((value, field_name) => !['_id'].includes(field_name))
    .map((value, field_name) => (
      <FormGroup key={`field_${field_name}`}>
        <Col componentClass={ControlLabel} sm={4} lg={3}>
          {getFieldName(field_name, 'payment_files')}:
        </Col>
        <Col sm={7} lg={8}>
          {renderValue(value)}
        </Col>
      </FormGroup>
    ))
    .toList()
    .toArray();

  return (
    <Col lg={12}>
      <Form horizontal>{rows}</Form>
    </Col>
  );
};

export default PaymentFileDetails;
