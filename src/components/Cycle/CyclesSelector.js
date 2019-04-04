import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Field from '@/components/Field';
import { getCyclesQuery } from '../../common/ApiQueries';
import { getList, clearList } from '@/actions/listActions';
import { getCycleName } from './CycleUtil';

class CyclesSelector extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cycles: PropTypes.instanceOf(List),
    selectedCycles: PropTypes.string,
    statusesToDisplay: PropTypes.instanceOf(List),
    onChange: PropTypes.func,
    multi: PropTypes.bool,
    from:PropTypes.string,
    to:PropTypes.string,
    newestFirst: PropTypes.bool,
  };

  static defaultProps = {
    cycles: List(),
    selectedCycles: '',
    statusesToDisplay: List(['current', 'future', 'running', 'to_run', 'finished', 'confirmed']),
    onChange: () => {},
    multi: false,
    from:"",
    to:"",
    newestFirst: true
  };

  componentDidMount() {
    this.props.dispatch(getList('cycles_list', getCyclesQuery(this.props.from,this.props.to,this.props.newestFirst)));
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
    const { multi, selectedCycles } = this.props;
    return (
      <Field
        fieldType="select"
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
