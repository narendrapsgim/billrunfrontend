import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col } from 'react-bootstrap';
import { parseCsvHeadres } from '../../common/Util';
import MapField from './MapField';


const StepMapper = (props) => {
  const { item, fields } = props;
  const delimiter = item.get('fileDelimiter', '');
  const fileContent = item.get('fileContent', '');
  const mappedFields = item.get('map', Immutable.List());
  const headers = parseCsvHeadres(fileContent, delimiter);

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
  onDelete: () => {},
};

StepMapper.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  fields: PropTypes.array,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StepMapper;
