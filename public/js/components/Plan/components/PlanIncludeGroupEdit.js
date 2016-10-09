import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Collapse, Button, Well, Form, FormGroup, ControlLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Immutable from 'immutable';
import Field from '../../Field';
import Products from './Products';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';


class PlanIncludeGroupEdit extends Component {

  static propTypes = {
    onChangeFieldValue: React.PropTypes.func.isRequired,
    removeGroupProducts: React.PropTypes.func.isRequired,
    getGroupProducts: React.PropTypes.func.isRequired,
    addGroupProducts: React.PropTypes.func.isRequired,
    onGroupRemove: React.PropTypes.func.isRequired,
    usaget: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
  }

  static defaultProps = {
    groupProducts : Immutable.List()
  };

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

  onGroupRemove = () => {
    const { name, usaget, groupProducts } = this.props;
    this.props.onGroupRemove(name, usaget, groupProducts.toArray());
  }

  render() {
    const { name, value, usaget, groupProducts } = this.props;
    const { open } = this.state;

    return (
      <div>
        <Row>
          <Col lg={1} md={1} sm={1} xs={6} className="text-left">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Remove {name} gruop</Tooltip>}>
              <i className="fa fa-times-circle fa-lg" onClick={this.onGroupRemove} style={{cursor: "pointer", color: 'red'}} />
            </OverlayTrigger>
          </Col>
          <Col lg={1} md={1} sm={1} xs={6} className="text-left">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Edit {name} gruop</Tooltip>}>
              <i className="fa fa-pencil fa-lg" onClick={this.toggleBoby} style={{cursor: "pointer", color:'#777'}} />
            </OverlayTrigger>
          </Col>
          <Col lg={6} md={6} sm={6} xs={12} className="text-left">
            <h4 style={{marginTop: 0}}>{name} <small>&lt;{usaget}&gt;</small></h4>
          </Col>
          {open
            ? <Col lg={1} md={1} sm={1} xs={1} lgOffset={3} mdOffset={3} smOffset={3} className="text-right">
                <i className="fa fa-times" onClick={this.toggleBoby} style={{cursor: "pointer"}} />
              </Col>
            : <Col lg={4} md={4} sm={4} xs={12} className="text-right">{value}</Col>
          }
        </Row>

        <Collapse in={open}>
          <div style={{backgroundColor: "rgba(0, 0, 0, 0.027451)", padding: 25, borderRadius: 5, marginTop: 15}}>
            <Form>
              <FormGroup>
                <ControlLabel>Includes</ControlLabel>
                <Field onChange={this.onChangeInclud} value={value} fieldType="unlimited" unlimitedValue="UNLIMITED"/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Products</ControlLabel>
                <Products onRemoveProduct={this.onRemoveProduct} products={groupProducts} />
                <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                  <ProductSearchByUsagetype addRatesToGroup={this.onAddProduct} usaget={usaget} products={groupProducts} />
                </div>
              </FormGroup>
            </Form>
          </div>
        </Collapse>
      </div>
    );
  }

}

function mapStateToProps(state, props) {
  return  {
    groupProducts: state.planProducts.productIncludeGroup.getIn([props.name, props.usaget])
  };
}
export default connect(mapStateToProps)(PlanIncludeGroupEdit);
