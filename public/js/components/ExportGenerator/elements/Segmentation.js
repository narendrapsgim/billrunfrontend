import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Panel, Button} from 'react-bootstrap';
import {setSegmentation, addSegmentation, deleteSegmentation} from '../../../actions/exportGeneratorActions';
import Help from '../../Help';
import Segments from './Segments';

class Segmentation extends Component {
  /*static propTypes = {
   stepIndex: PropTypes.number.isRequired
   };*/
  constructor(props) {
    super(props);
    this.onSelectField = this.onSelectField.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onSelectField(index, key, value) {
    this.props.setSegmentation(index, key, value);
  }

  onDelete(index) {
    this.props.deleteSegmentation(index);
  }

  render() {
    const { fields } = this.props;
    const options =
      fields.map((val, key) => ({value: val, label: val})).toJS();

    return (
      <div className="Segmentation">
        Please add segments filters for Export generator.
        <br/>
        <br/>
        <Panel header={<h3>Segments <Help contents="Each Segment should has a field and ranges value" /></h3>}>
          <div className="form-group row form-inner-edit-row">
            <div className="col-lg-6"><label htmlFor="date_field">Field</label></div>
            <div className="col-lg-2"><label htmlFor="date_field">From</label></div>
            <div className="col-lg-2"><label htmlFor="date_field">To</label></div>
          </div>
          {
	    this.props.segments.toArray().map((entity, index) => (
              <Segments options={options} index={index} segment={entity} onSelectField={this.onSelectField} onDelete={this.onDelete} key={index}/>
            ))
	  }
          <a onClick={this.props.addSegmentation}  className="btn-link">
            <i className="fa fa-plus"></i>&nbsp;Add Segment
	  </a>
        </Panel>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSegmentation,
    addSegmentation,
    deleteSegmentation
  }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    fields:   state.exportGenerator.getIn(['inputProcess', 'parser', 'structure']), //.toObject(),
    segments: state.exportGenerator.get('segments')
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Segmentation);

