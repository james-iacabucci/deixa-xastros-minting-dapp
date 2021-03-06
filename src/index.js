import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { MoralisProvider } from 'react-moralis';
import { BrowserRouter } from 'react-router-dom';
import App from './Components/App/App';
import './index.css';

const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#587efc',
    },
  },
});

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MoralisProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
