import React, { Component, PropTypes } from 'react';
import { Modal, Col, Button, Form, FormGroup, ControlLabel, Checkbox, Tooltip, OverlayTrigger, HelpBlock } from 'react-bootstrap';
import Immutable from 'immutable';
import changeCase from 'change-case';
import { GroupsInclude } from '../../../FieldDescriptions';
import Help from '../../Help';
import { ConfirmModal } from '../../Elements';
import Field from '../../Field';
import Actions from '../../Elements/Actions';
import ProductSearchByUsagetype from './ProductSearchByUsagetype';
import { validateUnlimitedValue, validatePriceValue } from '../../../common/Validators';


export default class PlanIncludeGroupEdit extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    usages: PropTypes.instanceOf(Immutable.List).isRequired,
    shared: PropTypes.bool,
    pooled: PropTypes.bool,
    products: PropTypes.instanceOf(Immutable.List),
    usedProducts: PropTypes.instanceOf(Immutable.List),
    onChangeFieldValue: PropTypes.func.isRequired,
    onChangeGroupProducts: PropTypes.func.isRequired,
    mode: PropTypes.string,
    onGroupRemove: PropTypes.func.isRequired,
    unit: PropTypes.string,
  }

  static defaultProps = {
    products: Immutable.List(),
    usedProducts: Immutable.List(),
    shared: false,
    pooled: false,
    mode: 'create',
    unit: '',
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
    this.props.usages.get(0, '') === 'cost'
  );

  onChangeInclud = (value) => {
    const { name } = this.props;
    let errorInclude = '';
    if (value === '') {
      errorInclude = this.errors.include.required;
    } else if (this.isMonetaryBased() && !validatePriceValue(value)) {
      errorInclude = this.errors.include.allowedCharactersMonetary;
    } else if (!this.isMonetaryBased() && !validateUnlimitedValue(value)) {
      errorInclude = this.errors.include.allowedCharacters;
    }
    const valueField = this.isMonetaryBased() ? 'cost' : 'value';
    this.props.onChangeFieldValue(['include', 'groups', name, valueField], value);
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
    if (!checked) {
      this.props.onChangeFieldValue(['include', 'groups', name, 'account_pool'], false);
    }
  }

  onChangePooled = (e) => {
    const { checked } = e.target;
    const { name } = this.props;
    this.props.onChangeFieldValue(['include', 'groups', name, 'account_pool'], checked);
  }

  onChangeGroupRates = (productKey) => {
    const { name } = this.props;
    this.props.onChangeGroupProducts(name, productKey);
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

  getListActions = () => {
    const { mode } = this.props;
    const allowEdit = mode !== 'view';
    return ([
      { type: 'edit', helpText: 'Edit group', onClick: this.toggleBoby, enable: allowEdit },
      { type: 'remove', helpText: 'Remove Group', onClick: this.onGroupRemoveAsk, enable: allowEdit },
    ]);
  }

  renderProductsTooltip = productsLabels => (
    <Tooltip id={productsLabels}>
      {productsLabels}
    </Tooltip>
  )

  renderEdit = () => {
    const { name, value, usages, shared, pooled, products, usedProducts } = this.props;
    const { isEditMode, errorInclude } = this.state;
    return (
      <Modal show={isEditMode}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit {name} <i>{usages.join(', ')}</i></Modal.Title>
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
              <Col smOffset={3} sm={8}>
                <Checkbox disabled={!shared} checked={pooled} onChange={this.onChangePooled}>{'Includes is pooled?'}<Help contents={GroupsInclude.pooled_desc} /></Checkbox>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Products</Col>
              <Col sm={8}>
                <div style={{ marginTop: 10, minWidth: 250, width: '100%', minHeight: 42 }}>
                  <ProductSearchByUsagetype
                    products={products}
                    usages={usages}
                    existingProducts={usedProducts.toList()}
                    onChangeGroupRates={this.onChangeGroupRates}
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
    const { name, value, usages, shared, pooled, products, unit } = this.props;
    const { showConfirm } = this.state;
    const confirmMessage = `Are you sure you want to remove ${name} group?`;
    const sharedLabel = shared ? 'Yes' : 'No';
    const pooledLabel = pooled ? 'Yes' : 'No';
    const productsLabels = products.join(', ');
    const valueLabel = changeCase.titleCase(value);
    const tooltip = this.renderProductsTooltip(productsLabels);
    const actions = this.getListActions();

    return (
      <tr className="List">
        <td className="td-ellipsis">{name}</td>
        <td className="td-ellipsis">{usages.join(', ')}</td>
        <td className="td-ellipsis">{valueLabel}</td>
        <td className="td-ellipsis">{unit}</td>
        <td className="td-ellipsis">
          <OverlayTrigger placement="left" overlay={tooltip}>
            <span>{productsLabels}</span>
          </OverlayTrigger>
        </td>
        <td className="td-ellipsis text-center">{sharedLabel}</td>
        <td className="td-ellipsis text-center">{pooledLabel}</td>
        <td className="text-right row" style={{ paddingRight: 0, paddingLeft: 0 }}>
          <Actions actions={actions} />
          <ConfirmModal onOk={this.onGroupRemoveOk} onCancel={this.onGroupRemoveCancel} show={showConfirm} message={confirmMessage} labelOk="Yes" />
          { this.renderEdit() }
        </td>
      </tr>
    );
  }

}
