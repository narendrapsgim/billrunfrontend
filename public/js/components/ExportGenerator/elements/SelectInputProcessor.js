import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormGroup, Radio } from 'react-bootstrap';

import { getList } from '../../../actions/listActions';
import { selectInputProcessor } from '../../../actions/exportGeneratorActions';
import GeneratorName from './GeneratorName';

class SelectInputProcessor extends Component {
  /*static propTypes = {
   stepIndex: PropTypes.number.isRequired
   };*/

  constructor(props) {
    super(props);
    this.onSort = this.onSort.bind(this);
    this.buildQuery = this.buildQuery.bind(this);

    this.state = {
      sort: 'name'
    };
  }

  componentDidMount() {
    this.props.getList("input_processors", this.buildQuery());
  }

  buildQuery() {
    return {
      api: "settings",
      params: [
        { category: "file_types" },
        { sort: 'name' },
        { data: JSON.stringify({}) }
      ]
    };
  }

  onSort(sort) {
    this.setState({sort}, () => {
      this.props.dispatch(getList('input_processors', this.buildQuery()));
    });
  }

  render() {
    const { inputProcessors } = this.props;

    var handleClick = function(i, entity) {
      this.props.selectInputProcessor(entity);
      // this.props.onNext(0);
    }

    return (
      <div>
        <form className="InputProcessor form-horizontal">
          <h3>Choose Input Processor</h3>
          <GeneratorName />

          <div className="form-group">
            <div className="col-lg-3">
              <label htmlFor="file_type">Please select Input Processor</label>
            </div>
            <div className="col-lg-9">
              <FormGroup>
                {inputProcessors.map((entity, index) => (
                  <Radio name="select-input-processor" key={index} onClick={handleClick.bind(this, index, entity)}>
                    { entity.get('file_type') }
                  </Radio>
                ))}
              </FormGroup>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getList,
    selectInputProcessor }, dispatch);
}

function mapStateToProps(state, props) {
  return {
    inputProcessors: state.list.get('input_processors') || []
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectInputProcessor);
