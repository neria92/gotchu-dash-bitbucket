import React from 'react';
import {BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/dashboards/Dashboard'
import ProjectDetails from './components/projects/ProjectDetails'
import SingIn from './components/auth/SingIn'
import SingUp from './components/auth/SingUp'
import Users from './components/Users/Users'
import UserDetails from './components/Users/UserDetails'
import Captures from './components/captures/Captures'
import Microtasks from './components/Microtasks/Microtasks'
import MicrotaskDetails from './components/Microtasks/MicrotaskDetails'
import CaptureDetails from './components/captures/CaptureDetails'
import Pay from './components/pay/Pay'
import Payments from './components/payments/Payments'
import PaymentDetails from './components/payments/PaymentDetails'
import Charges from './components/charges/Charges'
import ChargeDetails from './components/charges/ChargeDetails'
import Analytics from './components/analytics/Analytics'
import CreateProject from './components/projects/CreateProject'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/project/:id' component={ProjectDetails} />
          <Route path='/singin' component={SingIn}/>
          <Route path='/singup' component={SingUp}/>
          <Route path='/users' component={Users}/>
          <Route path='/user/:id' component={UserDetails} />
          <Route path='/captures' component={Captures} />
          <Route path='/capture/:id' component={CaptureDetails} />
          <Route path='/microtasks' component={Microtasks} />
          <Route path='/microtask/:id' component={MicrotaskDetails} />
          <Route path='/pay' component={Pay} />
          <Route path='/payments' component={Payments} />
          <Route path='/payment' component={PaymentDetails} />
          <Route path='/charges' component={Charges} />
          <Route path='/charge' component={ChargeDetails} />
          <Route path='/analytics' component={Analytics} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
