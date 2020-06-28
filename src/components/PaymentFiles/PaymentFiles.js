import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';

const PaymentFiles = ({ data, onChange }) => (
  <p>PaymentFiles</p>
);
  
PaymentFiles.propTypes = {
  data: PropTypes.instanceOf(Immutable.List),
};

PaymentFiles.defaultProps = {
  data: Immutable.List(),
};

export default PaymentFiles;
