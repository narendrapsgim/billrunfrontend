import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Collapse, Button, Well, Form, FormGroup, ControlLabel, OverlayTrigger, Tooltip, Checkbox } from 'react-bootstrap';
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
    shared: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
    allGroupsProductsKeys: React.PropTypes.instanceOf(Immutable.Set),
    groupProducts: React.PropTypes.instanceOf(Immutable.List)
  }

  static defaultProps = {
    groupProducts: Immutable.List(),
    shared: false,
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

  onChangeShared = (e) => {
    const { checked } = e.target;
    const { name } = this.props;
    this.props.onChangeFieldValue(['include', 'groups', name, 'account_shared'], checked);
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
    const { name, value, usaget, shared, groupProducts, allGroupsProductsKeys } = this.props;
    const { open } = this.state;

    if(open){ //return edit mode
      return (
        <tr>
          <td colSpan="6" style={{padding: 0}}>
            <div style={{backgroundColor: "rgba(0, 0, 0, 0.027451)", padding: '15px 25px'}}>
              <Collapse in={open}>
                  <Form horizontal style={{marginBottom: 0}}>
                    <h4 className="text-center" style={{ marginTop: 0 }}>{`Edit ${name} Group`}</h4>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>Name</Col>
                      <Col sm={10}> <Field value={name} disabled={true} /> </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>Unit Type</Col>
                      <Col sm={10}> <Field value={usaget} disabled={true} /> </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>Include</Col>
                      <Col sm={10}> <Field onChange={this.onChangeInclud} value={value} fieldType="unlimited" unlimitedValue="UNLIMITED"/> </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>Products</Col>
                      <Col sm={10}> <Products onRemoveProduct={this.onRemoveProduct} products={groupProducts} />
                        <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                          <ProductSearchByUsagetype addRatesToGroup={this.onAddProduct} usaget={usaget} products={allGroupsProductsKeys.toList()} />
                        </div>
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col smOffset={2} sm={10}>
                        <Checkbox checked={shared} onChange={this.onChangeShared}>Shared</Checkbox>
                      </Col>
                    </FormGroup>

                    <div className="text-right">
                      <Button onClick={this.toggleBoby} bsSize="xsmall" style={{ minWidth: 80 }}>Close</Button>
                    </div>
                  </Form>
              </Collapse>
            </div>
          </td>
        </tr>
      );
    }

    return ( //return row mode
      <tr>
        <td className="td-ellipsis">{name}</td>
        <td className="td-ellipsis">{usaget}</td>
        <td className="td-ellipsis">{value}</td>
        <td className="td-ellipsis">{ groupProducts.join(', ')}</td>
        <td className="text-center td-ellipsis">{shared ? 'Yes' : 'No'}</td>
        <td className="text-right" style={{ paddingRight: 0 }}>
          <Button onClick={this.toggleBoby} bsSize="xsmall" style={{ marginRight: 9, minWidth: 80 }}><i className="fa fa-pencil" />&nbsp;Edit</Button>
          <Button onClick={this.onGroupRemove} bsSize="xsmall" style={{ minWidth: 80 }}><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
        </td>
      </tr>
    );
  }

}

function mapStateToProps(state, props) {
  return  {
    groupProducts: state.planProducts.productIncludeGroup.getIn([props.name, props.usaget])
  };
}
export default connect(mapStateToProps)(PlanIncludeGroupEdit);
