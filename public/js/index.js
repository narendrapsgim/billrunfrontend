import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';

require('../scss/app.scss');

render(
  <Root />,
  document.getElementById('app')
);
