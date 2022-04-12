import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/store/store';
import App from './app/App';
import './index.css';
import 'antd/dist/antd.css';
import './css/font-awesome.min.css';
import { BrowserRouter } from 'react-router-dom';

const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById('app'));
