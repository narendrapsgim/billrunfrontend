import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeader} from 'react-bootstrap';

import { getList } from '../../actions/listActions';

class PlansList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 10,
      page: 0,
      query: {}
    }
  }

  componentDidMount() {
    this.props.dispatch(getList("plans", this.state));
  }
  
  render() {
    const { plans } = this.props;

    const table_header =
    ["Name", "Code", "Description", "Trial", "Recurring Charges", "Billing Frequency", "Charging Mode"].map((header, key) => (
      <th key={key}>{header}</th>
    ));
    
    const table_body = plans.map((plan, plan_key) => (
      <tr key={plan_key}>
        <td>{ plan.get('name') }</td>
      </tr>
    ));
    
    return (
      <div>
        <div className="row">
          <div className="col-lg-12"> 
            <PageHeader>Plans</PageHeader> 
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>{ table_header }</tr>
                </thead>
                <tbody>
                  { table_body }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    plans: state.list.get('plans') || []
  };
}

export default connect(mapStateToProps)(PlansList);
