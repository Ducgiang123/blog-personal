import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const showTooltip = () => {
  document.getElementById('tooltip').style.display = 'block';
};

const hideTooltip = () => {
  document.getElementById('tooltip').style.display = 'none';
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;
