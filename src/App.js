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
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
