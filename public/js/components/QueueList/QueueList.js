import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { Panel } from 'react-bootstrap';
import moment from 'moment';

import Pager from '../Pager';
import { AdvancedFilter } from '../Filter';
import List from '../List';
import Queue from './Queue';

import { getList } from '../../actions/listActions';

class QueueList extends Component {

  static propTypes = {
    queueLines: React.PropTypes.instanceOf(Immutable.List).isRequired,
    getList: React.PropTypes.func.isRequired,
    calculators: React.PropTypes.instanceOf(Immutable.List),
  };

  static defaultProps = {
    queueLines: Immutable.List(),
    calculators: Immutable.List([false, ...globalSetting.queue_calculators, '-']),
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

  getNextCalculator = (calcName) => {
    const { calculators } = this.props;
    return calculators.get(calculators.indexOf(calcName) + 1);
  }

  getPreviousCalculator = (calcName) => {
    const { calculators } = this.props;
    return calculators.get(calculators.indexOf(calcName) - 1);
  }

  getCalculatorStage = (ent) => {
    const calcName = ent.get('calc_name');
    return this.getNextCalculator(calcName);
  }

  getLastCalcTime = (ent) => {
    const calcTime = ent.get('calc_time');
    if (calcTime === false) {
      return 'Never';
    }
    return moment(parseInt(calcTime, 10) * 1000)
      .format(globalSetting.datetimeFormat);
  }

  fetchItems = () => {
    this.props.getList('queueLines', this.buildQuery());
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  urtQueryBuilder = () => {
    const { filter: { urt = {} } } = this.state;
    const urtQuery = Object.assign({}, urt);
    if (urtQuery.from) {
      urtQuery.$gte = urtQuery.from;
      delete urtQuery.from;
    } else if (urtQuery.from === '') {
      delete urtQuery.from;
    }
    if (urtQuery.to) {
      urtQuery.$lte = urtQuery.to;
      delete urtQuery.to;
    } else if (urtQuery.to === '') {
      delete urtQuery.to;
    }
    return urtQuery;
  }

  handleQuerySpecialValues = () => {
    const { filter = {} } = this.state;
    const filterQuery = Object.assign({}, filter);

    if (filterQuery.calc_name) {
      filterQuery.calc_name.$regex = this.getPreviousCalculator(filterQuery.calc_name.$regex);
    }

    if (filterQuery.urt) {
      filterQuery.urt = this.urtQueryBuilder();
      if (!Object.keys(filterQuery.urt).length) {
        delete filterQuery.urt;
      }
    }

    return filterQuery;
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

  renderQueueItem = () => {
    const { line } = this.state;

    return (
      <Queue line={line} onClickCancel={this.onCancelView} />
    );
  }

  renderQueueList = () => {
    const { queueLines } = this.props;
    const fields = [
      { id: 'type', placeholder: 'Type' },
      { id: 'calc_time', placeholder: 'Last Calculation Time', type: 'timestamp', sort: true, parser: this.getLastCalcTime },
      { id: 'calc_name', placeholder: 'Calculator Stage', type: 'text', sort: true, parser: this.getCalculatorStage },
      { id: 'urt', placeholder: 'Time', type: 'datetime', cssClass: 'long-date', showFilter: false },
    ];
    const filterFields = [
      { id: 'type', title: 'Type', type: 'text' },
      { id: 'calc_name', title: 'Calculator Stage', type: 'text' },
      { id: 'urt', title: 'Date', type: 'date-range' },
    ];

    return (
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

        <Pager
          onClick={this.handlePageClick}
          size={this.state.size}
          count={queueLines.size || 0}
        />
      </div>
    );
  }

  render() {
    const { viewing } = this.state;

    return (
      <div className="QueueList">
        { viewing ? this.renderQueueItem() : this.renderQueueList() }
      </div>
    );
  }
}

const mapDispatchToProps = {
  getList,
};

const mapStateToProps = state => ({
  queueLines: state.list.get('queueLines'),
});

export default connect(mapStateToProps, mapDispatchToProps)(QueueList);
