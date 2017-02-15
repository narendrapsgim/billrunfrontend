import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Immutable from 'immutable';
import { Col, Row, Panel } from 'react-bootstrap';
import Pager from '../Pager';
import Filter from '../Filter';
import List from '../List';
import Usage from './Usage';
import { usageListQuery } from '../../common/ApiQueries';
import { getList } from '../../actions/listActions';

class UsageList extends Component {

  static propTypes = {
    items: PropTypes.instanceOf(Immutable.List),
    baseFilter: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: Immutable.List(),
    baseFilter: {},
  }

  state = {
    line: null,
    viewing: false,
    page: 0,
    size: 10,
    sort: Immutable.Map(),
    filter: {},
  };

  buildQuery = () => {
    const { page, size, sort, filter } = this.state;
    return usageListQuery(filter, page, sort, size);
  }

  onFilter = (filter) => {
    this.setState({ filter, page: 0 }, this.fetchItems);
  }

  handlePageClick = (page) => {
    this.setState({ page }, this.fetchItems);
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

  fetchItems = () => {
    this.props.dispatch(getList('usages', this.buildQuery()));
  }

  getTableFields = () => {
    const { baseFilter } = this.props;

    return ([
      { id: 'type', placeholder: 'Type', showFilter: !Object.prototype.hasOwnProperty.call(baseFilter, 'type') },
      { id: 'aid', placeholder: 'Customer ID', type: 'number', sort: true, showFilter: !Object.prototype.hasOwnProperty.call(baseFilter, 'aid') },
      { id: 'sid', placeholder: 'Subscription ID', type: 'number', sort: true, showFilter: !Object.prototype.hasOwnProperty.call(baseFilter, 'sid') },
      { id: 'plan', placeholder: 'Plan', showFilter: !Object.prototype.hasOwnProperty.call(baseFilter, 'plan') },
      { id: 'urt', placeholder: 'Time', type: 'datetime', cssClass: 'long-date', showFilter: false, sort: true },
    ]);
  }

  renderMainPanelTitle = () => (
    <div>
      <span>List of all usages</span>
      <div className="pull-right">
        <Link to={'/queue'} className="btn btn-default btn-xs">Go to Queue</Link>
      </div>
    </div>
  );

  render() {
    const { line, viewing, sort } = this.state;
    const { items, baseFilter } = this.props;
    const fields = this.getTableFields();
    return (
      <div className="UsageList">
        { viewing ? (<Usage line={line} onClickCancel={this.onCancelView} />) : null }
        <div style={{ display: viewing ? 'none' : 'block' }}>
          <Row>
            <Col lg={12}>
              <Panel header={this.renderMainPanelTitle()}>
                <Filter fields={fields} onFilter={this.onFilter} base={baseFilter} />
                <List
                  items={items}
                  fields={fields}
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
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  items: state.list.get('usages'),
  baseFilter: props.location.query.base ? JSON.parse(props.location.query.base) : {},
});

export default connect(mapStateToProps)(UsageList);
