import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import RequireAuth from '../containers/Authentication';
import App from '../containers/App';
import Dashboard from '../components/Dashboard';
import LoginPage from '../components/LoginPage';
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
import InvoicesList from '../components/InvoicesList';
import Settings from '../components/Settings';
import PaymentGateways from '../components/PaymentGateways';
import User from '../components/User';
import UserSetup from '../components/UserSetup';
import SelectTemplate from '../components/InputProcessor/SelectTemplate';
import Collections from '../components/Collections/Collections';
import Collection from '../components/Collection/Collection';
import InvoiceTemplate from '../components/InvoiceTemplate';
import AuditTrail from '../components/AuditTrail';

const routes = () => (
  <Route path="/" component={App}>
    <IndexRedirect to="/dashboard" component={RequireAuth(Dashboard)} />
    <Route path="/dashboard" component={RequireAuth(Dashboard)} title="Dashboard" />
    <Route path="/plans" component={RequireAuth(PlansList)} title="Plans" />
    <Route path="/plan(/:itemId)(/:action)" component={RequireAuth(Plan)} />
    <Route path="/customers" component={RequireAuth(CustomersList)} title="Customers" />
    <Route path="/products" component={RequireAuth(ProductsList)} title="Products" />
    <Route path="/product(/:itemId)(/:action)" component={RequireAuth(Product)} />
    <Route path="/services" component={RequireAuth(ServicesList)} title="Services" />
    <Route path="/service(/:itemId)(/:action)" component={RequireAuth(Service)} />
    <Route path="/customer" component={RequireAuth(CustomerSetup)} title="Customer" />
    <Route path="/input_processor" component={RequireAuth(InputProcessor)} title="Input Processor" />
    <Route path="/input_processors" component={RequireAuth(InputProcessorsList)} title="Input Processors" />
    <Route path="/export_generator" component={RequireAuth(ExportGenerator)} title="Export Generator" />
    <Route path="/export_generators" component={RequireAuth(ExportGeneratorsList)} title="Export Generators" />
    <Route path="/usage" component={RequireAuth(UsageList)} title="Usage" />
    <Route path="/invoices" component={RequireAuth(InvoicesList)} title="Invoices" />
    <Route path="/settings" component={RequireAuth(Settings)} title="General Settings" />
    <Route path="/payment_gateways" component={RequireAuth(PaymentGateways)} title="Payment Gateways" />
    <Route path="/users" component={RequireAuth(User)} title="Users" />
    <Route path="/user" component={RequireAuth(UserSetup)} title="User" />
    <Route path="/select_input_processor_template" component={RequireAuth(SelectTemplate)} title="Input Processor" />
    <Route path="/collections" component={RequireAuth(Collections)} title="Collections" />
    <Route path="/collection" component={RequireAuth(Collection)} title="Collection" />
    <Route path="/invoice-template" component={RequireAuth(InvoiceTemplate)} title="Invoice Template" />
    <Route path="/audit-trail" component={RequireAuth(AuditTrail)} title="Audit Trail" />
    <Route path="/login" component={LoginPage} title="Login" />
    <Route path="*" component={PageNotFound} />
  </Route>
);

export default routes;
