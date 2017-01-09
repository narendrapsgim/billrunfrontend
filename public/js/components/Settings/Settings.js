import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import DateTime from './DateTime';
import CurrencyTax from './CurrencyTax';
import Tenant from './Tenant';
import Security from './Security';
import EditMenu from './EditMenu';
import ActionButtons from '../Elements/ActionButtons';
import { getSettings, updateSetting, saveSettings, fetchFile } from '../../actions/settingsActions';
import { prossessMenuTree, combineMenuOverrides, initMainMenu } from '../../actions/guiStateActions/menuActions';


class Settings extends Component {

  static defaultProps = {
    activeTab: 1,
    settings: Immutable.Map(),
  };

  static propTypes = {
    activeTab: React.PropTypes.number,
    dispatch: React.PropTypes.func.isRequired,
    settings: React.PropTypes.instanceOf(Immutable.Map),
  };

  state = {
    activeTab: parseInt(this.props.activeTab, 10),
  };

  componentWillMount() {
    this.props.dispatch(getSettings(['pricing', 'billrun', 'tenant', 'shared_secret', 'menu']));
  }

  onChangeFieldValue = (category, id, value) => {
    this.props.dispatch(updateSetting(category, id, value));
  }

  onChangeMenuOrder = (path, newOrder) => {
    const { settings } = this.props;
    const mainMenuOverrides = settings.getIn(['menu', ...path], Immutable.Map()).withMutations(
      (mainMenuOverridesWithMutations) => {
        newOrder.forEach((order, key) => {
          if (mainMenuOverridesWithMutations.has(key)) {
            mainMenuOverridesWithMutations.setIn([key, 'order'], order);
          } else {
            const orderField = Immutable.Map({ order });
            mainMenuOverridesWithMutations.set(key, orderField);
          }
        });
      }
    );
    this.props.dispatch(updateSetting('menu', path, mainMenuOverrides));
  }

  onSave = () => {
    const { settings } = this.props;
    const categoryToSave = [];
    // save 'BillRun'
    if (settings.has('billrun')) {
      categoryToSave.push('billrun');
    }
    // save 'pricing'
    if (settings.has('pricing')) {
      categoryToSave.push('pricing');
    }
    // save 'tenant'
    if (settings.has('tenant')) {
      categoryToSave.push('tenant');
    }
    // save 'Menu'
    if (settings.has('menu')) {
      categoryToSave.push('menu');
    }
    if (categoryToSave.length) {
      this.props.dispatch(saveSettings(categoryToSave)).then(
        (status) => {
          if (status === true) { // settings successfully saved
            // Reload Menu
            const mainMenuOverrides = settings.getIn(['menu', 'main'], Immutable.Map());
            this.props.dispatch(initMainMenu(mainMenuOverrides));
            // Update logo
            if (categoryToSave.includes('tenant') && settings.getIn(['tenant', 'logo'], '').length > 0) {
              this.props.dispatch(fetchFile({ filename: settings.getIn(['tenant', 'logo'], '') }, 'logo'));
            }
          }
        }
      );
    }
  }

  handleSelectTab = (key) => {
    this.setState({ activeTab: key });
  }

  render() {
    const { props: { settings }, state: { activeTab } } = this;

    const currencyTax = settings.get('pricing', Immutable.Map());
    const datetime = settings.get('billrun', Immutable.Map());
    const sharedSecret = settings.get('shared_secret', Immutable.Map());
    const tenant = settings.get('tenant', Immutable.Map());
    const mainMenuOverrides = settings.getIn(['menu', 'main'], Immutable.Map());
    const mainMenu = prossessMenuTree(combineMenuOverrides(mainMenuOverrides), 'root');

    return (
      <div>
        <Tabs defaultActiveKey={activeTab} animation={false} id="SettingsTab" onSelect={this.handleSelectTab}>
          <Tab title="Company" eventKey={1}>
            <Panel style={{ borderTop: 'none' }}>
              <Tenant onChange={this.onChangeFieldValue} data={tenant} />
            </Panel>
          </Tab>

          <Tab title="Locale" eventKey={2}>
            <Panel style={{ borderTop: 'none' }}>
              <DateTime onChange={this.onChangeFieldValue} data={datetime} />
              <CurrencyTax onChange={this.onChangeFieldValue} data={currencyTax} />
            </Panel>
          </Tab>

          <Tab title="Menu" eventKey={3}>
            <Panel style={{ borderTop: 'none' }}>
              <EditMenu
                data={mainMenu}
                onChange={this.onChangeFieldValue}
                onChangeMenuOrder={this.onChangeMenuOrder}
              />
            </Panel>
          </Tab>

          <Tab title="Security" eventKey={4}>
            <Panel style={{ borderTop: 'none' }}>
              <Security data={sharedSecret} />
            </Panel>
          </Tab>

        </Tabs>

        <ActionButtons onClickSave={this.onSave} hideCancel={true} />

      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  activeTab: props.location.query.tab,
  settings: state.settings,
});
export default connect(mapStateToProps)(Settings);
