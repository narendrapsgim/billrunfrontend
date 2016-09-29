import React, { Component } from 'react';

/* COMPONENTS */
import CSVField from './CSVField';

export default class CSVFields extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings, onRemoveField, onSetFieldWidth } = this.props;
    const fixed = settings.get('delimiter_type', '') === "fixed";

    return (
      <div>
        {
          settings.get('fields', []).map((field, key) => (
            <CSVField key={key} index={key}
                      onRemoveField={onRemoveField}
                      field={field}
                      onSetFieldWidth={onSetFieldWidth}
                      fixed={fixed}
                      disabled={!settings.get('file_type')}
                      width={settings.getIn(['field_widths', field])} />
          ))
        }
      </div>
    );
  }
}
