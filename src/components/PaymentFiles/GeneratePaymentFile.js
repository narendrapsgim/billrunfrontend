import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { CreateButton, Actions } from '@/components/Elements';
const GeneratePaymentFile = ({
  data,
	onGenerate,
	onClick
}) => {
  return (
		 <CreateButton
                buttonStyle={{}}
                onClick={onClick}
                action="Generate"
                label=""
                type="Payment File"
		/>
  );
};

GeneratePaymentFile.propTypes = {
  data: PropTypes.instanceOf(Immutable.List),
  onGenerate: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired,
};

GeneratePaymentFile.defaultProps = {
  data: Immutable.List,
};

export default GeneratePaymentFile;
