import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker';

export default class Date extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { id, onChange, value } = this.props;

    return (
      <DatePicker id={id}
                  fullWidth={true}                            
                  hintText={id}
                  textFieldStyle={{height: "72px"}}
                  value={value}
                  onChange={onChange}
      />
    );
  }
}
