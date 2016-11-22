import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import Select from 'react-select';

class Segments extends Component {
  static propTypes = {
    index: React.PropTypes.number.isRequired,
    segment: React.PropTypes.object.isRequired,
    onSelectField: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onDeleteLine = this.onDeleteLine.bind(this);
  }

  onFieldChange(val) {
    this.props.onSelectField(this.props.index, 'field', val);
  }

  onValueChange(event) {
    this.props.onSelectField(this.props.index, event.target.name, event.target.value);
  }

  onDeleteLine() {
    this.props.onDelete(this.props.index);
  }

  render() {
    return (
      <div className="form-group row form-inner-edit-row">
        <div className="col-lg-6">
          <Select
              name="field-name"
              value={this.props.segment.get('field', '')}
              options={this.props.options}
              onChange={this.onFieldChange}
              Clearable={false}
          />
        </div>

        <div className="col-lg-2">
          <input name="from" className="form-control" onChange={this.onValueChange}
                 value={this.props.segment.get('from', '')}
                 disabled={!this.props.segment.get('field')}/>
        </div>

        <div className="col-lg-2">
          <input name="to" className="form-control" onChange={this.onValueChange}
                 value={this.props.segment.get('to', '')}
                 disabled={!this.props.segment.get('field')}/>
        </div>

        <div className="col-lg-2" style={{padding: '2px 5px'}}>
          <Button onClick={this.onDeleteLine} bsSize="small"><i className="fa fa-trash-o danger-red"/>
            &nbsp;Remove</Button>
        </div>
      </div>
    )
  }
}

export default Segments;

