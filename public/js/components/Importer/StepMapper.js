import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col } from 'react-bootstrap';
import { parseCsvHeadres } from '../../common/Util';


const StepMapper = (props) => {
  const { item } = props;
  const delimiter = item.get('fileDelimiter', '');
  const fileContent = item.get('fileContent', '');
  const headers = parseCsvHeadres(fileContent, delimiter);

  return (
    <Col md={12} className="StepMapper">
      <ul>
        {headers.map(header => (<li key={`header_${header}`}>{header}</li>))}
      </ul>
    </Col>
  );
};

StepMapper.defaultProps = {
  item: Immutable.Map(),
  onChange: () => {},
  onDelete: () => {},
};

StepMapper.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StepMapper;
