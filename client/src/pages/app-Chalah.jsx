import { Helmet } from 'react-helmet-async';
import { useAuth0 } from "@auth0/auth0-react";

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {

  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    isAuthenticated && (
      <>
        <Helmet>
          <title> Dashboard | Minimal UI </title>
        </Helmet>

        <AppView />
      </>
    )
  );
}
