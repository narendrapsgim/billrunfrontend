import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Col, Button, Form, FormGroup, ControlLabel, Checkbox } from 'react-bootstrap';
import Immutable from 'immutable';
import { GroupsInclude } from '../../../FieldDescriptions';
import Help from '../../Help';
import ConfirmModal from '../../ConfirmModal';
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
    groupProducts: React.PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    groupProducts: Immutable.List(),
    shared: false,
  };

  state = {
    isEditMode: false,
    showConfirm: false,
  }

  componentWillMount() {
    const { name, usaget } = this.props;
    this.props.getGroupProducts(name, usaget);
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
    if (productKey) {
      const { name, usaget } = this.props;
      this.props.addGroupProducts(name, usaget, productKey);
    }
  }

  onRemoveProduct = (productKey) => {
    if (productKey) {
      const { name, usaget } = this.props;
      this.props.removeGroupProducts(name, usaget, productKey);
    }
  }

  onGroupRemoveAsk = () => {
    this.setState({ showConfirm: true });
  }

  onGroupRemoveOk = () => {
    const { name, usaget, groupProducts } = this.props;
    this.props.onGroupRemove(name, usaget, groupProducts.toArray());
    this.setState({ showConfirm: false });
  }

  onGroupRemoveCancel = () => {
    this.setState({ showConfirm: false });
  }

  toggleBoby = () => {
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  renderEdit = () => {
    const { name, value, usaget, shared, groupProducts, allGroupsProductsKeys } = this.props;
    const { isEditMode } = this.state;

    return (
      <Modal show={isEditMode}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit {name} <i>{usaget}</i></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal style={{ marginBottom: 0 }}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Include</Col>
              <Col sm={8}>
                <Field onChange={this.onChangeInclud} value={value} fieldType="unlimited" unlimitedValue="UNLIMITED" />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={3} sm={8}>
                <Checkbox checked={shared} onChange={this.onChangeShared}>{"Share with all account's subscribers"}<Help contents={GroupsInclude.shared_desc} /></Checkbox>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Products</Col>
              <Col sm={8}>
                <Products onRemoveProduct={this.onRemoveProduct} products={groupProducts} />
                <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                  <ProductSearchByUsagetype addRatesToGroup={this.onAddProduct} usaget={usaget} products={allGroupsProductsKeys.toList()} />
                </div>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.toggleBoby} bsStyle="primary" bsSize="small" style={{ minWidth: 90 }}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    const { name, value, usaget, shared, groupProducts } = this.props;
    const { showConfirm } = this.state;
    const confirmMessage = `Are you sure you want to remove ${name} group?`;
    const sharedLabel = shared ? 'Yes' : 'No';
    const productsLabel = groupProducts.join(', ');

    return (
      <tr>
        <td className="td-ellipsis">{name}</td>
        <td className="td-ellipsis">{usaget}</td>
        <td className="td-ellipsis">{value}</td>
        <td className="td-ellipsis">{productsLabel}</td>
        <td className="td-ellipsis text-center">{sharedLabel}</td>
        <td className="text-right" style={{ paddingRight: 0 }}>
          <Button onClick={this.toggleBoby} bsSize="xsmall" style={{ marginRight: 10, minWidth: 80 }}><i className="fa fa-pencil" />&nbsp;Edit</Button>
          <Button onClick={this.onGroupRemoveAsk} bsSize="xsmall" style={{ minWidth: 80 }}><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
          <ConfirmModal onOk={this.onGroupRemoveOk} onCancel={this.onGroupRemoveCancel} show={showConfirm} message={confirmMessage} labelOk="Yes" />
          { this.renderEdit() }
        </td>
      </tr>
    );
  }

}

const mapStateToProps = (state, props) => ({
  groupProducts: state.planProducts.productIncludeGroup.getIn([props.name, props.usaget]),
});
export default connect(mapStateToProps)(PlanIncludeGroupEdit);
