import React from 'react';
import { Router, Route, DefaultRoute, RouteHandler, Redirect, IndexRedirect } from 'react-router';

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
import InputProcessorsList from '../components/InputProcessorsList';
import InputProcessor from '../components/InputProcessor';
import UsageList from '../components/UsageList';
import InvoicesList from '../components/InvoicesList';
import Settings from '../components/Settings';
import PaymentGateways from '../components/PaymentGateways';
import User from '../components/User';
import UserSetup from '../components/UserSetup';
import SelectTemplate from '../components/InputProcessor/SelectTemplate';

export default () => {
  return (
    <Route path="/" component={App}>
      <IndexRedirect to="/dashboard" component={RequireAuth(Dashboard)} />
      <Route path="/dashboard"  component={RequireAuth(Dashboard)} title="Dashboard" />
      <Route path="/plans"  component={RequireAuth(PlansList)} title="Plans"/>
      <Route path="/plan" component={RequireAuth(Plan)} title="Create / Edit Plan"/>
      <Route path="/customers" component={RequireAuth(CustomersList)} title="Customers"/>
      <Route path="/products" component={RequireAuth(ProductsList)} title="Products"/>
      <Route path="/product" component={RequireAuth(Product)} title="Create / Edit Product" />
      <Route path="/customer" component={RequireAuth(CustomerSetup)} title="Customer"/>
      <Route path="/input_processor" component={RequireAuth(InputProcessor)} title="Input Processor"/>
      <Route path="/input_processors" component={RequireAuth(InputProcessorsList)} title="Input Processors"/>
      <Route path="/usage" component={RequireAuth(UsageList)} title="Usage" />
      <Route path="/invoices" component={RequireAuth(InvoicesList)} title="Invoices" />
      <Route path="/settings" component={RequireAuth(Settings)} title="Settings"/>
      <Route path="/payment_gateways" component={RequireAuth(PaymentGateways)} title="Payment Gateways" />
      <Route path="/users" component={RequireAuth(User)} title="Users"/>
      <Route path="/user" component={RequireAuth(UserSetup)} title="Users"/>      
      <Route path="/select_input_processor_template" component={RequireAuth(SelectTemplate)} title="Input Processor" />
      <Route path="/login" component={LoginPage} title="Login"/>
      <Route path="*" component={PageNotFound} />
    </Route>
  );
}
