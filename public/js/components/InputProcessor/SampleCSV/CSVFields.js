import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import CSVField from './CSVField';


const CSVFields = (props) => {
  const { settings } = props;
  const fixed = settings.get('delimiter_type', '') === 'fixed';
  const fields = settings.get('fields', Immutable.List()).map((field, index) => (
    <div key={index}>
      <div className="form-group">
        <CSVField
          index={index}
          onRemoveField={props.onRemoveField}
          field={field}
          onSetFieldWidth={props.onSetFieldWidth}
          fixed={fixed}
          allowMoveUp={index !== 0}
          allowMoveDown={index !== settings.get('fields', Immutable.List()).size - 1}
          onMoveFieldDown={props.onMoveFieldDown}
          onMoveFieldUp={props.onMoveFieldUp}
          onChange={props.onChangeCSVField}
          width={settings.getIn(['field_widths', index], '')}
        />
      </div>
      <div className="separator" />
    </div>
  ));
  return (
    <div>{fields}</div>
  );
};

CSVFields.defaultProps = {
  settings: Immutable.Map(),
  onRemoveField: () => {},
  onSetFieldWidth: () => {},
  onMoveFieldUp: () => {},
  onMoveFieldDown: () => {},
  onChangeCSVField: () => {},
};

CSVFields.propTypes = {
  settings: PropTypes.instanceOf(Immutable.Map),
  onRemoveField: PropTypes.func,
  onSetFieldWidth: PropTypes.func,
  onMoveFieldUp: PropTypes.func,
  onMoveFieldDown: PropTypes.func,
  onChangeCSVField: PropTypes.func,
};

export default connect()(CSVFields);
