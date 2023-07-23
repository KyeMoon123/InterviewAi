import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'
import {configureAbly} from "@ably-labs/react-hooks";
import { Toaster } from '@redwoodjs/web/toast'

import { AuthProvider, useAuth } from './auth'

const clientId =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

configureAbly({
  authUrl: `http://localhost:8910/api/ablyTokenRequest?clientId=${clientId}`,
  clientId: '123',
});

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider useAuth={useAuth}>
          <Toaster />
          <Routes />
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
