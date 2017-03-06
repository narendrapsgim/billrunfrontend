import React, { Component, PropTypes } from 'react';
import { Modal, Col, Button, Form, FormGroup, ControlLabel, Checkbox, Tooltip, OverlayTrigger, HelpBlock } from 'react-bootstrap';
import Immutable from 'immutable';
import changeCase from 'change-case';
import { GroupsInclude } from '../../../FieldDescriptions';
import Help from '../../Help';
import ConfirmModal from '../../ConfirmModal';
import Field from '../../Field';
import Products from './Products';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';
import { validateUnlimitedValue, validatePriceValue } from '../../../common/Validators';


export default class PlanIncludeGroupEdit extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    usaget: PropTypes.string.isRequired,
    shared: PropTypes.bool,
    products: PropTypes.instanceOf(Immutable.List),
    usedProducts: PropTypes.instanceOf(Immutable.List),
    onChangeFieldValue: PropTypes.func.isRequired,
    removeGroupProducts: PropTypes.func.isRequired,
    addGroupProducts: PropTypes.func.isRequired,
    mode: PropTypes.string,
    onGroupRemove: PropTypes.func.isRequired,
  }

  static defaultProps = {
    products: Immutable.List(),
    usedProducts: Immutable.List(),
    shared: false,
    mode: 'create',
  };

  state = {
    isEditMode: false,
    showConfirm: false,
    errorInclude: '',
  }

  errors = {
    include: {
      required: 'Include is required',
      allowedCharacters: 'Include must be positive number or Unlimited',
      allowedCharactersMonetary: 'Include must be positive number',
    },
    products: {
      required: 'Products is required',
    },
  }

  isMonetaryBased = () => (
    this.props.usaget === 'cost'
  );

  onChangeInclud = (value) => {
    const { name, usaget } = this.props;
    let errorInclude = '';
    if (value === '') {
      errorInclude = this.errors.include.required;
    } else if (this.isMonetaryBased() && !validatePriceValue(value)) {
      errorInclude = this.errors.include.allowedCharactersMonetary;
    } else if (!this.isMonetaryBased() && !validateUnlimitedValue(value)) {
      errorInclude = this.errors.include.allowedCharacters;
    }
    this.props.onChangeFieldValue(['include', 'groups', name, usaget], value);
    this.setState({ errorInclude });
  }

  onChangeIncludeMonetaryBased = (e) => {
    const { value } = e.target;
    this.onChangeInclud(value);
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
    const { name, products } = this.props;
    this.props.onGroupRemove(name, products);
    this.setState({ showConfirm: false });
  }

  onGroupRemoveCancel = () => {
    this.setState({ showConfirm: false });
  }

  toggleBoby = () => {
    this.setState({ isEditMode: !this.state.isEditMode });
  }

  renderProductsTooltip = productsLabels => (
    <Tooltip id={productsLabels}>
      {productsLabels}
    </Tooltip>
  )

  renderEdit = () => {
    const { name, value, usaget, shared, products, usedProducts } = this.props;
    const { isEditMode, errorInclude } = this.state;
    return (
      <Modal show={isEditMode}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit {name} <i>{usaget}</i></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal style={{ marginBottom: 0 }}>
            <FormGroup validationState={errorInclude.length > 0 ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>Include</Col>
              <Col sm={8}>
                {this.isMonetaryBased()
                  ? <Field onChange={this.onChangeIncludeMonetaryBased} value={value} fieldType="text" />
                  : <Field onChange={this.onChangeInclud} value={value} fieldType="unlimited" />
                }
                { errorInclude.length > 0 && <HelpBlock>{errorInclude}</HelpBlock> }
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
                <Products onRemoveProduct={this.onRemoveProduct} products={products} />
                <div style={{ marginTop: 10, minWidth: 250, width: '100%', height: 42 }}>
                  <ProductSearchByUsagetype
                    addRatesToGroup={this.onAddProduct}
                    usaget={usaget}
                    products={usedProducts.toList()}
                  />
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
    const { name, value, usaget, shared, products, mode } = this.props;
    const { showConfirm } = this.state;
    const confirmMessage = `Are you sure you want to remove ${name} group?`;
    const sharedLabel = shared ? 'Yes' : 'No';
    const productsLabels = products.join(', ');
    const valueLabel = changeCase.titleCase(value);
    const allowEdit = mode !== 'view';
    const tooltip = this.renderProductsTooltip(productsLabels);
    return (
      <tr>
        <td className="td-ellipsis">{name}</td>
        <td className="td-ellipsis">{usaget}</td>
        <td className="td-ellipsis">{valueLabel}</td>
        <td className="td-ellipsis">
          <OverlayTrigger placement="left" overlay={tooltip}>
            <span>{productsLabels}</span>
          </OverlayTrigger>
        </td>
        <td className="td-ellipsis text-center">{sharedLabel}</td>
        { allowEdit &&
          <td className="text-right" style={{ paddingRight: 0 }}>
            <Button onClick={this.toggleBoby} bsSize="xsmall" style={{ marginRight: 10, minWidth: 80 }}><i className="fa fa-pencil" />&nbsp;Edit</Button>
            <Button onClick={this.onGroupRemoveAsk} bsSize="xsmall" style={{ minWidth: 80 }}><i className="fa fa-trash-o danger-red" />&nbsp;Remove</Button>
            <ConfirmModal onOk={this.onGroupRemoveOk} onCancel={this.onGroupRemoveCancel} show={showConfirm} message={confirmMessage} labelOk="Yes" />
            { this.renderEdit() }
          </td>
        }
      </tr>
    );
  }

}
