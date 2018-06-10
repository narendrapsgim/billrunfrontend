import React, { Component } from 'react';
import moment from 'moment-timezone';
import Immutable from 'immutable';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';

export default class DateTime extends Component {

  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    data: React.PropTypes.instanceOf(Immutable.Map),
  };

  onChange = (e) => {
    const { id, value } = e.target;
    this.props.onChange('billrun', id, value);
  }

  renderOption = (value, key) => <option value={value} key={key}>{value}</option>;

  render() {
    const { data } = this.props;

    // const dateFormatOptions = ['dd-mm-yy', 'mm-dd-yy'].map(this.renderOption);
    // const timeFormatOptions = ['12-hour', '24-hour'].map(this.renderOption);
    const timeZoneOptions = moment.tz.names().map(this.renderOption);
    const timezone = data.get('timezone_field', '').length !== 0 ? data.get('timezone_field', '') : moment.tz.guess();

    return (
      <div className="DateTime">
        <Form horizontal>
          <FormGroup controlId="timezone" key="timezone">
            <Col componentClass={ControlLabel} md={2}>
              Time Zone
            </Col>
            <Col sm={6}>
              <select id="timezone" name="timezone" value={timezone} onChange={this.onChange} className="form-control">
                { timeZoneOptions }
              </select>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
