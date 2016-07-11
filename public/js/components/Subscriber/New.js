import React, { Component } from 'react';
import Field from '../Field';

export default class New extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings, onChange } = this.props;
    if (!settings) return (<div></div>);

    const fields = settings.getIn(['account', 'fields']).map((field, key) => (
      <div className="row" key={key}>
        <div className="col-md-3">
          <label>{field.get('field_name')}</label>
          <Field id={field.get('field_name')}
                 onChange={onChange}
                 required={field.get('mandatory')} />
        </div>
      </div>
    ));

    return (
      <div>
        { fields }
      </div>
    );
  }
}
