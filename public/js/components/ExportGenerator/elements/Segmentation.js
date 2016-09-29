import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import Select from 'react-select';
import {setSegmentation} from '../../../actions/exportGeneratorActions';
import Segments from './Segments';


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSegmentation
  }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    fields: state.exportGenerator.get('inputProcess').get('parser').get('structure').toObject()
  };
}

class Segmentation extends Component {
  /*static propTypes = {
   stepIndex: PropTypes.number.isRequired
   };*/

  constructor(props) {
    super(props);
    this.onSelectField = this.onSelectField.bind(this);

  }

  onSelectField(segment, values, oldSegmen) {
    console.log("Selected: " , segment, values, oldSegmen);
    this.props.setSegmentation(segment, values, oldSegmen);
  }

  render() {
    let options = [];
    _.forEach(this.props.fields, function (value, key) {
      options.push({value: key, label: key});
    });

    return (
      <div>
        <h3>Set segmentation </h3>
        Please add segments filters for Export generator
        <hr />
        <div className="form-group">
          <div className="col-lg-6">
            <label htmlFor="date_field">Field</label>
          </div>
          <div className="col-lg-2">
            <label htmlFor="date_field">From</label>
          </div>
          <div className="col-lg-2">
            <label htmlFor="date_field">To</label>
          </div>
        </div>

        <Segments options={options} segementKey={null} onSelectField={this.onSelectField}  />

        </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Segmentation);

