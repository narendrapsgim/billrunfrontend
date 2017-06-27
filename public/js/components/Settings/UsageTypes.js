import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import List from '../../components/List';
import { ConfirmModal } from '../Elements';
import { getSettings, updateSetting, removeSettingField } from '../../actions/settingsActions';
import { usageTypesDataSelector, propertyTypeSelector } from '../../selectors/settingsSelector';
import UsageTypeForm from './UsageTypes/UsageTypeForm';

class UsageTypes extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    usageTypes: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
  };

  static defaultProps = {
    usageTypes: Immutable.List(),
    propertyTypes: Immutable.List(),
  };

  state = {
    showConfirmRemove: false,
    itemToRemove: null,
    currentItem: null,
    index: -1,
  }

  componentWillMount() {
    this.props.dispatch(getSettings(['usage_types', 'property_types']));
  }

  getItemIndex = (item) => {
    const { usageTypes } = this.props;
    return usageTypes.indexOf(item);
  }

  onClickEdit = (item) => {
    this.setState({
      currentItem: item,
      index: this.getItemIndex(item),
    });
  };

  onClickRemove = (item) => {
    this.setState({
      showConfirmRemove: true,
      itemToRemove: item,
    });
  }

  onClickRemoveClose = () => {
    this.setState({
      showConfirmRemove: false,
      itemToRemove: null,
    });
  }

  onCancel = () => {
    this.setState({ currentItem: null });
  }

  handleSave = () => {
    const { index, currentItem } = this.state;
    this.setState({ currentItem: null });
    this.props.dispatch(updateSetting('usage_types', index, currentItem));
  }

  onUpdateItem = (fieldNames, fieldValues) => {
    const { currentItem } = this.state;
    const keys = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    const values = Array.isArray(fieldValues) ? fieldValues : [fieldValues];
    this.setState({
      currentItem: currentItem.withMutations((itemwithMutations) => {
        for (let i = 0; i < keys.length; i++) {
          itemwithMutations.set(keys[i], values[i]);
        }
      }),
    });
  };

  onClickRemoveOk = () => {
    const { itemToRemove } = this.state;
    this.setState({ showConfirmRemove: false, itemToRemove: null });
    this.props.dispatch(removeSettingField('usage_types', this.getItemIndex(itemToRemove)));
  }

  onClickNew = () => {
    const { usageTypes } = this.props;
    this.setState({
      currentItem: Immutable.Map(),
      index: usageTypes.size,
    });
  }

  renderPanelHeader = () => (
    <div>
      List of all usage types
      <div className="pull-right">
        <Button bsSize="xsmall" className="btn-primary" onClick={this.onClickNew}>
          <i className="fa fa-plus" />&nbsp;Add New
        </Button>
      </div>
    </div>
  );

  renderList = () => {
    const { usageTypes } = this.props;
    const fields = this.getListFields();
    const actions = this.getListActions();
    return (
      <List items={usageTypes} fields={fields} actions={actions} />
    );
  }

  getListFields = () => [
    { id: 'usage_type', title: 'Usage Type' },
    { id: 'label', title: 'Label' },
    { id: 'property_type', title: 'Property Type' },
    { id: 'invoice_uom', title: 'Invoice Unit of Measure' },
    { id: 'input_uom', title: 'Default Unit of Measure' },
  ]

  getListActions = () => [
    { type: 'edit', showIcon: true, helpText: 'Edit', onClick: this.onClickEdit },
    { type: 'remove', showIcon: true, helpText: 'Remove', onClick: this.onClickRemove },
  ]

  render() {
    const { propertyTypes } = this.props;
    const { showConfirmRemove, currentItem, itemToRemove } = this.state;
    const removeConfirmMessage = `Are you sure you want to remove usage type ${itemToRemove ? itemToRemove.get('usage_type', '') : ''}?`;

    return (
      <div>
        <ConfirmModal onOk={this.onClickRemoveOk} onCancel={this.onClickRemoveClose} show={showConfirmRemove} message={removeConfirmMessage} labelOk="Yes" />
        <Row>
          <Col lg={12}>
            <Panel header={this.renderPanelHeader()}>
              { this.renderList() }
            </Panel>
          </Col>
        </Row>
        {
          currentItem !== null &&
          <UsageTypeForm
            item={currentItem}
            propertyTypes={propertyTypes}
            onUpdateItem={this.onUpdateItem}
            onSave={this.handleSave}
            onCancel={this.onCancel}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  usageTypes: usageTypesDataSelector(state, props),
  propertyTypes: propertyTypeSelector(state, props),
});

export default connect(mapStateToProps)(UsageTypes);
