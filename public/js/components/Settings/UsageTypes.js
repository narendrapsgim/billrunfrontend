import React, { PropTypes, Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Panel, Col, Row, Button } from 'react-bootstrap';
import List from '../../components/List';
import { getSettings, updateSetting } from '../../actions/settingsActions';
import { usageTypesDataSelector, propertyTypeSelector } from '../../selectors/settingsSelector';
import UsageTypeForm from '../UsageTypes/UsageTypeForm';

class UsageTypes extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    usageTypesData: PropTypes.instanceOf(Immutable.List),
    propertyTypes: PropTypes.instanceOf(Immutable.List),
  };

  static defaultProps = {
    usageTypesData: Immutable.List(),
    propertyTypes: Immutable.List(),
  };

  state = {
    currentItem: null,
    index: -1,
  }

  componentWillMount() {
    this.props.dispatch(getSettings(['usage_types', 'property_types']));
  }

  getItemIndex = (item) => {
    const { usageTypesData } = this.props;
    return usageTypesData.indexOf(item);
  }

  onClickEdit = (item) => {
    this.setState({
      currentItem: item,
      index: this.getItemIndex(item),
    });
  };

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
        keys.forEach((key, index) => itemwithMutations.set(key, values[index]));
      }),
    });
  };

  onClickNew = () => {
    const { usageTypesData } = this.props;
    this.setState({
      currentItem: Immutable.Map(),
      index: usageTypesData.size,
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
    const { usageTypesData } = this.props;
    const fields = this.getListFields();
    const actions = this.getListActions();
    return (
      <List items={usageTypesData} fields={fields} actions={actions} />
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
  ]

  render() {
    const { propertyTypes } = this.props;
    const { currentItem } = this.state;

    return (
      <div>
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
            selectUoms
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  usageTypesData: usageTypesDataSelector(state, props),
  propertyTypes: propertyTypeSelector(state, props),
});

export default connect(mapStateToProps)(UsageTypes);
