import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { MoralisProvider } from 'react-moralis';
import { BrowserRouter } from 'react-router-dom';
import App from './Components/App/App';
import './index.css';
import AppConfig from './Config/AppConfig';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#587efc',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <MoralisProvider appId={AppConfig.moralisAppId} serverUrl={AppConfig.moralisServerUrl}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MoralisProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
