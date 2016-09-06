import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

export default class Date extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { id, onChange, value, editable } = this.props;

    const input = editable ? ( <DatePicker id={id}
                                           fullWidth={true}
                                           hintText={id}
                                           textFieldStyle={{height: "72px"}}
                                           value={value}
                                           onChange={onChange}
                                           disabled={disabled}
                               />
                             ) : (<span>{moment(value).format(globalSetting.datetimeFormat)}</span>);

    return (
      <div>{ input }</div>
    );
  }
}
