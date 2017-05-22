import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { HelpBlock, FormGroup, Col, Button } from 'react-bootstrap';
import Field from '../../Field';
import { getConfig } from '../../../common/Util';


const CSVField = (props) => {
  const { index, field, fixed, width, allowMoveUp, allowMoveDown } = props;
  const { errorMessages: { name: { allowedCharacters } } } = props;
  const errorFieldName = !getConfig('keyRegex', '').test(field) ? allowedCharacters : '';

  const removeField = () => {
    props.onRemoveField(index);
  };

  const onMoveFieldUp = () => {
    props.onMoveFieldUp(index);
  };

  const onMoveFieldDown = () => {
    props.onMoveFieldDown(index);
  };

  const onChange = (e) => {
    const { value } = e.target;
    props.onChange(index, value);
  };

  return (
    <Col lg={12} md={12}>
      <FormGroup className="mb0" validationState={errorFieldName.length > 0 ? 'error' : null} >
        <Col lg={4} md={4}>
          <Field onChange={onChange} value={field} />
        </Col>
        <Col lg={1} md={1}>
          { fixed &&
            <input
              type="number"
              className="form-control"
              data-field={field}
              disabled={!fixed}
              min="0"
              onChange={props.onSetFieldWidth}
              value={width}
            />
          }
        </Col>
        <Col lg={5} md={5}>
          <Button bsSize="small" disabled={!allowMoveUp} onClick={onMoveFieldUp}>
            <i className="fa fa-arrow-up" /> Move up
          </Button>
          <Button bsSize="small" className="ml10" disabled={!allowMoveDown} onClick={onMoveFieldDown}>
            <i className="fa fa-arrow-down" /> Move down
          </Button>
          <Button bsSize="small" className="ml10" onClick={removeField}>
            <i className="fa fa-trash-o danger-red" /> Remove
          </Button>
        </Col>
        { errorFieldName.length > 0 && (
          <Col lg={10} md={10}><HelpBlock>{errorFieldName}</HelpBlock></Col>
        )}
      </FormGroup>
    </Col>
  );
};

CSVField.propTypes = {
  field: PropTypes.string,
  index: PropTypes.number,
  fixed: PropTypes.bool,
  errorMessages: PropTypes.object,
  allowMoveUp: PropTypes.bool,
  allowMoveDown: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  onRemoveField: PropTypes.func,
  onMoveFieldUp: PropTypes.func,
  onSetFieldWidth: PropTypes.func,
  onMoveFieldDown: PropTypes.func,
};

CSVField.defaultProps = {
  field: '',
  index: 0,
  fixed: false,
  allowMoveUp: true,
  allowMoveDown: true,
  width: '',
  errorMessages: {
    name: {
      allowedCharacters: 'Field name contains illegal characters, name should contain only alphabets, numbers and underscores (A-Z, a-z, 0-9, _)',
    },
  },
  onChange: () => {},
  onRemoveField: () => {},
  onMoveFieldUp: () => {},
  onSetFieldWidth: () => {},
  onMoveFieldDown: () => {},
};

export default connect()(CSVField);
