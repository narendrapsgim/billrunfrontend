import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { currencySelector } from '../../selectors/settingsSelector';


const DashboardBase = (ComposedComponent) => {
  class DashboardLayout extends Component {

    static propTypes = {
      currency: PropTypes.string,
    };

    static defaultProps = {
      currency: '',
    };

    constructor(props) {
      super(props);
      const toDate = moment();
      const fromDate = toDate.clone().add(-6, 'months');
      this.state = { fromDate, toDate };
    }

    render() {
      const { currency } = this.props;
      const { fromDate, toDate } = this.state;
      return (
        <Row>
          <Col lg={12} md={12} sm={12} xs={12} lgOffset={0} mdOffset={0} smOffset={0} xsOffset={0} >
            <ComposedComponent fromDate={fromDate} toDate={toDate} currency={currency} />
          </Col>
        </Row>
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    currency: currencySelector(state, props),
  });

  return connect(mapStateToProps)(DashboardLayout);
};

export default DashboardBase;
