import React, { Component } from 'react';

export default class CSVFields extends Component {
  constructor(props) {
    super(props);
  }

  removeField = () => {
    const { onRemoveField, index } = this.props;
    onRemoveField(index);
  };
  
  render() {
    const { field, fixed, onSetFieldWidth, disabled, width } = this.props;
    return (
      <div className="form-group">
        <div className="col-lg-3">
          <button type="button"
                  className="btn btn-danger btn-circle"
                  disabled={disabled}                                      
                  onClick={this.removeField}>
            <i className="fa fa-minus" />
          </button>
          { field }
        </div>
        { fixed ?
          <div className="col-lg-2">
            <input type="number"
                   className="form-control"
                   data-field={field}
                   style={{width: 70}}
                   onChange={onSetFieldWidth}
                   value={width} />
          </div> :
          null
        }
      </div>
    );
  }
}
