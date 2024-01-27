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
  domain="localhost"
  clientId="XqeGMydqwS3g7sWMmZgQhHJ1oebImmE2"
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
