// import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { withRouter } from 'react-router';
// import Immutable from 'immutable';
// import moment from 'moment';
// import { Button } from 'react-bootstrap';
// import List from '../List';
// import Pager from '../Pager';
// import Filter from '../Filter';
// /* ACTIONS */
// import { getList, clearList } from '../../actions/listActions';
//
//
// class ServicesList extends Component {
//
//   static defaultProps = {
//     items: Immutable.List(),
//   }
//
//   static propTypes = {
//     items: PropTypes.instanceOf(Immutable.List),
//     router: PropTypes.shape({
//       push: PropTypes.func.isRequired,
//     }).isRequired,
//     getList: PropTypes.func.isRequired,
//     clearList: PropTypes.func.isRequired,
//   }
//
//   constructor(props) {
//     super(props);
//     this.itemsType = 'services';
//     this.itemType = 'service';
//     this.state = {
//       fields: { name: 1, price: 1, description: 1, from: 1, to: 1 },
//       page: 0,
//       size: 10,
//       sort: '',
//       filter: {},
//     };
//   }
//
//   componentWillUnmount() {
//     this.props.clearList(this.itemsType);
//   }
//
//   onClickItem = (item) => {
//     const itemId = item.getIn(['_id', '$id']);
//     this.props.router.push(`/${this.itemType}/${itemId}`);
//   }
//
//   onClickNew = () => {
//     this.props.router.push(`/${this.itemType}`);
//   }
//
//   onFilter = (filter) => {
//     this.setState({ filter, page: 0 }, this.fetchItems);
//   }
//
//   onSort = (sort) => {
//     this.setState({ sort }, this.fetchItems);
//   }
//
//   buildQuery = () => ({
//     api: 'find',
//     params: [
//       { collection: this.itemsType },
//       { project: JSON.stringify(this.state.fields) },
//       { size: this.state.size },
//       { page: this.state.page },
//       { sort: this.state.sort },
//       { query: this.state.filter },
//     ],
//   });
//
//   handlePageClick = (page) => {
//     this.setState({ page }, this.fetchItems);
//   }
//
//   fetchItems = () => {
//     this.props.getList(this.itemsType, this.buildQuery());
//   }
//
//   priceParser = item => item.getIn(['price', 0, 'price'], '');
//
//   cyclesParser = (item) => {
//     const unlimited = globalSetting.serviceCycleUnlimitedValue;
//     const cycle = item.getIn(['price', 0, 'to'], '');
//     return cycle === unlimited ? 'Infinite' : cycle;
//   }
//
//
//   getFilterFields = () => ([
//     { id: 'description', placeholder: 'Title' },
//     { id: 'name', placeholder: 'Key' },
//     { id: 'to', showFilter: false, type: 'datetime' },
//   ])
//
//   getTableFields = () => ([
//     { id: 'description', title: 'Title', sort: true },
//     { id: 'name', title: 'Key', sort: true },
//     { title: 'Price', parser: this.priceParser, sort: true, id: 'price.0.price' },
//     { title: 'Cycles', parser: this.cyclesParser, sort: true, id: 'price.0.to' },
//   ])
//
//   render() {
//     const { items } = this.props;
//     const baseFilter = { to: { $gt: moment().toISOString() } };
//     const filterFields = this.getFilterFields();
//     const tableFields = this.getTableFields();
//
//     return (
//       <div>
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="panel panel-default">
//               <div className="panel-heading">
//                 List of all available services
//                 <div className="pull-right">
//                   <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}><i className="fa fa-plus" />&nbsp;Add New</Button>
//                 </div>
//               </div>
//               <div className="panel-body">
//                 <Filter fields={filterFields} onFilter={this.onFilter} base={baseFilter} />
//                 <List items={items} fields={tableFields} editField="description" edit={true} onClickEdit={this.onClickItem} onSort={this.onSort} />
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <Pager onClick={this.handlePageClick} size={this.state.size} count={items.size} />
//       </div>
//     );
//   }
// }
//
// const mapDispatchToProps = dispatch => bindActionCreators({
//   clearList,
//   getList,
// }, dispatch);
//
// const mapStateToProps = state => ({
//   items: state.list.get('services'),
// });
//
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ServicesList));
//

import React, { Component } from 'react';
import EntityList from '../EntityList';

export default class ServicesList extends Component {

  parserPrice = item => item.getIn(['price', 0, 'price'], '');

  parserCycles = (item) => {
    const unlimited = globalSetting.serviceCycleUnlimitedValue;
    const cycle = item.getIn(['price', 0, 'to'], '');
    return cycle === unlimited ? 'Infinite' : cycle;
  }

  getFilterFields = () => ([
    { id: 'description', placeholder: 'Title' },
    { id: 'name', placeholder: 'Key' },
    { id: 'to', showFilter: false, type: 'datetime' },
  ]);

  getTableFields = () => ([
    { id: 'description', title: 'Title', sort: true },
    { id: 'name', title: 'Key', sort: true },
    { title: 'Price', parser: this.parserPrice, sort: true },
    { title: 'Cycles', parser: this.parserCycles, sort: true },
  ]);

  getProjectFields = () => ({
    description: 1,
    name: 1,
    price: 1,
  });

  render() {
    return (
      <EntityList
        itemsType="services"
        itemType="service"
        filterFields={this.getFilterFields()}
        tableFields={this.getTableFields()}
        projectFields={this.getProjectFields()}
      />
    );
  }

}
