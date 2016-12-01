import React, { Component } from 'react';
import { connect } from 'react-redux';

export default connect()(class CSVFields extends Component {
  constructor(props) {
    super(props);
  }

  removeField = () => {
    const { onRemoveField, index } = this.props;
    onRemoveField(index);
  };

  onMoveFieldUp = () => {
    const { onMoveFieldUp, index } = this.props;
    onMoveFieldUp(index);
  };

  onMoveFieldDown = () => {
    const { onMoveFieldDown, index } = this.props;
    onMoveFieldDown(index);
  };

  onChange = (e) => {
    const { onChange, index } = this.props;
    const { value } = e.target;
    onChange(index, value);
  };
  
  render() {
    const { field, fixed, onSetFieldWidth, disabled, width, allowMoveUp, allowMoveDown } = this.props;
    return (
      <div>
        <div className="col-lg-4 col-md-4">
          <input type="text"
                 className="form-control"
                 value={ field }
                 onChange={this.onChange} />
        </div>
        <div className="col-lg-1 col-md-1">
          { fixed ?
            <input type="number"
                   className="form-control"
                   data-field={field}
                   disabled={!fixed}
                   min="0"
                   onChange={onSetFieldWidth}
                   value={width} /> :
            null
          }
        </div> 
        <div className="col-lg-5 col-md-5">
          <button type="button" style={{marginRight: 5}} disabled={!allowMoveUp} className="btn btn-default btn-sm" onClick={this.onMoveFieldUp}>
            <i className="fa fa-arrow-up" /> Move up
          </button>
          <button type="button" style={{marginRight: 5}} disabled={!allowMoveDown} className="btn btn-default btn-sm" onClick={this.onMoveFieldDown}>
            <i className="fa fa-arrow-down" /> Move down
          </button>
          <button type="button" className="btn btn-default btn-sm" onClick={this.removeField}>
            <i className="fa fa-trash-o danger-red" /> Remove
          </button>
        </div>
      </div>
    );
  }
});
