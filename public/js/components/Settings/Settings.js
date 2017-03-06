import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'immutable';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import DateTime from './DateTime';
import Currency from './Currency';
import Tax from './Tax';
import Tenant from './Tenant';
import Security from './Security';
import EditMenu from './EditMenu';
import { ActionButtons } from '../Elements';
import { getCurrenciesQuery } from '../../common/ApiQueries';
import { apiBillRun } from '../../common/Api';
import { getSettings, updateSetting, saveSettings, fetchFile } from '../../actions/settingsActions';
import { prossessMenuTree, combineMenuOverrides, initMainMenu } from '../../actions/guiStateActions/menuActions';
import { tabSelector } from '../../selectors/entitySelector';


class Settings extends Component {

  static defaultProps = {
    activeTab: 1,
    settings: Immutable.Map(),
  };

  static propTypes = {
    activeTab: PropTypes.number,
    settings: PropTypes.instanceOf(Immutable.Map),
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.object,
    }),
    router: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    currencyOptions: [],
  };

  componentWillMount() {
    this.props.dispatch(getSettings(['pricing', 'billrun', 'tenant', 'shared_secret', 'menu', 'taxation', 'file_types']));
  }

  componentDidMount() {
    this.getCurrencies()
        .then((currencies) => {
          const currenciesBuild = currencies.options.map(function (currency) {
            return { label: `${currency.code} ${currency.symbol}`, value: currency.name };
          });
          this.setState({ currencyOptions: currenciesBuild });
        });
  }

  getCurrencies = () => {
    const query = getCurrenciesQuery();
    return apiBillRun(query)
      .then(success => ({ options: success.data[0].data.details }))
      .catch(() => ({ options: [] }));
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
    if (settings.has('taxation')) {
      categoryToSave.push('taxation');
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
              localStorage.removeItem('logo');
              this.props.dispatch(fetchFile({ filename: settings.getIn(['tenant', 'logo'], '') }, 'logo'));
            }
          }
        }
      );
    }
  }

  handleSelectTab = (tab) => {
    const { pathname, query } = this.props.location;
    this.props.router.push({
      pathname,
      query: Object.assign({}, query, { tab }),
    });
  }

  render() {
    const { props: { settings, activeTab }, state: { currencyOptions } } = this;

    const currency = settings.getIn(['pricing', 'currency'], '');
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
              <Currency onChange={this.onChangeFieldValue} data={currency} currencies={currencyOptions} />
            </Panel>
          </Tab>

          <Tab title="Tax" eventKey={3}>
            <Panel style={{ borderTop: 'none' }}>
              <Tax data={settings} onChange={this.onChangeFieldValue} />
            </Panel>
          </Tab>

          <Tab title="Menu" eventKey={4}>
            <Panel style={{ borderTop: 'none' }}>
              <EditMenu
                data={mainMenu}
                onChange={this.onChangeFieldValue}
                onChangeMenuOrder={this.onChangeMenuOrder}
              />
            </Panel>
          </Tab>

          <Tab title="Security" eventKey={5}>
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
  activeTab: tabSelector(state, props, 'settings'),
  settings: state.settings,
});
export default withRouter(connect(mapStateToProps)(Settings));
