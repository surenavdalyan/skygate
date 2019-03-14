import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'npm-font-open-sans/open-sans.scss';
import 'font-awesome/scss/font-awesome.scss';
import '../assets/index.scss';

import Root from './routes';
import store from './store/store';

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('app'),
);
