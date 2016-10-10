import React, {Component} from 'react';
import {Link} from 'react-router';
import Select from 'react-select';
import countries from './countries.data.json';

export default class Customer extends Component {
  constructor(props) {
    super(props);

    this.onCountryChange = this.onCountryChange.bind(this);
  }

  onCountryChange(val) {
    var pseudoE = {};
    pseudoE.target = {id: 'country', value: val};
    this.props.onChange(pseudoE);
  }

  render() {
    const {customer, onChange, settings, action} = this.props;

    let options = [];
    countries.forEach((country) => {
      options.push({value: country.name, label: country.name})
    });

    return (
      <div>
        <div className="row">
          <div className="col-lg-6">
            <form className="form-horizontal">

              <div className="form-group">
                <label htmlFor="firstname" className="col-md-3 control-label">First Name</label>
                <div className="col-md-9">
                  <input className="form-control"
                         type="text"
                         key="firstname"
                         id="firstname"
                         name="firstname"
                         onChange={ onChange }
                         value={customer.get('firstname', '')}/>

                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastname" className="col-md-3 control-label">Last Name</label>
                <div className="col-md-9">
                  <input className="form-control"
                         type="text"
                         key="lastname"
                         id="lastname"
                         name="lastname"
                         onChange={ onChange }
                         value={ customer.get('lastname', '') }/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="col-md-3 control-label">email</label>
                <div className="col-md-9">
                  <input className="form-control"
                         type="email"
                         key="email"
                         id="email"
                         name="email"
                         onChange={ onChange }
                         value={ customer.get('email', '') }/>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country" className="col-md-3 control-label">Country</label>
                <div className="col-md-9">
                  <Select
                    name="country"
                    value={ customer.get('country', '') }
                    options={options}
                    onChange={this.onCountryChange}
                    Clearable={false} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country" className="col-md-3 control-label">Address</label>
                <div className="col-md-9">
                  <input className="form-control"
                         type="text"
                         key="address"
                         id="address"
                         name="address"
                         onChange={ onChange }
                         value={ customer.get('address', '') }/>
                </div>
              </div>
            </form>
          </div>
        </div>

        {(() => {
          if (action === "new") return (null);
          return (
            <div className="row" style={{marginBottom: 5}}>
              <hr />
              <div className="col-lg-6">
                see Customer <Link to={`/usage?base={"aid": ${customer.get('aid')}}`}>Usage</Link>
                <br />
                see Customer <Link to={`/invoices?base={"aid": ${customer.get('aid')}}`}>Invoices</Link>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }
}
