import React, { Component } from 'react';
import { Link } from 'react-router';

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

        <div className="row" style={{marginBottom: 15}}>
          <div className="col-lg-6">
            <Link to={`/usage?base={"aid": ${customer.get('aid')}}`}>
              <button type="button" role="button" className="btn btn-outline btn-default" style={{marginRight: 10}}>
                Usage
              </button>
            </Link>
            <Link to={`/invoices?base={"aid": ${customer.get('aid')}}`}>
              <button type="button" role="button" className="btn btn-outline btn-default">
                Invoices
              </button>
            </Link>
          </div>
        </div>

      </div>
    );
  }
}
