import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Col, Label } from 'react-bootstrap';


const StepResult = (props) => {
  const { item } = props;
  const result = item.get('result', []) || [];

  const renderResult = () => {
    // No resolts -> no imports
    if (result.length === 0) {
      return (<Label bsStyle="default">No records was imported</Label>);
    }
    const allSuccess = result.every(status => status === true);
    if (allSuccess) {
      return (<Label bsStyle="success">All records was successfully imported</Label>);
    }
    const allFails = result.every(status => status !== true);
    const style = { maxHeight: 150, width: '100%' };
    return (
      <div>
        {!allFails &&
          <p>Please remove successfully imported rows from file, fix errors and try again.</p>
        }
        <ol className="scrollbox" style={style}>
          { result.map((status, key) => {
            const error = status !== true;
            const label = error ? status : 'Success';
            const bsStyle = error ? 'danger' : 'success';
            return (
              <li key={key}>
                <Label bsStyle={bsStyle}>{label}</Label>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  return (
    <Col md={12} className="StepResult">
      <h4>Import status</h4>
      <hr />
      <div>
        {renderResult()}
      </div>
    </Col>
  );
};

StepResult.defaultProps = {
  item: Immutable.Map(),
};

StepResult.propTypes = {
  item: PropTypes.instanceOf(Immutable.Map),
};

export default StepResult;
