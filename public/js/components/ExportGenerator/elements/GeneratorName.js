import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setGeneratorName} from '../../../actions/exportGeneratorActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setGeneratorName
  }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    name: state.exportGenerator.get('name')
  };
}

class GeneratorName extends Component {
  /*static propTypes = {
   stepIndex: PropTypes.number.isRequired
   };*/
  constructor(props) {
    super(props);

    this.onNameChange = this.onNameChange.bind(this);
  }
  onNameChange (event) {
    console.log(arguments);

    this.props.setGeneratorName(event.target.value)
  }

  render() {
    return (
      <div className="form-group">
        <div className="col-lg-3">
          <label htmlFor="file_type">Name</label>
        </div>
        <div className="col-lg-9">
          <div className="col-lg-1" style={{marginTop: 8}}>
            <i className="fa fa-long-arrow-right"></i>
          </div>
          <div className="col-lg-7">
            <input id="file_type" className="form-control" onChange={this.onNameChange} value={this.props.name} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneratorName);
