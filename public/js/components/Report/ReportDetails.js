import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Field from '../Field';


const ReportDetails = ({ mode, report, ...props }) => {
  console.log(report);
  const onChnageName = (e) => {
    const { value } = e.target;
    console.log(value);
    props.onChangeFieldValue(['key'], value);
  };
  return (
    <div>
      <h5>mode: {mode}</h5>
      <Field onChange={onChnageName} value={report.get('key', '')} />
    </div>
  );
};

ReportDetails.defaultProps = {
  report: Immutable.Map(),
  mode: 'create',
  onChangeFieldValue: () => {},
};

ReportDetails.propTypes = {
  report: PropTypes.instanceOf(Immutable.Map),
  onChangeFieldValue: React.PropTypes.func,
  mode: React.PropTypes.string,
};

export default ReportDetails;
