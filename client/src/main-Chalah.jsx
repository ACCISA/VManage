import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-5xgmej2w5p614oo1.us.auth0.com"
    clientId="Tkh4TJTD3MmILPTaoH55w6SIhuPIoDqm"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </Auth0Provider>
  
);
