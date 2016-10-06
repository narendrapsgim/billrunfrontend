import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Panel, Button} from 'react-bootstrap';
import {setSegmentation, addSegmentation, deleteSegmentation} from '../../../actions/exportGeneratorActions';
import Help from '../../Help';
import Segments from './Segments';


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSegmentation,
    addSegmentation,
    deleteSegmentation
  }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    fields: state.exportGenerator.get('inputProcess').get('parser').get('structure').toObject(),
    segments: state.exportGenerator.get('segments')
  };
}

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
    let options = [];
    _.forEach(this.props.fields, function (value, key) {
      options.push({value: key, label: key});
    });

    return (
      <div>
        Please add segments filters for Export generator.
        <br/>
        <br/>
        <Panel header={<h3>Segments <Help contents="Each Segment should has a field and ranges value"/>
          <Button onClick={this.props.addSegmentation} bsSize="xsmall" className="pull-right">
            <i className="fa fa-plus"></i> Add</Button>
        </h3>}>
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

          {this.props.segments.toArray().map((entity, index) => (
            <div key={index}>
              <Segments options={options} index={index} segment={entity} onSelectField={this.onSelectField} onDelete={this.onDelete}/>
            </div>
          ))
          }
        </Panel>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Segmentation);

