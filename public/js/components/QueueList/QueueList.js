import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { Panel } from 'react-bootstrap';

import Pager from '../Pager';
import { AdvancedFilter } from '../Filter';
import List from '../List';
import Queue from './Queue';

import { getList } from '../../actions/listActions';

class QueueList extends Component {

  static propTypes = {
    queueLines: React.PropTypes.instanceOf(Immutable.List).isRequired,
    getList: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    queueLines: Immutable.List(),
    dispatch: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      line: null,
      viewing: false,
      page: 0,
      size: 10,
      sort: '',
      filter: '',
    };
  }

  componentDidMount() {
    this.fetchItems();
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.fetchItems);
  }

  onSort = (sort) => {
    this.setState({ sort }, this.fetchItems);
  }

  onClickLine = (line) => {
    this.setState({ line, viewing: true });
  }

  onCancelView = () => {
    this.setState({ line: null, viewing: false });
  }

  getCalculators = () => Immutable.fromJS([false, ...globalSetting.queue_calculators, '-']);

  getNextCalculator = (calcName) => {
    const calculators = this.getCalculators();
    return calculators.get(calculators.indexOf(calcName) + 1);
  }

  getPreviousCalculator = (calcName) => {
    const calculators = this.getCalculators();
    return calculators.get(calculators.indexOf(calcName) - 1);
  }

  getCalculatorStage = (ent) => {
    const calcName = ent.get('calc_name');
    return this.getNextCalculator(calcName);
  }

  fetchItems = () => {
    this.props.getList('queueLines', this.buildQuery());
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  urtQueryBuilder = () => {
    const { filter } = this.state;
    const urtQuery = filter.urt || {};
    if (urtQuery.from) {
      urtQuery.$gte = urtQuery.from;
      delete urtQuery.from;
    }
    if (urtQuery.to) {
      urtQuery.$lte = urtQuery.to;
      delete urtQuery.to;
    }
    return urtQuery;
  }

  handleQuerySpecialValues = () => {
    const { filter } = this.state;

    if (filter.calc_name) {
      filter.calc_name.$regex = this.getPreviousCalculator(filter.calc_name.$regex);
    }

    if (filter.urt) {
      filter.urt = this.urtQueryBuilder();
      if (!Object.keys(filter.urt).length) {
        delete filter.urt;
      }
    }

    return filter || {};
  }

  buildQuery = () => {
    const { page, size, sort } = this.state;
    const query = this.handleQuerySpecialValues();

    return {
      api: 'find',
      params: [
        { collection: 'queue' },
        { size },
        { page },
        { sort },
        { query: JSON.stringify(query) },
      ],
    };
  }

  render() {
    const { line, viewing } = this.state;
    const { queueLines } = this.props;

    const fields = [
      { id: 'type', placeholder: 'Type' },
      { id: 'calc_time', placeholder: 'Last Calculation Time', type: 'timestamp', sort: true },
      { id: 'calc_name', placeholder: 'Calculator Stage', type: 'text', sort: true, parser: this.getCalculatorStage },
      { id: 'urt', placeholder: 'Time', type: 'datetime', cssClass: 'long-date', showFilter: false },
    ];

    const filterFields = [
      { id: 'type', title: 'Type', type: 'text' },
      { id: 'calc_name', title: 'Calculator Stage', type: 'text' },
      { id: 'urt', title: 'Date', type: 'date-range' },
    ];

    const currentView = viewing ? (<Queue line={line} onClickCancel={this.onCancelView} />) : (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span>
                  List of queue data
                </span>
                <div className="pull-right">
                  <Link to={'/usage'} className="btn btn-default btn-xs">Back to Usage</Link>
                </div>
              </div>
              <div className="panel-body">
                <Panel header={<AdvancedFilter fields={filterFields} onFilter={this.onFilter} />}>
                  <List items={queueLines} fields={fields} edit={true} onClickEdit={this.onClickLine} editText="view" onSort={this.onSort} />
                </Panel>
              </div>
            </div>
          </div>
        </div>

        <Pager onClick={this.handlePageClick} size={this.state.size} count={queueLines.size || 0} />
      </div>
    );

    return (
      <div>
        { currentView }
      </div>
    );
  }
}

const mapDispatchToProps = {
  getList,
};

function mapStateToProps(state) {
  return {
    queueLines: state.list.get('queueLines'),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueueList);
