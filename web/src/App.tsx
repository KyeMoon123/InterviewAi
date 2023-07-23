import {FatalErrorBoundary, RedwoodProvider} from '@redwoodjs/web'
import {RedwoodApolloProvider} from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'
import {Toaster} from '@redwoodjs/web/toast'

import { AuthProvider, useAuth } from './auth'
import {configureAbly} from "@ably-labs/react-hooks";

const clientId =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

configureAbly({
  authUrl: `${[process.env.UI_FUNCTIONS_SRC]}/ablyTokenRequest?clientId=${clientId}`,
  clientId: clientId,
});

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider useAuth={useAuth}>
          <Toaster/>
          <Routes/>
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
