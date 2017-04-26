import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Select from 'react-select';
import { getCyclesQuery } from '../../common/ApiQueries';
import { getList, clearList } from '../../actions/listActions';
import { getCycleName } from './CycleUtil';

class CyclesSelector extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cycles: PropTypes.instanceOf(List),
    selectedCycles: PropTypes.string,
    statusesToDisplay: PropTypes.instanceOf(List),
    onChange: PropTypes.func,
    id: PropTypes.string,
    multi: PropTypes.bool,
  };

  static defaultProps = {
    cycles: List(),
    selectedCycles: '',
    statusesToDisplay: List(['current', 'future', 'running', 'to_run', 'finished', 'confirmed']),
    onChange: () => {},
    id: 'cycle',
    multi: false,
  };

  componentDidMount() {
    this.props.dispatch(getList('cycles_list', getCyclesQuery()));
  }

  componentWillUnmount() {
    this.props.dispatch(clearList('cycles_list'));
  }

  getCyclesSelectOptions = () => {
    const { cycles, statusesToDisplay } = this.props;
    return cycles
      .filter(cycle => statusesToDisplay.contains(cycle.get('cycle_status', '')))
      .map(cycle => ({
        value: cycle.get('billrun_key', ''),
        label: getCycleName(cycle),
      })).toArray();
  }

  render() {
    const { id, multi, selectedCycles } = this.props;
    return (
      <Select
        id={id}
        multi={multi}
        value={selectedCycles}
        onChange={this.props.onChange}
        options={this.getCyclesSelectOptions()}
      />
    );
  }
}

const mapStateToProps = state => ({
  cycles: state.list.get('cycles_list'),
});

export default connect(mapStateToProps)(CyclesSelector);
