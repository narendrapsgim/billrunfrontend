import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import Select from 'react-select';
import {setSegmentation} from '../../../actions/exportGeneratorActions';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSegmentation
  }, dispatch);
}
// segments: state.exportGenerator.get('segments')
function mapStateToProps(state, props) {
  return {
  };
}

class Segments extends Component {
  static propTypes = {
    segmentKey: React.PropTypes.string,
    onSelectField: React.PropTypes.func.isRequired
   };

  constructor(props) {
    super(props);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.state = {segmentKey: this.props.segmentKey, from: null, to: null }
  }
/*
  componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate', nextProps, nextState);
  }

  componentDidUpdate(nextProps, nextState) {
    console.log('componentDidUpdate', nextProps, nextState);
  }*/

  onFieldChange(val) {
    console.log("Selected: " + val);
    if (this.state.segmentKey !== val) {
      let oldKey = this.state.segmentKey;
      this.setState({segmentKey: val})
      this.props.onSelectField(val, {from: this.state.from, to: this.state.to}, oldKey);
    }
  }

  onValueChange(event) {
    let newStateKey = {};
    newStateKey[event.target.name] = event.target.value;
    this.setState(newStateKey);

    this.props.onSelectField(this.state.segmentKey, {from: this.state.from, to: this.state.to});
  }

  render() {

    return (
      <div className="form-group">
        <div className="col-lg-6">
          <Select
            name="field-name"
            value={this.state.segmentKey}
            options={this.props.options}
            onChange={this.onFieldChange}
          />
        </div>

        <div className="col-lg-2">
          <input name="from" className="form-control" onChange={this.onValueChange} disabled={!this.state.segmentKey} />
        </div>

        <div className="col-lg-2">
          <input name="to" className="form-control" onChange={this.onValueChange} disabled={!this.state.segmentKey} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Segments);

