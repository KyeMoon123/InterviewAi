// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import {Router, Route, Private} from '@redwoodjs/router'
import ChatLayout from "src/layouts/ChatLayout/ChatLayout";

import {useAuth} from './auth'
import AppLayout from "src/layouts/AppLayout/AppLayout";

const Routes = () => {
  return (

    <Router useAuth={useAuth}>
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/login" page={LoginPage} name="login"/>
      <AppLayout>
        <Route path="/success" page={CheckoutSuccessPage} name="checkoutSuccess" />
        <Route path="/pricing" page={PricingPage} name="pricing" />
        <Route path="/" page={HomePage} name="home"/>
      </AppLayout>
      <Private unauthenticated={"login"}>
        <Route path="/update-password" page={UpdatePasswordPage} name="updatePassword" />
        <ChatLayout>
          <Route path="/profile" page={ProfilePage} name="profile"/>
          <Route path="/chat" page={ChatPage} name="chat"/>
        </ChatLayout>
      </Private>
      <Private roles={['admin']} unauthenticated={"login"}>
        <Route path="/admin" page={AdminPage} name="admin"/>
      </Private>
      <Route notfound page={NotFoundPage}/>
    </Router>
  )
}

export default Routes
