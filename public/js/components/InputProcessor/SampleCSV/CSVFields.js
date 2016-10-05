import React, { Component } from 'react';

/* COMPONENTS */
import CSVField from './CSVField';

export default class CSVFields extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      settings,
      onRemoveField,
      onSetFieldWidth,
      onMoveFieldUp,
      onMoveFieldDown,
      onChangeCSVField
    } = this.props;
    const fixed = settings.get('delimiter_type', '') === "fixed";

    return (
      <div>
        {
          settings.get('fields', []).map((field, key) => (
            <div key={key}>
              <div className="form-group">
                <CSVField index={key}
                          onRemoveField={onRemoveField}
                          field={field}
                          onSetFieldWidth={onSetFieldWidth}
                          fixed={fixed}
                          allowMoveUp={key !== 0}
                          allowMoveDown={key !== settings.get('fields', []).size - 1}
                          onMoveFieldDown={onMoveFieldDown}
                          onMoveFieldUp={onMoveFieldUp}
                          onChange={onChangeCSVField}
                          disabled={!settings.get('file_type')}
                          width={settings.getIn(['field_widths', field], '')} />
              </div>
              <div className="separator"></div>
            </div>
          ))
        }
      </div>
    );
  }
}
