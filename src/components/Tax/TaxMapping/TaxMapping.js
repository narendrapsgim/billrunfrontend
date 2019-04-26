import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { titleCase } from 'change-case';
import { Map, List } from 'immutable';
import { Tab } from 'react-bootstrap';
import {
  PriorityMapping,
  TabsWrapper,
  ActionButtons,
} from '@/components/Elements';
import {
  taxMappingSelector,
  taxlineKeyOptionsSelector,
  taxParamsKeyOptionsSelector,
} from '@/selectors/settingsSelector';
import {
  getSettings,
  updateSetting,
  pushToSetting,
  saveSettings,
  removeSettingField,
} from '@/actions/settingsActions';
import { setPageTitle } from '@/actions/guiStateActions/pageActions';


class TaxMapping extends Component {

  static propTypes = {
    type: PropTypes.string,
    taxMapping: PropTypes.instanceOf(Map),
    lineKeyOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ),
    location: PropTypes.object.isRequired,
  };

  static defaultProps = {
    type: 'tax',
    taxMapping: Map(),
    lineKeyOptions: [],
  };

  static pageTitle = 'Tax Mapping';

  state = {
    dirty: false,
    progress: false,
  };

  componentDidMount() {
    const { taxMapping } = this.props;
    this.props.dispatch(getSettings([
      'tax',
      'taxes.fields',
      'subscribers.account.fields',
      'subscribers.subscriber.fields',
      'rates.fields',
    ]));
    this.setPageTitle(taxMapping);
  }

  componentDidUpdate(prevProps) {
    const { taxMapping } = this.props;
    if (taxMapping.size !== prevProps.taxMapping.size) {
      this.setPageTitle(taxMapping);
    }
  }

  componentWillUnmount() {
    const { dirty } = this.state;
    if (dirty) {
      this.props.dispatch(getSettings('tax'));
    }
  }

  setPageTitle = (taxMapping) => {
    if (taxMapping.size === 1) {
      const newTitle = `${TaxMapping.pageTitle} | ${titleCase(taxMapping.keySeq().first())}`;
      this.props.dispatch(setPageTitle(newTitle));
    } else {
      this.props.dispatch(setPageTitle(TaxMapping.pageTitle));
    }
  }

  afterSave = (response) => {
    if (response === true || [1,2].includes(response.status)) {
      this.setState(() => ({ progress: false, dirty: false }));
    } else {
      this.setState(() => ({ progress: false }));
    }
  }

  onSave = () => {
    const { dirty } = this.state;
    if (dirty) {
      this.setState(() => ({ progress: true}));
      this.props.dispatch(saveSettings('tax'))
        .then(this.afterSave);
    }
  }

  onCancel = () => {
    const { dirty } = this.state;
    if (dirty) {
      this.setState(() => ({ progress: true, dirty: false }));
      this.props.dispatch(getSettings('tax'))
        .then(this.afterSave);
    }
  }

  onUpdate = (path, value) => {
    this.setState(() => ({ dirty: true }));
    this.props.dispatch(updateSetting('tax', ['mapping', ...path], value));
  }

  onAdd = (path, value) => {
    this.setState(() => ({ dirty: true }));
    this.props.dispatch(pushToSetting('tax', value, ['mapping', ...path]));
  }

  onAddCondition = (path) => {
    this.onAdd(path, Map({rate_key: 'key'}));
  }

  onAddPriority = (path) => {
    this.onAdd(path, List());
    // Add first condition to new Priority
    this.onAddCondition([...path, 0]);
  }

  onRemove = (path) => {
    this.setState(() => ({ dirty: true }));
    this.props.dispatch(removeSettingField('tax', ['mapping', ...path]));
  }

  renderPriority = (category, priorities) => {
    const { type, lineKeyOptions, taxParamsKeyOptions } = this.props;
    return (
      <PriorityMapping
        type={type}
        category={category}
        priorities={priorities}
        lineKeyOptions={lineKeyOptions}
        paramsKeyOptions={taxParamsKeyOptions}
        onAddCondition={this.onAddCondition}
        onAddPriority={this.onAddPriority}
        onRemove={this.onRemove}
        onUpdate={this.onUpdate}
      />
    );
  }

  renderTabs = () => {
    const { taxMapping, location } = this.props;
    if (taxMapping.size < 1) {
      return (
        <p>No Tax mapping categories</p>
      );
    }
    if (taxMapping.size === 1) {
      const category = taxMapping.keySeq().first();
      const priorities = taxMapping.first();
      return this.renderPriority(category, priorities);
    }
    return (
      <TabsWrapper id="TaxTabs" location={location}>
        {taxMapping.map((priorities, category) => (
          <Tab title={titleCase(category)} eventKey={category}>
            this.renderPriority(category, priorities);
          </Tab>
        ))
        .toArray()
        }
      </TabsWrapper>
    )
  }

  render() {
    const { dirty, progress } = this.state;
    const tabs = this.renderTabs();
    return (
      <>
        {tabs}
        <hr />
        <ActionButtons
          onClickCancel={this.onCancel}
          disableCancel={!dirty}
          onClickSave={this.onSave}
          disableSave={!dirty}
          progress={progress}
          disabled={!dirty}
        />
      </>
    );
  }
}


const mapStateToProps = (state, props) => ({
  lineKeyOptions: taxlineKeyOptionsSelector(state, props),
  taxParamsKeyOptions: taxParamsKeyOptionsSelector(state, props),
  taxMapping: taxMappingSelector(state, props),
});


export default connect(mapStateToProps)(TaxMapping);
