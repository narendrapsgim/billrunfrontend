import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import Include from './../PlanInclude';
import { Row, Col, Collapse, Button, Well, Form, FormGroup, ControlLabel } from 'react-bootstrap';

import * as Colors from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import {
  getGroupProducts,
  addGroupProducts,
  removeGroupProducts } from '../../../actions/planGroupsActions';

import Include from './Include';
import Products from './Products';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';

class PlanIncludeGroupEdit extends Component {

  constructor(props) {
    super(props);
    this.toggleBoby = this.toggleBoby.bind(this);
    this.onChangeInclud = this.onChangeInclud.bind(this);
    this.onAddProduct = this.onAddProduct.bind(this);
    this.onRemoveProduct = this.onRemoveProduct.bind(this);
    this.state = {open: false};
  }

  componentWillMount() {
    const { name, usaget } = this.props;
    this.props.getGroupProducts(name, usaget);
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
    //return nextProps.value !== this.props.value;
  }


  toggleBoby(){
    this.setState({ open: !this.state.open });
  }

  onChangeInclud(newValue){
    const { name, usaget } = this.props;
    this.props.onIncludeChange(name, usaget, newValue);
  }

  onAddProduct(productKey){
    if(productKey){
      const { name, usaget } = this.props;
      this.props.addGroupProducts(name, usaget, productKey);
    }
  }
  onRemoveProduct(productKey){
    if(productKey){
      const { name, usaget } = this.props;
      this.props.removeGroupProducts(name, usaget, productKey);
    }
  }

  render() {
    const { name, value, usaget, products } = this.props;
    const { open } = this.state;

    return (
        <div style={{display: 'flex',/* borderTop: '1px solid #eee', paddingBottom: 10, /*backgroundColor: open ? 'rgba(0,0,0,0.03)' : 'transparent'*/}}>
          <div style={{flex: '2 0 0', margin: '9px 40px auto', textAlign: 'left'}}>
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Remove {name} gruop</Tooltip>}>
                <FontIcon
                  onClick={this.props.onGroupRemove.bind(this, name, usaget)}
                  className="material-icons"
                  style={{cursor: "pointer", color: Colors.red300, fontSize: '32px', marginRight: '10px'}}
                >delete_forever</FontIcon>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip">Edit {name} gruop</Tooltip>}>
                <FontIcon
                  onClick={ this.toggleBoby }
                  className="material-icons"
                  style={{cursor: "pointer", color: Colors.grey500, fontSize: '32px', marginRight: '10px'}}
                >mode_edit</FontIcon>
              </OverlayTrigger>
          </div>
          <div style={{flex: '9 0 0'}}>
            <div className="product" style={{marginTop: 20}}>
              <div style={{display: 'flex', marginBottom: open ? 20 : 0 }}>

                <div style={{flex: '5 0 0', textAlign: 'left', cursor: "pointer"}} onClick={ this.toggleBoby }>
                  <h4 style={{marginTop: 0}}>{name} <small>&lt;{usaget}&gt;</small></h4>
                </div>
                <div style={{flex: '2 0 0', textAlign: 'right', pading: '0 3px', cursor: "pointer"}} onClick={ this.toggleBoby }>
                 {!open && value}
                </div>
              </div>
              <Collapse in={open}>
                <div style={{backgroundColor: "rgba(0, 0, 0, 0.027451)", padding: 20, borderRadius: 5}}>
                  <Form horizontal style={{marginTop:20}}>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}>
                        Includes :
                      </Col>
                      <Col sm={8}>
                        <Include onChangeInclud={this.onChangeInclud} value={value} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}>
                        Products :
                      </Col>
                      <Col sm={8}>

                        { (typeof products === 'undefined') ?
                          <p style={{marginTop:8}}>Loading....</p>
                          :
                          <div>
                            <Products
                              onRemoveProduct={this.onRemoveProduct}
                              products={products.map( (prod) => prod.key).toArray()}
                            />
                            <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                              <ProductSearchByUsagetype
                                addRatesToGroup={this.onAddProduct}
                                usaget={usaget}
                                products={products.map( (prod) => prod.key).toArray()}
                              />
                            </div>
                          </div>
                        }
                      </Col>
                    </FormGroup>
                  </Form>
                </div>
              </Collapse>
            </div>
          </div>
          <div style={{flex: '1 0 0'}}></div>
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
    products: state.planProducts.getIn(['productIncludeGroup', props.name, props.usaget])
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanIncludeGroupEdit);
