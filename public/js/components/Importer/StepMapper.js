import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col, Label } from 'react-bootstrap';
import MapField from './MapField';


const StepMapper = (props) => {
  const { item, fields } = props;
  const fileContent = item.get('fileContent', []) || [];
  const headers = fileContent[0];

  const soptFields = (f1, f2) => {
    // Sort by : mandatory -> unique -> other by ABC
    if (f1.mandatory && !f2.mandatory) {
      return -1;
    }
    if (!f1.mandatory && f2.mandatory) {
      return 1;
    }
    if (f1.unique && !f2.unique) {
      return -1;
    }
    if (!f1.unique && f2.unique) {
      return 1;
    }
    return f1.label > f2.label ? 1 : -1;
  };

  const renderFields = () => fields
    .filter(option => !option.generated)
    .sort(soptFields)
    .map(field => (
      <MapField
        key={`header_${field.value}`}
        mapFrom={field}
        mappedTo={item.getIn(['map', field.value], '')}
        options={headers}
        onChange={props.onChange}
        onDelete={props.onDelete}
      />
  ));

  const renderContent = () => {
    if (fileContent.length === 0) {
      return (<Label bsStyle="default">Please upload file.</Label>);
    }
    if (headers.length === 0) {
      return (<Label bsStyle="default">No CSV headers was found, please check your file.</Label>);
    }
    return renderFields();
  };

  return (
    <Col md={12} className="StepMapper scrollbox">
      {renderContent()}
    </Col>
  );
};

StepMapper.defaultProps = {
  item: Immutable.Map(),
  fields: [],
  onChange: () => {},
  onDelete: () => {},
};

StepMapper.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  fields: PropTypes.array,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StepMapper;
