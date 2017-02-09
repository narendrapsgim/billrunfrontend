import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import ChangeCase from 'change-case';
import { Col, Row } from 'react-bootstrap';
/* COMPONENTS */
import Filter from '../Filter';
import List from '../List';
import Pager from '../Pager';
/* ACTIONS */
import { getSettings } from '../../actions/settingsActions';
import { getList } from '../../actions/listActions';


class PostpaidBalances extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    usageTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    aid: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: Immutable.List(),
    usageTypes: Immutable.List(),
  };

  state = {
    page: 0,
    size: 10,
    sort: Immutable.Map({ sid: 1 }),
    filter: {},
  };


  componentDidMount() {
    const { usageTypes } = this.props;
    if (usageTypes.isEmpty()) {
      this.props.dispatch(getSettings(['usage_types']));
    }
  }

  buildQuery = () => {
    const { size, page, sort, filter } = this.state;
    /** TODO: Will probably change **/
    return {
      api: 'find',
      params: [
        { collection: 'balances' },
        { size },
        { page },
        { sort: JSON.stringify(sort) },
        { query: JSON.stringify(filter) },
      ],
    };
  }

  fetchItems = () => {
    this.props.dispatch(getList('postpaid_balances', this.buildQuery()));
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.fetchItems);
  }

  onSort = (newSort) => {
    const sort = Immutable.Map(newSort);
    this.setState({ sort }, this.fetchItems);
  }

  getTableFields = () => {
    const { usageTypes } = this.props;
    const usageFields = usageTypes.map(usaget => ({
      id: usaget,
      placeholder: ChangeCase.titleCase(usaget),
      showFilter: false,
      parser: ent => ent.getIn(['balance', 'totals', usaget, 'usagev'], ''),
    })).toJS();

    return ([
      { id: 'aid', placeholder: 'Account', type: 'number', sort: true, showFilter: false, display: false },
      { id: 'sid', placeholder: 'Subscription', type: 'number', sort: true },
      { id: 'plan_description', placeholder: 'Plan' },
      ...usageFields,
      { id: 'from', placeholder: 'From', showFilter: false, type: 'datetime' },
      { id: 'to', placeholder: 'To', showFilter: false, type: 'datetime' },
    ]);
  }

  render() {
    const { items, aid } = this.props;
    const { sort } = this.state;
    const fields = this.getTableFields();
    const baseFilter = { aid, connection_type: 'postpaid' };
    return (
      <div className="Postpaid-Balances">
        <Row>
          <Col lg={12}>
            <Filter fields={fields} onFilter={this.onFilter} base={baseFilter} />
            <List items={items} fields={fields} onSort={this.onSort} sort={sort} />
          </Col>
        </Row>
        <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.list.get('postpaid_balances'),
  usageTypes: state.settings.get('usage_types'),
});

export default connect(mapStateToProps)(PostpaidBalances);
