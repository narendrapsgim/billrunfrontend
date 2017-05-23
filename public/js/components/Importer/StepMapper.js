import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col, Label } from 'react-bootstrap';
import { parseCsvHeadres } from '../../common/Util';
import MapField from './MapField';


const StepMapper = (props) => {
  const { item, fields } = props;
  const delimiter = item.get('fileDelimiter', '');
  const mappedFields = item.get('map', Immutable.List());
  const fileContent = item.get('fileContent', '');
  if (fileContent.length === 0) {
    return (<Label bsStyle="default">Please upload file.</Label>);
  }

  const headers = parseCsvHeadres(fileContent, delimiter);
  if (headers.length === 0) {
    return (<Label bsStyle="default">No CSV headers was found, please check imported file.</Label>);
  }

  return (
    <Col md={12} className="StepMapper">
      { headers.map((header, key) => (
        <MapField
          key={`header_${key}_${header}`}
          index={key}
          mapFrom={header}
          mappedTo={item.getIn(['map', key], '')}
          options={fields}
          usedOptions={mappedFields}
          onChange={props.onChange}
        />
      )) }
    </Col>
  );
};

StepMapper.defaultProps = {
  item: Immutable.Map(),
  fields: [],
  onChange: () => {},
};

StepMapper.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  fields: PropTypes.array,
  onChange: PropTypes.func,
};

export default StepMapper;
