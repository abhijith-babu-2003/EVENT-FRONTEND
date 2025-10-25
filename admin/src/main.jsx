import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import App from './App.jsx';
import store, { persistor } from './redux/store.js';
import { initializeAuth } from './redux/slices/adminSlice';
import ErrorBoundary from './components/ErrorBoundary'; 

const root = createRoot(document.getElementById('root'));

store.dispatch(initializeAuth());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);