import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

const DashboardBase = (ComposedComponent) => {
  class DashboardLayout extends Component {

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
      super(props);
      const toDate = moment();
      const fromDate = toDate.clone().add(-6, 'months');
      this.state = { fromDate, toDate };
    }

    render() {
      const { fromDate, toDate } = this.state;
      return (
        <Row>
          <Col lg={8} md={12} sm={12} xs={12} lgOffset={2} mdOffset={0} smOffset={0} xsOffset={0} >
            <ComposedComponent fromDate={fromDate} toDate={toDate} />
          </Col>
        </Row>
      );
    }
  }

  return DashboardLayout;
};

export default DashboardBase;
