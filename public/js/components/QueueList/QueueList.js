import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Link } from 'react-router';
import moment from 'moment';
import { Col, Row, Panel } from 'react-bootstrap';
import Pager from '../Pager';
import { AdvancedFilter } from '../Filter';
import List from '../List';
import Queue from './Queue';
/* ACTIONS */
import { getList } from '../../actions/listActions';


class QueueList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    calculators: PropTypes.instanceOf(Immutable.List),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
    calculators: Immutable.List([false, ...globalSetting.queue_calculators, '-']),
  };

  state = {
    line: null,
    viewing: false,
    page: 0,
    size: 10,
    sort: Immutable.Map({ calc_time: -1 }),
    filter: {},
  };

  componentDidMount() {
    this.fetchItems();
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.fetchItems);
  }

  onSort = (newSort) => {
    const sort = Immutable.Map(newSort);
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

  parseCalcName = (ent) => {
    const calcName = ent.get('calc_name');
    return this.getNextCalculator(calcName);
  }

  parseCalcTime = (ent) => {
    const calcTime = ent.get('calc_time', false);
    if (calcTime === false) {
      return 'Never';
    }
    return moment.unix(calcTime).format(globalSetting.datetimeFormat);
  }

  fetchItems = () => {
    this.props.dispatch(getList('queue_lines', this.buildQuery()));
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
      filterQuery.calc_name = {
        $regex: this.getPreviousCalculator(filterQuery.calc_name.$regex),
        $options: 'i',
      };
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
        { sort: JSON.stringify(sort) },
        { query: JSON.stringify(query) },
      ],
    };
  }

  getFilterFields = () => ([
    { id: 'type', title: 'Type', type: 'text' },
    { id: 'calc_name', title: 'Calculator Stage', type: 'text' },
    { id: 'urt', title: 'Date', type: 'date-range' },
  ]);

  getTableFields = () => ([
    { id: 'type', title: 'Type' },
    { id: 'calc_time', title: 'Last Calculation Time', sort: true, parser: this.parseCalcTime, cssClass: 'long-date' },
    { id: 'calc_name', title: 'Calculator Stage', sort: true, parser: this.parseCalcName },
    { id: 'urt', title: 'Time', type: 'datetime', cssClass: 'long-date' },
  ]);

  renderPanelTitle = () => (
    <div>
      <span>
        List of queue data
      </span>
      <div className="pull-right">
        <Link to={'/usage'} className="btn btn-default btn-xs">Back to Usage</Link>
      </div>
    </div>
  );

  renderQueueList = () => {
    const { items } = this.props;
    const { sort } = this.state;
    const tableFields = this.getTableFields();
    const filterFields = this.getFilterFields();
    return (
      <div>
        <Row>
          <Col lg={12}>
            <Panel header={this.renderPanelTitle()}>
              <AdvancedFilter fields={filterFields} onFilter={this.onFilter} />
              <List
                items={items}
                fields={tableFields}
                edit={true}
                onClickEdit={this.onClickLine}
                editText="view"
                onSort={this.onSort}
                sort={sort}
              />
            </Panel>
          </Col>
        </Row>
        <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
      </div>
    );
  }

  renderQueueItem = () => {
    const { line } = this.state;
    return (
      <Queue line={line} onClickCancel={this.onCancelView} />
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


const mapStateToProps = state => ({
  items: state.list.get('queue_lines'),
});

export default connect(mapStateToProps)(QueueList);
