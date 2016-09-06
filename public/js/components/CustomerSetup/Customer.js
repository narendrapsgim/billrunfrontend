import React, { Component } from 'react';

export default class Customer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { customer, onChange, settings } = this.props;

    const fields = settings.filter(field => {
                              return field.get('display') !== false &&
                                     field.get('editable') !== false;
                            }).
                            map((setting, key) => (
                              <div className="form-group" key={key}>
                                <label>{setting.get('field_name')}</label>
                                <input className="form-control"
                                       id={setting.get('field_name')}
                                       onChange={ onChange }
                                       value={ customer.get(setting.get('field_name')) } />
                              </div>
                            ));

    return (
      <div>

        <div className="row">
          <div className="col-lg-6">
            <form>
              { fields }
            </form>
          </div>
        </div>

      </div>
    );
  }
}
