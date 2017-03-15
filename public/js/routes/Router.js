import React from 'react';
import { Route, IndexRoute } from 'react-router';

import RequireAuth from '../containers/Authentication';
import App from '../containers/App';
import Dashboard from '../components/Dashboard';
import LoginPage from '../components/LoginPage';
import WelcomePage from '../components/WelcomePage';
import PageNotFound from '../components/PageNotFound';
import CustomersList from '../components/CustomersList';
import CustomerSetup from '../components/CustomerSetup';
import ProductsList from '../components/ProductsList';
import Product from '../components/Product';
import PlansList from '../components/PlansList';
import Plan from '../components/Plan';
import ServicesList from '../components/ServicesList';
import Service from '../components/Service';
import InputProcessorsList from '../components/InputProcessorsList';
import ExportGenerator from '../components/ExportGenerator';
import ExportGeneratorsList from '../components/ExportGeneratorsList';
import InputProcessor from '../components/InputProcessor';
import UsageList from '../components/UsageList';
import RunCycle from '../components/Cycle';
import QueueList from '../components/QueueList';
import InvoicesList from '../components/InvoicesList';
import Settings from '../components/Settings';
import PaymentGateways from '../components/PaymentGateways';
import UserList from '../components/UserList';
import UserSetup from '../components/UserSetup';
import SelectTemplate from '../components/InputProcessor/SelectTemplate';
import Collections from '../components/Collections/Collections';
import Collection from '../components/Collection/Collection';
import InvoiceTemplate from '../components/InvoiceTemplate';
import PrepaidPlansList from '../components/PrepaidPlansList';
import PrepaidPlan from '../components/PrepaidPlan';
import AuditTrail from '../components/AuditTrail';
import PrepaidIncludesList from '../components/PrepaidIncludesList';
import PrepaidIncludeSetup from '../components/PrepaidInclude';
import ChargingPlansList from '../components/ChargingPlansList';
import ChargingPlanSetup from '../components/ChargingPlan';
import CustomFields from '../components/CustomFields';

const routes = () => (
  <Route path="/" component={App}>
    <IndexRoute component={RequireAuth(WelcomePage)} title="" />
    <Route path="/dashboard" component={RequireAuth(Dashboard)} title="Dashboard" />

    <Route path="plans">
      <IndexRoute component={RequireAuth(PlansList)} title="Plans" />
      <Route path="plan/:itemId" component={RequireAuth(Plan)} />
      <Route path="plan" component={RequireAuth(Plan)} />
    </Route>

    <Route path="services" >
      <IndexRoute component={RequireAuth(ServicesList)} title="Services" />
      <Route path="service/:itemId" component={RequireAuth(Service)} />
      <Route path="service" component={RequireAuth(Service)} />
    </Route>

    <Route path="products" >
      <IndexRoute component={RequireAuth(ProductsList)} title="Products" />
      <Route path="product/:itemId" component={RequireAuth(Product)} />
      <Route path="product" component={RequireAuth(Product)} />
    </Route>

    <Route path="prepaid_plans" >
      <IndexRoute component={RequireAuth(PrepaidPlansList)} title="Prepaid Plans" />
      <Route path="prepaid_plan/:itemId" component={RequireAuth(PrepaidPlan)} />
      <Route path="prepaid_plan" component={RequireAuth(PrepaidPlan)} />
    </Route>

    <Route path="charging_plans" >
      <IndexRoute component={RequireAuth(ChargingPlansList)} title="Buckets Group" />
      <Route path="charging_plan/:itemId" component={RequireAuth(ChargingPlanSetup)} />
      <Route path="charging_plan" component={RequireAuth(ChargingPlanSetup)} />
    </Route>

    <Route path="prepaid_includes" >
      <IndexRoute component={RequireAuth(PrepaidIncludesList)} title="Prepaid Buckets" />
      <Route path="prepaid_include/:itemId" component={RequireAuth(PrepaidIncludeSetup)} />
      <Route path="prepaid_include" component={RequireAuth(PrepaidIncludeSetup)} />
    </Route>

    <Route path="customers" >
      <IndexRoute component={RequireAuth(CustomersList)} title="Customers" />
      <Route path="customer/:itemId" component={RequireAuth(CustomerSetup)} />
      <Route path="customer" component={RequireAuth(CustomerSetup)} />
    </Route>

    <Route path="users" >
      <IndexRoute component={RequireAuth(UserList)} title="Users" />
      <Route path="user/:itemId" component={RequireAuth(UserSetup)} />
      <Route path="user" component={RequireAuth(UserSetup)} />
    </Route>

    <Route path="/input_processor" component={RequireAuth(InputProcessor)} />
    <Route path="/input_processors" component={RequireAuth(InputProcessorsList)} title="Input Processors" />
    <Route path="/export_generator" component={RequireAuth(ExportGenerator)} title="Export Generator" />
    <Route path="/export_generators" component={RequireAuth(ExportGeneratorsList)} title="Export Generators" />
    <Route path="/usage" component={RequireAuth(UsageList)} title="Usage" />
    <Route path="/run_cycle" component={RequireAuth(RunCycle)} title="Billing Cycle" />
    <Route path="/queue" component={RequireAuth(QueueList)} title="Queue" />
    <Route path="/invoices" component={RequireAuth(InvoicesList)} title="Invoices" />
    <Route path="/settings" component={RequireAuth(Settings)} title="General Settings" />
    <Route path="/payment_gateways" component={RequireAuth(PaymentGateways)} title="Payment Gateways" />
    <Route path="/select_input_processor_template" component={RequireAuth(SelectTemplate)} title="Create New Input Processor" />
    <Route path="/collections" component={RequireAuth(Collections)} title="Collection" />
    <Route path="/collection(/:itemId)(/:action)" component={RequireAuth(Collection)} />
    <Route path="/invoice-template" component={RequireAuth(InvoiceTemplate)} title="Invoice Template" />
    <Route path="/audit-trail" component={RequireAuth(AuditTrail)} title="Audit Trail" />
    <Route path="/custom_fields" component={RequireAuth(CustomFields)} title="Custom Fields" />
    <Route path="/login" component={LoginPage} title="Login" />
    <Route path="*" component={PageNotFound} />
  </Route>
);

export default routes;
