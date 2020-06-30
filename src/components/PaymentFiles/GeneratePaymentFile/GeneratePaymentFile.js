import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { CreateButton } from '@/components/Elements';

const GeneratePaymentFile = ({ data, onGenerate, onClick, disabled }) => (
  <CreateButton
    onClick={onClick}
    buttonStyle={{}}
    action=""
    label="Generate Payment File"
    disabled={disabled}
  />
);

GeneratePaymentFile.propTypes = {
  data: PropTypes.instanceOf(List),
  disabled: PropTypes.bool,
  onGenerate: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

GeneratePaymentFile.defaultProps = {
  data: List,
  disabled: false,
};

export default GeneratePaymentFile;
