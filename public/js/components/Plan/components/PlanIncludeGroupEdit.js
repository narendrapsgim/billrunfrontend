import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Collapse, Button, Well, Form, FormGroup, ControlLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  getGroupProducts,
  addGroupProducts,
  removeGroupProducts } from '../../../actions/planGroupsActions';

import Include from './Include';
import Products from './Products';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';


class PlanIncludeGroupEdit extends Component {

  static propTypes = {
    onChangeFieldValue: React.PropTypes.func.isRequired,
    onGroupRemove: React.PropTypes.func.isRequired,
  }

  state = {
    open: false
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return true;
  //   //return nextProps.value !== this.props.value;
  // }

  componentWillMount(){
    const { name, usaget } = this.props;
    this.props.getGroupProducts(name, usaget);
  }

  toggleBoby = () => {
    this.setState({ open: !this.state.open });
  }

  onChangeInclud = (value) => {
    const { name, usaget } = this.props;
    this.props.onChangeFieldValue(['include', 'groups', name, usaget], value);
  }

  onAddProduct = (productKey) => {
    if(productKey){
      const { name, usaget } = this.props;
      this.props.addGroupProducts(name, usaget, productKey);
    }
  }

  onRemoveProduct = (productKey) => {
    if(productKey){
      const { name, usaget } = this.props;
      this.props.removeGroupProducts(name, usaget, productKey);
    }
  }

  onGroupRemove = (productKey) => {
    const { name } = this.props;
    this.props.onGroupRemove(name);
  }

  render() {
    const { name, value, usaget, groupPoducts } = this.props;
    const { open } = this.state;
    const productsNames = (typeof groupPoducts === 'undefined') ? null : groupPoducts.map( (prod) => prod.key);


    return (
      <div>
        <Row>
          <Col lg={1} md={1} sm={1} xs={6} className="text-left">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Remove {name} gruop</Tooltip>}>
              <i className="fa fa-times-circle fa-lg" onClick={ this.onGroupRemove } style={{cursor: "pointer", color: 'red'}}></i>
            </OverlayTrigger>
          </Col>
          <Col lg={1} md={1} sm={1} xs={6} className="text-left">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Edit {name} gruop</Tooltip>}>
              <i className="fa fa-pencil fa-lg" onClick={ this.toggleBoby } style={{cursor: "pointer", color:'#777'}}></i>
            </OverlayTrigger>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12} className="text-left">
            <h4 style={{marginTop: 0}}>{name} <small>&lt;{usaget}&gt;</small></h4>
          </Col>
          {open
            ? <Col lg={1} md={1} sm={1} xs={1} lgOffset={3} mdOffset={3} smOffset={3} className="text-right">
                <i className="fa fa-times" onClick={ this.toggleBoby } style={{cursor: "pointer"}} ></i>
              </Col>
            : <Col lg={4} md={4} sm={4} xs={12} className="text-right">{value}</Col>
          }
        </Row>

        <Collapse in={open}>
          <div style={{backgroundColor: "rgba(0, 0, 0, 0.027451)", padding: 25, borderRadius: 5, marginTop: 15}}>
            <Form>
              <FormGroup>
                <ControlLabel>Includes</ControlLabel>
                <Include onChangeInclud={this.onChangeInclud} value={value} />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Products</ControlLabel>
                  { ( !productsNames )
                    ? <p style={{marginTop:8}}>Loading....</p>
                    : <div>
                        <Products onRemoveProduct={this.onRemoveProduct} products={productsNames} />
                        <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                          <ProductSearchByUsagetype addRatesToGroup={this.onAddProduct} usaget={usaget} products={productsNames} />
                        </div>
                    </div>
                  }
              </FormGroup>
            </Form>
          </div>
        </Collapse>
      </div>
    );
  }

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addGroupProducts,
    removeGroupProducts,
    getGroupProducts }, dispatch);
}
function mapStateToProps(state, props) {
  return  {
    groupPoducts: state.planProducts.getIn(['productIncludeGroup', props.name, props.usaget])
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanIncludeGroupEdit);
